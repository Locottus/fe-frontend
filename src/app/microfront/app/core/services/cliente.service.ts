import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Cliente, Preferencias } from '../../shared/models/cliente';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly clienteSubject = new BehaviorSubject<Cliente>(null);

  constructor(private readonly http: HttpClient, private readonly settingsService: SettingsService) {}

  getCliente(): Promise<Cliente> {
    return new Promise((resolve, reject) => {
      this.http.get<Cliente>(this.settingsService.settings.baseUrl + this.settingsService.settings.backendUrl + 'clientes').subscribe(
        (response) => {
          this.procesarCambiosEnEntidadCliente(response);
          resolve(response);
        },
        () => reject()
      );
    });
  }

  getClienteSession(): Cliente {
    return JSON.parse(sessionStorage.getItem('cliente'));
  }

  updatePreferencias(preferencias: Preferencias): void {
    this.http
      .patch(this.settingsService.settings.baseUrl + this.settingsService.settings.backendUrl + 'clientes', preferencias)
      .subscribe(() => {
        const cliente: Cliente = JSON.parse(sessionStorage.getItem('cliente'));
        cliente.preferencias = preferencias;
        this.procesarCambiosEnEntidadCliente(cliente);
      });
  }

  procesarCambiosEnEntidadCliente(cliente: Cliente) {
    sessionStorage.setItem('cliente', JSON.stringify(cliente));
    this.emitirActualizacionDatosCliente(cliente);
  }

  getcliente$(): Observable<Cliente> {
    return this.clienteSubject.asObservable().pipe(filter((c) => !!c));
  }

  emitirActualizacionDatosCliente(cliente: Cliente) {
    this.clienteSubject.next(cliente);
  }
}
