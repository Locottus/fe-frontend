import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SoftTokenEstadoDTO } from '../interfaces/soft-token.dto';

@Injectable({
  providedIn: 'root'
})
export class SoftTokenService {
  private baseUrl: string;
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
    private authService: AuthService
  ) {
    this.apiUrl = `${this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl}`;
  }

  /**
   * Determina si el usuario está en un dispositivo móvil
   * @returns true si es móvil, false si es desktop
   */
  public isMobile(): boolean {
    return this.authService.getAuthMethod() === 'mobile';
  }

  /**
   * Determina si el usuario está en desktop
   * @returns true si es desktop, false si es móvil
   */
  public isDesktop(): boolean {
    return this.authService.getAuthMethod() !== 'mobile';
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

      const result = await this.http.get<SoftTokenEstadoDTO>(url).pipe(
        catchError((error) => {
          console.error('Error al obtener estado del soft token:', error);
          throw error;
        })
      ).toPromise();

      return result;
    } catch (error) {
      throw new Error('No se pudo obtener el estado del soft token');
    }
  }
}
