import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../models/user.model';

@Pipe({
  name: 'roleName',
  standalone: true
})
export class RolePipe implements PipeTransform {
  transform(value: UserRole | string): string {
    switch (value) {
      case UserRole.ADMIN: return 'Administrador';
      case UserRole.PROFESOR: return 'Profesor';
      case UserRole.ESTUDIANTE: return 'Estudiante';
      default: return value;
    }
  }
}
