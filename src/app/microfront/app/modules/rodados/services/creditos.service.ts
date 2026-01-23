import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreditoData } from '../interfaces/lista-credito.dto';
import { SettingsService } from 'src/app/core/services/settings.service';
import { EstadosCreditos } from 'src/app/shared/models/estados-creditos';

@Injectable({ providedIn: 'root' })
export class CreditosService {
  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  getListaCreditos(idPersona: number): Observable<CreditoData[]> {
    const url = `${this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl}PersonasFisicas/${idPersona}/creditos`;

    return this.http.get<CreditoData[]>(url).pipe(
      map((res) => res || []),
      catchError((error) => {
        return throwError(() => new Error('Error al obtener la lista de prestamos'));
      })
    );
  }

  getPrestamosYSolicitudes(idPersona: number): Observable<{
    prestamos: CreditoData[];
    solicitudes: CreditoData[];
    todos: CreditoData[];
  }> {
    return this.getListaCreditos(idPersona).pipe(
      map((creditos) => {
        const creditosFormateados = creditos.map((credito) => ({
          ...credito,
          estado: this.transformarEstado(credito.estado),
          idSolicitudSinOrigen: this.transformarSolicitud(credito.idSolicitud)
        }));

        const prestamos = creditosFormateados.filter((c) => c.tipoOperacion === 'prestamo');
        const solicitudes = creditosFormateados.filter((c) => c.tipoOperacion === 'solicitud');

        return {
          prestamos,
          solicitudes,
          todos: creditosFormateados
        };
      })
    );
  }

  private transformarEstado(estado: string): string {
    const estados = {
      P: EstadosCreditos.Pendiente,
      D: EstadosCreditos.EnProceso,
      Pendiente: 'P',
      'En proceso': 'D'
    };
    return estados[estado] || estado;
  }

  private transformarSolicitud(solicitud: string): string {
    return solicitud.replace('P-', '');
  }
}
