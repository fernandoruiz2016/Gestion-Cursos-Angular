import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="forbidden-container">
      <div class="card">
        <span class="icon">🚫</span>
        <h1>Acceso Denegado</h1>
        <p>No tienes los permisos necesarios para acceder a esta sección.</p>
        <button [routerLink]="['/dashboard']" class="btn-primary">Volver al Panel</button>
      </div>
    </div>
  `,
  styles: [`
    .forbidden-container { display: flex; justify-content: center; align-items: center; height: 80vh; }
    .card { background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 10px 15px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
    .icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
    h1 { color: #e53e3e; margin-bottom: 1rem; }
    p { color: #4a5568; margin-bottom: 2rem; }
    .btn-primary { background: #4a90e2; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; text-decoration: none; }
  `]
})
export class ForbiddenComponent {}
