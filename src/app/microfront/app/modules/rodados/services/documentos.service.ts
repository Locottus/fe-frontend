import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SettingsService } from 'src/app/core/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  apiUrl: string;
  private documentosCache: any;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.apiUrl = `${this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl}`;
  }

  getDocumentosSolicitud(idSolicitud: string, idPersona?: number): Observable<any> {
    if (this.documentosCache) {
      return of(this.documentosCache);
    }

    const url = `${this.apiUrl.replace(/\/$/, '')}/Documentos/solicitud/${idSolicitud}`;
    let params = new HttpParams();
    if (idPersona) {
      params = params.append('idPersona', idPersona.toString());
    }

    return this.http.get(url, { params }).pipe(
      tap((data) => {
        this.documentosCache = data;
      }),
      catchError((error) => {
        console.error('Error al obtener documentos de solicitud:', error);
        throw error;
      })
    );
  }
}
