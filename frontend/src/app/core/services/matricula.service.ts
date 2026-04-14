import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matricula } from '../models/matricula.model';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private http = inject(HttpClient);
  // Asumiendo que el proxy conf. o la URL base la tenemos de algún sitio.
  // Revisaré los otros servicios para ver cómo obtienen la URL. Si es hardcoded la arreglo.
  private apiUrl = 'http://localhost:3000/api/matriculas'; 

  getAll(id_curso?: number, id_estudiante?: number): Observable<Matricula[]> {
    let url = this.apiUrl;
    const params = [];
    if (id_curso) params.push(`id_curso=${id_curso}`);
    if (id_estudiante) params.push(`id_estudiante=${id_estudiante}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    return this.http.get<Matricula[]>(url);
  }

  create(id_curso: number, id_estudiante: number): Observable<Matricula> {
    return this.http.post<Matricula>(this.apiUrl, { id_curso, id_estudiante });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteByCourseAndUser(id_curso: number, id_estudiante: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/curso/${id_curso}/estudiante/${id_estudiante}`);
  }
}
