import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, HasRoleDirective],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>IDAT Courses</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/dashboard/home" routerLinkActive="active" class="nav-item">Resumen</a>
          <a *appHasRole="roles.ADMIN" routerLink="/dashboard/users" routerLinkActive="active" class="nav-item">Usuarios</a>
          <a *appHasRole="[roles.ADMIN, roles.PROFESOR]" routerLink="/dashboard/courses" routerLinkActive="active" class="nav-item">Cursos</a>
        </nav>
        <div class="sidebar-footer">
          @if (user) {
            <div class="user-info">
              <span class="user-name">{{ user.Nombre }} {{ user.Apellido }}</span>
              <span class="user-role">{{ user.Rol }}</span>
            </div>
          }
          <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
        </div>
      </aside>
      <main class="content">
        <header class="top-header">
          <h1>Panel de Control</h1>
        </header>
        <div class="main-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout { display: flex; height: 100vh; }
    .sidebar {
      width: 250px;
      background: #2d3748;
      color: white;
      display: flex;
      flex-direction: column;
    }
    .sidebar-header { padding: 1.5rem; text-align: center; border-bottom: 1px solid #4a5568; }
    .sidebar-nav { flex: 1; padding: 1rem 0; }
    .nav-item {
      display: block;
      padding: 0.75rem 1.5rem;
      color: #cbd5e0;
      text-decoration: none;
      transition: all 0.3s;
    }
    .nav-item:hover, .nav-item.active { background: #4a5568; color: white; }
    .sidebar-footer { padding: 1rem; border-top: 1px solid #4a5568; }
    .user-info { margin-bottom: 1rem; }
    .user-name { display: block; font-weight: bold; }
    .user-role { font-size: 0.8rem; opacity: 0.7; }
    .btn-logout {
      width: 100%;
      padding: 0.5rem;
      background: #e53e3e;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .content { flex: 1; display: flex; flex-direction: column; background: #f7fafc; overflow-y: auto; }
    .top-header { padding: 1rem 2rem; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .main-body { padding: 2rem; }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  user = this.authService.getUser();
  roles = UserRole;

  logout() {
    this.authService.logout();
  }
}
