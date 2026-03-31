import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getUser();
  const allowedRoles = route.data['roles'] as Array<UserRole>;

  if (user && allowedRoles.includes(user.Rol)) {
    return true;
  }

  // Redirect to dashboard or login if access is denied
  if (authService.isLoggedIn()) {
    console.warn(`User with role ${user?.Rol} is not allowed to access ${state.url}`);
    return router.createUrlTree(['/forbidden']);
  }

  return router.createUrlTree(['/login']);
};
