import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models/course.model';
import { User, UserRole } from '../../../core/models/user.model';
import { RolePipe } from '../../../core/pipes/role.pipe';
import { LucideAngularModule, Plus, Pencil, Trash2, X } from 'lucide-angular';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RolePipe, LucideAngularModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  readonly PlusIcon = Plus;
  readonly EditIcon = Pencil;
  readonly DeleteIcon = Trash2;
  readonly CloseIcon = X;
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  courses: Course[] = [];
  professors: User[] = [];
  showModal = false;
  editingCourse: Course | null = null;
  loading = true;
  userRole: UserRole | undefined;
  currentUserId: number | undefined;

  courseForm: FormGroup = this.fb.group({
    Nombre: ['', [Validators.required]],
    Descripcion: [''],
    Id_Profesor: [null, [Validators.required]],
    Vacantes: [30, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userRole = user.Rol as UserRole;
      this.currentUserId = user.Id_Usuario;
    }

    this.loadCourses();
    this.loadProfessors();
  }

  canModifyCourse(course: Course): boolean {
    if (this.userRole === UserRole.ADMIN) return true;
    if (this.userRole === UserRole.PROFESOR && this.currentUserId === course.Id_Profesor) return true;
    return false;
  }

  loadCourses() {
    this.loading = true;
    this.courseService.getAll().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProfessors() {
    this.userService.getAll().subscribe(users => {
      this.professors = users.filter(u => u.Rol === UserRole.PROFESOR || u.Rol === UserRole.ADMIN);
    });
  }

  getProfessorName(id: number): string {
    const prof = this.professors.find(p => p.Id_Usuario === id);
    return prof ? `${prof.Nombre} ${prof.Apellido}` : 'No asignado';
  }

  openCreate() {
    this.editingCourse = null;
    this.courseForm.reset({ Id_Profesor: this.professors[0]?.Id_Usuario || null, Vacantes: 30 });
    this.showModal = true;
  }

  openEdit(course: Course) {
    this.editingCourse = course;
    this.courseForm.patchValue(course);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCourse() {
    if (this.courseForm.invalid) return;

    const courseData = this.courseForm.value;

    if (this.editingCourse) {
      this.courseService.update(this.editingCourse.Id_Curso, courseData).subscribe(() => {
        this.loadCourses();
        this.closeModal();
      });
    } else {
      this.courseService.create(courseData).subscribe(() => {
        this.loadCourses();
        this.closeModal();
      });
    }
  }

  deleteCourse(id: number) {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      this.courseService.delete(id).subscribe(() => this.loadCourses());
    }
  }
}
