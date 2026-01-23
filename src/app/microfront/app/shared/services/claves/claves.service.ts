import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SettingsService } from 'src/app/core/services/settings.service';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ClavesService {
  tokenUrl: string;
  validacionUrl: string;
  tieneAsociadoTokenUrl: string;
  softTokenValidarUrl: string;
  softTokenExisteUrl: string;

  constructor(private http: HttpClient, private settingsService: SettingsService, private loadingService: LoadingService) {
    this.tokenUrl = this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl + 'token';
    this.validacionUrl = this.tokenUrl + '/validacion';
    this.tieneAsociadoTokenUrl = this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl + 'persona/doble-factor';
    this.softTokenValidarUrl = this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl + 'soft-token/validate';
    this.softTokenExisteUrl = this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl + 'soft-token/exist';
  }

  generar(): Observable<any> {
    return this.http.post(this.tokenUrl, {})
      .pipe(
        tap(() => this.loadingService.quitarRequest()),
        catchError((error) => this.handleError(error))
      );
  }

  validar(body): Observable<any> {
    return this.http.post(this.validacionUrl, body)
      .pipe(
        tap(() => this.loadingService.quitarRequest()),
        catchError((error) => this.handleError(error))
      );
  }

  tieneAsociadoToken(): Observable<any> {
    return this.http.get(this.tieneAsociadoTokenUrl)
      .pipe(
        tap(() => this.loadingService.quitarRequest()),
        catchError((error) => this.handleError(error))
      );
  }
  private handleError(error: HttpErrorResponse) {
    this.loadingService.quitarRequest();
    return throwError(error.status);
  }

  validarSoftToken(body): Observable<any> {
    return this.http.post(this.softTokenValidarUrl, body)
      .pipe(
        tap(() => this.loadingService.quitarRequest()),
        catchError((error) => this.handleError(error))
      );
  }

  existeSoftToken(): Observable<any> {
    return this.http.get(this.softTokenExisteUrl)
      .pipe(
        tap(() => this.loadingService.quitarRequest()),
        catchError((error) => this.handleError(error))
      );
  }
}
