import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { UserService } from '../../../core/services/user.service';
import { MatriculaService } from '../../../core/services/matricula.service';
import { Course } from '../../../core/models/course.model';
import { User, UserRole } from '../../../core/models/user.model';
import { Matricula } from '../../../core/models/matricula.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-matricula-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matricula-list.component.html',
  styleUrl: './matricula-list.component.css'
})
export class MatriculaListComponent implements OnInit {
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  private matriculaService = inject(MatriculaService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  courses: Course[] = [];
  estudiantes: User[] = [];
  matriculados: Matricula[] = [];
  userRole: UserRole | undefined;
  currentUserId: number | undefined;
  
  selectedCourseId: number | null = null;
  selectedCourse: Course | null = null;
  selectedEstudianteId: number | null = null;

  loading = true;
  loadingMatriculas = false;
  error = '';
  success = '';

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userRole = user.Rol as UserRole;
      this.currentUserId = user.Id_Usuario;
    }
    
    if (this.userRole === UserRole.ESTUDIANTE) {
      this.loadMisCursos();
    } else {
      this.loadInitialData();
    }
  }

  loadMisCursos() {
    this.loading = true;
    if (this.currentUserId) {
       this.matriculaService.getAll(undefined, this.currentUserId).subscribe({
         next: (data) => {
           this.matriculados = data;
           this.loading = false;
           this.cdr.detectChanges();
         },
         error: () => {
           this.loading = false;
         }
       });
    }
  }

  loadInitialData() {
    this.loading = true;
    this.courseService.getAll().subscribe(courses => {
      if (this.userRole === UserRole.PROFESOR) {
        this.courses = courses.filter(c => c.Id_Profesor === this.currentUserId);
      } else {
        this.courses = courses;
      }

      this.userService.getAll().subscribe(users => {
        this.estudiantes = users.filter(u => u.Rol === UserRole.ESTUDIANTE);
        this.loading = false;
        this.cdr.detectChanges();
      });
    });
  }

  onCourseSelect() {
    this.error = '';
    this.success = '';
    if (!this.selectedCourseId) {
      this.selectedCourse = null;
      this.matriculados = [];
      return;
    }

    this.selectedCourse = this.courses.find(c => c.Id_Curso == this.selectedCourseId) || null;
    this.loadMatriculas();
  }

  loadMatriculas() {
    if (!this.selectedCourseId) return;
    this.loadingMatriculas = true;
    this.matriculaService.getAll(this.selectedCourseId).subscribe({
      next: (data) => {
        this.matriculados = data;
        
        // Update local course matriculados count purely for display
        if (this.selectedCourse) {
          this.selectedCourse.Matriculados = this.matriculados.length;
        }

        this.loadingMatriculas = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingMatriculas = false;
      }
    });
  }

  get vacantesDisponibles(): number {
    if (!this.selectedCourse) return 0;
    const vacantes = this.selectedCourse.Vacantes || 0;
    const ocupadas = this.selectedCourse.Matriculados || 0;
    return Math.max(0, vacantes - ocupadas);
  }

  matricular() {
    this.error = '';
    this.success = '';
    if (!this.selectedCourseId || !this.selectedEstudianteId) {
      this.error = 'Por favor selecciona un curso y un estudiante.';
      return;
    }

    if (this.vacantesDisponibles <= 0) {
      this.error = 'No hay vacantes disponibles para este curso.';
      return;
    }

    this.matriculaService.create(this.selectedCourseId, this.selectedEstudianteId).subscribe({
      next: () => {
        this.success = 'Estudiante matriculado exitosamente.';
        this.selectedEstudianteId = null;
        
        // Refresh 
        this.loadMatriculas();
        this.courseService.getAll().subscribe(c => {
            this.courses = c; // Refresh global counts
        });
      },
      error: (err) => {
        this.error = err.error.message || 'Error al matricular.';
      }
    });
  }

  desmatricular(id_matricula: number) {
    if (confirm('¿Estás seguro de efectuar el retiro de este curso?')) {
      this.error = '';
      this.success = '';
      this.matriculaService.delete(id_matricula).subscribe({
        next: () => {
          this.success = 'Retiro exitoso.';
          if (this.userRole === UserRole.ESTUDIANTE) {
             this.loadMisCursos();
          } else {
             this.loadMatriculas();
             this.courseService.getAll().subscribe(c => {
                 this.courses = c; // Refresh global counts
             });
          }
        },
        error: () => {
          this.error = 'Error al remover la matrícula.';
        }
      });
    }
  }
}
