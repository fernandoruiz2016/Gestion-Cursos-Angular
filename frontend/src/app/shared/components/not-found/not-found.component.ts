import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="card">
        <span class="icon">❓</span>
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <button [routerLink]="['/']" class="btn-primary">Volver al Inicio</button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f7fafc; }
    .card { background: white; padding: 4rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center; }
    .icon { font-size: 5rem; display: block; margin-bottom: 1.5rem; }
    h1 { color: #2d3748; margin-bottom: 1rem; }
    p { color: #718096; margin-bottom: 2rem; }
    .btn-primary { background: #4a90e2; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; text-decoration: none; }
  `]
})
export class NotFoundComponent {}
