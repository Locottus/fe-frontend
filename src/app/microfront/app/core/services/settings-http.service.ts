import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Settings } from '../settings';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ClienteService } from './cliente.service';
import { RoutingService } from './routing.service';

@Injectable({ providedIn: 'root' })
export class SettingsHttpService {
  constructor(
    private readonly http: HttpClient,
    private settingsService: SettingsService,
    private readonly authService: AuthService,
    private readonly clienteService: ClienteService,
    private readonly routingService: RoutingService
  ) {}

  initializeApp(): Promise<void> {
    return new Promise((resolve) => {
      this.http
        .get<Settings>(`${environment.publicPath}assets/environment-specific-settings/settings.json`)
        .toPromise()
        .then(async (response) => {
          this.settingsService.settings = response;

          await this.authService
            .fetchToken()
            .toPromise()
            .then(async (token: string) => {
              localStorage.setItem('token', token);
              if (this.clienteService.getClienteSession() == null) {
                await this.clienteService
                  .getCliente()
                  .then(() => {
                    resolve();
                  })
                  .catch(() => {
                    this.routingService.logout();
                    resolve();
                  });
              } else {
                resolve();
              }
            })
            .catch(() => {
              this.routingService.logout();
              resolve();
            });
        })
        .catch(this.manejarErrorCritico);
    });
  }

  manejarErrorCritico(error) {
    /*Se redirige a HBI*/
    window.location.href = '/';
  }
}
