import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../core/models/user.model';
import { RolePipe } from '../../../core/pipes/role.pipe';
import { LucideAngularModule, Plus, Pencil, Trash2, X } from 'lucide-angular';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RolePipe, LucideAngularModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  readonly PlusIcon = Plus;
  readonly EditIcon = Pencil;
  readonly DeleteIcon = Trash2;
  readonly CloseIcon = X;
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  roles = Object.values(UserRole);
  showModal = false;
  editingUser: User | null = null;
  loading = true;
  
  userForm: FormGroup = this.fb.group({
    Nombre: ['', [Validators.required]],
    Apellido: ['', [Validators.required]],
    Email: ['', [Validators.required, Validators.email]],
    Rol: [UserRole.ESTUDIANTE, [Validators.required]],
    Clave: ['']
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openCreate() {
    this.editingUser = null;
    this.userForm.reset({ Rol: UserRole.ESTUDIANTE });
    this.userForm.get('Clave')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('Clave')?.updateValueAndValidity();
    this.showModal = true;
  }

  openEdit(user: User) {
    this.editingUser = user;
    this.userForm.patchValue(user);
    this.userForm.get('Clave')?.clearValidators();
    this.userForm.get('Clave')?.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveUser() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;
    
    if (this.editingUser) {
      this.userService.update(this.editingUser.Id_Usuario, userData).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    } else {
      this.userService.create(userData).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.delete(id).subscribe(() => this.loadUsers());
    }
  }
}
