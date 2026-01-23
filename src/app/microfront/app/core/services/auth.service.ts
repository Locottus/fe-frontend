import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

export interface ResponseTokenMobile {
  token_obi: string;
}

export interface RequestTokenMobile {
  token_mobile: string;
}

export type AuthType = 'normal' | 'mobile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authMethod: AuthType;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  fetchToken(): Observable<string> {
    const tokenMobile = this.extractTokenMobile();

    if (tokenMobile) {
      return this.fetchTokenFromMobile(tokenMobile);
    }

    return this.fetchTokenFromLegacy();
  }

  private fetchTokenFromMobile(tokenMobile: string): Observable<string> {
    this.authMethod = 'mobile';
    const request: RequestTokenMobile = {
      token_mobile: tokenMobile
    };

    const base = this.settingsService.settings.baseUrl + this.settingsService.settings.backendUrl;
    const url = `${base}mobile/autorizacion`;
    const resp = this.http.post<ResponseTokenMobile>(url, request).pipe(map((response) => response.token_obi));

    return resp;
  }

  private fetchTokenFromLegacy(): Observable<string> {
    this.authMethod = 'normal';
    return this.http.get(this.settingsService.settings.jwtProviderUrl, { responseType: 'text' });
  }

  extractTokenMobile(): string | null {
    if (!('URLSearchParams' in window)) {
      return null;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const tokenMobile = urlParams ? urlParams.get('token') : null;
    return tokenMobile;
  }

  getTokenDueTime(): number | null {
    // Devuelve el tiempo restante (en ms) antes de que expire el token actual
    const token = sessionStorage.getItem('token'); // O donde guardes el token

    if (!token) {
      return null;
    }
    const tokenExpirationDate = this.jwtHelper.getTokenExpirationDate(token);

    if (!tokenExpirationDate) {
      return null;
    }
    return moment(tokenExpirationDate).subtract(1, 'minutes').diff(moment());
  }

  getAuthMethod(): AuthType {
    return this.authMethod;
  }
}
