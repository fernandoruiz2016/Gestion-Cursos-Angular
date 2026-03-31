export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESOR = 'PROFESOR',
  ESTUDIANTE = 'ESTUDIANTE'
}

export interface User {
  Id_Usuario: number;
  Nombre: string;
  Apellido: string;
  Email: string;
  Rol: UserRole;
  Clave?: string;
}
