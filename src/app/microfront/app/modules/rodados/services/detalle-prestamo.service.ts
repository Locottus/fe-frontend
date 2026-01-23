import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DetallePrestamoDTO } from '../interfaces/detalle-prestamo.dto';
import { SettingsService } from 'src/app/core/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class DetallePrestamoService {
  detalleUrl: string;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.detalleUrl = `${this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl}`;
  }

  getDetallePrestamo(idPrestamo: number, idPersona?: number, idSolicitud?: string): Observable<DetallePrestamoDTO> {
    const url = `${this.detalleUrl}Prestamos/${idPrestamo}`;
    let params = new HttpParams();

    if (idPersona) {
      params = params.append('idPersona', idPersona.toString());
    }
    if (idSolicitud) {
      params = params.append('idSolicitud', idSolicitud);
    }

    return this.http.get<DetallePrestamoDTO>(url, { params }).pipe(
      catchError((error) => {
        console.error('Error al obtener detalle de préstamo:', error);
        throw error;
      })
    );
  }
}
