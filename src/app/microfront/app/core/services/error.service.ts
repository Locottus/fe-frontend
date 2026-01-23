import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private readonly http: HttpClient, private readonly settingsService: SettingsService) {
   }

  lookupTableStatusCodes = {
    401() {
      return 'No autorizado';
    },
    500() {
      return 'Error del servidor';
    },
    0() {
      return 'Backend no disponible';
    }
  };

  getErrorMensajeCliente(error: Error): string {
    return error.message ? error.message : error.toString();
  }

  getErrorMensajeServidor(error: Error): string {
    return error.message;
  }

  getErrorMensajeServidorByStatus(error: HttpErrorResponse): string {
    return this.lookupTableStatusCodes[error.status]();
  }

  loguearAlServidor(message: string, objectError: any) {
    if (!objectError.url.endsWith('api/log')) {
    }
  }
}
