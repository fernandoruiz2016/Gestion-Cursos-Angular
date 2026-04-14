export interface Course {
  Id_Curso: number;
  Nombre: string;
  Descripcion: string;
  Id_Profesor: number;
  Vacantes?: number;
  Matriculados?: number;
}
