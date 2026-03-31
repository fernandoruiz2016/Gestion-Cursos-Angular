import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      @if (loading) {
        <div class="loader-container">
          <div class="spinner"></div>
          <p>Cargando información...</p>
        </div>
      } @else {
        <div class="welcome-section">
          <h1>¡Hola, {{ user?.Nombre }}! 👋</h1>
          <p>Bienvenido al sistema de gestión de IDAT. Aquí tienes un resumen de la plataforma.</p>
        </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon users">👥</div>
          <div class="stat-info">
            <span class="stat-label">Usuarios Totales</span>
            <span class="stat-value">{{ userCount }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon courses">📚</div>
          <div class="stat-info">
            <span class="stat-label">Cursos Activos</span>
            <span class="stat-value">{{ courseCount }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon role">🛡️</div>
          <div class="stat-info">
            <span class="stat-label">Tu Rol</span>
            <span class="stat-value">{{ user?.Rol }}</span>
          </div>
        </div>
      </div>

      <div class="quick-links card" *ngIf="user?.Rol === 'ADMIN'">
        <h2>Tareas Rápidas</h2>
        <div class="links-list">
          <div class="link-item">Configurar nuevos cursos académicos</div>
          <div class="link-item">Revisar permisos de usuarios</div>
          <div class="link-item">Generar reportes de asistencia</div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [`
    .home-container { max-width: 1000px; margin: 0 auto; }
    .welcome-section { margin-bottom: 2.5rem; }
    h1 { font-size: 2.25rem; color: #2d3748; margin-bottom: 0.5rem; }
    p { font-size: 1.1rem; color: #718096; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; }
    .stat-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 1rem; }
    .stat-icon { font-size: 2.5rem; padding: 0.5rem; border-radius: 12px; }
    .stat-icon.users { background: #ebf4ff; }
    .stat-icon.courses { background: #e6fffa; }
    .stat-icon.role { background: #fff5f5; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-label { font-size: 0.875rem; color: #718096; font-weight: 600; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #1a202c; }
    .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .quick-links h2 { margin-bottom: 1.5rem; font-size: 1.25rem; color: #2d3748; }
    .link-item { padding: 1rem; border-bottom: 1px solid #edf2f7; color: #4a5568; }
    .link-item:last-child { border-bottom: none; }
    .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; }
    .spinner { border: 4px solid rgba(0,0,0,0.1); width: 40px; height: 40px; border-radius: 50%; border-left-color: #4a90e2; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class DashboardHomeComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);

  user = this.authService.getUser();
  userCount = 0;
  courseCount = 0;
  loading = true;

  ngOnInit() {
    this.loading = true;
    forkJoin({
      users: this.userService.getAll(),
      courses: this.courseService.getAll()
    }).subscribe({
      next: (data) => {
        this.userCount = data.users.length;
        this.courseCount = data.courses.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
