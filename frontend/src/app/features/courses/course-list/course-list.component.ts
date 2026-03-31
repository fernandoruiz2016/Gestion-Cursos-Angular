import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { UserService } from '../../../core/services/user.service';
import { Course } from '../../../core/models/course.model';
import { User, UserRole } from '../../../core/models/user.model';
import { RolePipe } from '../../../core/pipes/role.pipe';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RolePipe],
  template: `
    <div class="course-list-container">
      <div class="page-header">
        <div>
          <h1>Gestión de Cursos</h1>
          <p>Administre el catálogo de cursos y asigne profesores.</p>
        </div>
        <button class="btn-primary" (click)="openCreate()">Nuevo Curso</button>
      </div>

      <div class="card">
        @if (loading) {
          <div class="loader-container">
            <div class="spinner"></div>
            <p>Cargando cursos...</p>
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Profesor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (course of courses; track course.Id_Curso) {
                <tr>
                  <td>{{ course.Nombre }}</td>
                  <td>{{ course.Descripcion }}</td>
                  <td>{{ getProfessorName(course.Id_Profesor) }}</td>
                  <td>
                    <button class="btn-icon edit" (click)="openEdit(course)" title="Editar">✏️</button>
                    <button class="btn-icon delete" (click)="deleteCourse(course.Id_Curso)" title="Eliminar">🗑️</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="empty-state">No hay cursos registrados.</td>
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
            <h2>{{ editingCourse ? 'Editar' : 'Nuevo' }} Curso</h2>
            <form [formGroup]="courseForm" (ngSubmit)="saveCourse()">
              <div class="form-group">
                <label>Nombre del Curso</label>
                <input type="text" formControlName="Nombre">
                @if (courseForm.get('Nombre')?.touched && courseForm.get('Nombre')?.invalid) {
                  <small class="error-text">Requerido</small>
                }
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <textarea formControlName="Descripcion" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Profesor Asignado</label>
                <select formControlName="Id_Profesor">
                  @for (prof of professors; track prof.Id_Usuario) {
                    <option [value]="prof.Id_Usuario">
                      {{ prof.Nombre }} {{ prof.Apellido }} ({{ prof.Rol | roleName }})
                    </option>
                  }
                </select>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary" [disabled]="courseForm.invalid">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .course-list-container { max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { margin: 0; color: #2d3748; }
    p { margin: 0.25rem 0 0; color: #718096; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 1.5rem; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 1rem; border-bottom: 2px solid #edf2f7; color: #4a5568; }
    .table td { padding: 1rem; border-bottom: 1px solid #edf2f7; color: #2d3748; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.2rem; margin-right: 0.5rem; transition: transform 0.2s; }
    .btn-icon:hover { transform: scale(1.2); }
    .btn-primary { background: #48bb78; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
    .btn-secondary { background: #edf2f7; color: #4a5568; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; }
    input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e0; border-radius: 6px; box-sizing: border-box; font-family: inherit; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    .empty-state { text-align: center; padding: 3rem; color: #a0aec0; }
    .error-text { color: #e53e3e; font-size: 0.75rem; display: block; margin-top: 0.25rem; }
    .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; }
    .spinner { border: 4px solid rgba(0,0,0,0.1); width: 40px; height: 40px; border-radius: 50%; border-left-color: #48bb78; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  courses: Course[] = [];
  professors: User[] = [];
  showModal = false;
  editingCourse: Course | null = null;
  loading = true;

  courseForm: FormGroup = this.fb.group({
    Nombre: ['', [Validators.required]],
    Descripcion: [''],
    Id_Profesor: [null, [Validators.required]]
  });

  ngOnInit() {
    this.loadCourses();
    this.loadProfessors();
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
    this.courseForm.reset({ Id_Profesor: this.professors[0]?.Id_Usuario || null });
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
