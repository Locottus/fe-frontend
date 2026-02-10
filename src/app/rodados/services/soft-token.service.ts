import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { SoftTokenEstadoDTO } from '../interfaces/soft-token.dto';

@Injectable({
  providedIn: 'root',
})
export class SoftTokenService {
  private baseUrl: string = '';
  private apiUrl: string = '';

  constructor(private http: HttpClient) {
    this.apiUrl = this.baseUrl;
  }

  /**
   * Obtiene el estado del soft token a través del BFF
   * Endpoint: GET /soft-token/estado/{idPersona}
   * @param idPersona ID de la persona
   * @returns Promise con el estado del token
   */
  async obtenerEstadoToken(idPersona: number): Promise<SoftTokenEstadoDTO> {
    try {
      const url = `${this.apiUrl}soft-token/estado/${idPersona}`;

      const result = await this.http
        .get<SoftTokenEstadoDTO>(url)
        .pipe(
          catchError((error) => {
            console.error('Error al obtener estado del soft token:', error);
            throw error;
          }),
        )
        .toPromise();

      return result || { intentosRestantes: 3, bloqueado: false, activo: true };
    } catch (error) {
      throw new Error('No se pudo obtener el estado del soft token');
    }
  }
}
