import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../core/models/user.model';
import { RolePipe } from '../../../core/pipes/role.pipe';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RolePipe],
  template: `
    <div class="user-list-container">
      <div class="page-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Administre los usuarios del sistema y sus roles.</p>
        </div>
        <button class="btn-primary" (click)="openCreate()">Nuevo Usuario</button>
      </div>

      <div class="card">
        @if (loading) {
          <div class="loader-container">
            <div class="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users; track user.Id_Usuario) {
                <tr>
                  <td>{{ user.Nombre }}</td>
                  <td>{{ user.Apellido }}</td>
                  <td>{{ user.Email }}</td>
                  <td>
                    <span class="badge" [ngClass]="user.Rol.toLowerCase()">
                      {{ user.Rol | roleName }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-icon edit" (click)="openEdit(user)" title="Editar">✏️</button>
                    <button class="btn-icon delete" (click)="deleteUser(user.Id_Usuario)" title="Eliminar">🗑️</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="empty-state">No hay usuarios registrados.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        }
      </div>

      @if (showModal) {
        <div class="modal-overlay">
          <div class="modal-content">
            <h2>{{ editingUser ? 'Editar' : 'Nuevo' }} Usuario</h2>
            <form [formGroup]="userForm" (ngSubmit)="saveUser()">
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre</label>
                  <input type="text" formControlName="Nombre">
                  @if (userForm.get('Nombre')?.touched && userForm.get('Nombre')?.invalid) {
                    <small class="error-text">Requerido</small>
                  }
                </div>
                <div class="form-group">
                  <label>Apellido</label>
                  <input type="text" formControlName="Apellido">
                  @if (userForm.get('Apellido')?.touched && userForm.get('Apellido')?.invalid) {
                    <small class="error-text">Requerido</small>
                  }
                </div>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" formControlName="Email">
                @if (userForm.get('Email')?.touched && userForm.get('Email')?.invalid) {
                  <small class="error-text">Email válido requerido</small>
                }
              </div>
              @if (!editingUser) {
                <div class="form-group">
                  <label>Clave</label>
                  <input type="password" formControlName="Clave">
                  @if (userForm.get('Clave')?.touched && userForm.get('Clave')?.invalid) {
                    <small class="error-text">Requerido (min 6 caracteres)</small>
                  }
                </div>
              }
              <div class="form-group">
                <label>Rol</label>
                <select formControlName="Rol">
                  @for (role of roles; track role) {
                    <option [value]="role">{{ role | roleName }}</option>
                  }
                </select>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary" [disabled]="userForm.invalid">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .user-list-container { max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { margin: 0; color: #2d3748; }
    p { margin: 0.25rem 0 0; color: #718096; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 1.5rem; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 1rem; border-bottom: 2px solid #edf2f7; color: #4a5568; }
    .table td { padding: 1rem; border-bottom: 1px solid #edf2f7; color: #2d3748; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: bold; }
    .badge.admin { background: #fed7d7; color: #9b2c2c; }
    .badge.profesor { background: #c6f6d5; color: #22543d; }
    .badge.estudiante { background: #ebf4ff; color: #2b6cb0; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.2rem; margin-right: 0.5rem; transition: transform 0.2s; }
    .btn-icon:hover { transform: scale(1.2); }
    .btn-primary { background: #4a90e2; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
    .btn-secondary { background: #edf2f7; color: #4a5568; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; }
    input, select { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e0; border-radius: 6px; box-sizing: border-box; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    .empty-state { text-align: center; padding: 3rem; color: #a0aec0; }
    .error-text { color: #e53e3e; font-size: 0.75rem; display: block; margin-top: 0.25rem; }
    .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; }
    .spinner { border: 4px solid rgba(0,0,0,0.1); width: 40px; height: 40px; border-radius: 50%; border-left-color: #4a90e2; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class UserListComponent implements OnInit {
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
