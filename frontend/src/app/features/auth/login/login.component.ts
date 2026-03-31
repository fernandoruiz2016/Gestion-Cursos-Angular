import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Gestión de Cursos</h1>
        <p>Inicie sesión para continuar</p>
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="Email" required>
            @if (loginForm.get('Email')?.touched && loginForm.get('Email')?.invalid) {
              <small class="error-text">Email válido es requerido</small>
            }
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="Clave" required>
            @if (loginForm.get('Clave')?.touched && loginForm.get('Clave')?.invalid) {
              <small class="error-text">Contraseña es requerida</small>
            }
          </div>
          <button type="submit" class="btn-login" [disabled]="loading || loginForm.invalid">
            {{ loading ? 'Cargando...' : 'Entrar' }}
          </button>
          @if (error) {
            <div class="error-msg">{{ error }}</div>
          }
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card {
      background: rgba(255, 255, 255, 0.9);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    .form-group {
      margin-bottom: 1rem;
      text-align: left;
    }
    label { display: block; margin-bottom: 0.5rem; color: #4a5568; }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      box-sizing: border-box;
    }
    .btn-login {
      width: 100%;
      padding: 0.75rem;
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }
    .btn-login:hover { background: #357abd; }
    .btn-login:disabled { background: #a0aec0; cursor: not-allowed; }
    .error-msg { color: #e53e3e; margin-top: 1rem; }
    .error-text { color: #e53e3e; font-size: 0.75rem; display: block; margin-top: 0.25rem; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    Email: ['', [Validators.required, Validators.email]],
    Clave: ['', [Validators.required]]
  });

  loading = false;
  error = '';

  onLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';
    const credentials: any = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }
}
