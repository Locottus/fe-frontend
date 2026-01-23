import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DetalleSolicitudDTO, Documento } from '../interfaces/detalle-solicitud.dto';
import { catchError } from 'rxjs/operators';
import { SettingsService } from 'src/app/core/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class TerminosCondicionesService {
  apiUrl: string;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.apiUrl = `${this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl}`;
  }

  aceptarTyC(idPersona: number, idSolicitud: string, documentos: Documento[], idTerminosCondiciones: string): Observable<any> {
    const url = `${this.apiUrl}TerminosCondiciones`;

    const documentosPayload = documentos.map((doc) => ({
      id: doc.id,
      nombreArchivo: doc.nombre
    }));

    const body = {
      idPersona,
      idSolicitud,
      documentosAceptados: {
        idTerminosCondiciones,
        documentos: documentosPayload
      }
    };

    return this.http.post(url, body).pipe(
      catchError((error) => {
        console.error('Error al aceptar términos y condiciones:', error);
        throw error;
      })
    );
  }

  reportarErrorTyc(dto: DetalleSolicitudDTO) {
    return this.http.post<void>(`${this.apiUrl}/error`, dto);
  }
}
