import { Injectable, OnDestroy } from '@angular/core';
import { ClienteService } from './cliente.service';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Cliente } from '../../shared/models/cliente';
import { Notificacion } from '../../shared/models/notificacion';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class NotificacionService implements OnDestroy {

  subscription: Subscription;
  notificacionesList: Notificacion[] = [];
  private readonly mostrarAvisoNotificacion = new BehaviorSubject<boolean>(false);

  constructor(private readonly clienteService: ClienteService) {
    this.subscription = this.clienteService.getcliente$().subscribe(
      cliente => {
        this.actualizarNotificaciones(cliente);
      });
  }

  getMostrarAvisoNotificacion$(): Observable<boolean> {
    return this.mostrarAvisoNotificacion.asObservable();
  }

  setMostrarAvisoNotificacion(item: boolean) {
      this.mostrarAvisoNotificacion.next(item);
  }

  actualizarNotificaciones(cliente: Cliente): void {
    if (cliente && cliente.preferencias.clave_por_vencer) {
      const ahora = moment().startOf('day');
      const descripcionVencimientoClave = this.obtenerDescripcionVencimientoClave(cliente, ahora);
      const notificacion: Notificacion = {
        title: 'Tu clave de acceso a Online Banking está próxima a vencer',
        description: descripcionVencimientoClave,
        link: {
          description: 'Cambio de Clave',
          href: '/DefaultObi.aspx?mostrar=misdatos-seguridad'
        }
      };
      this.notificacionesList.push(notificacion);
      this.setMostrarAvisoNotificacion(true);
    }
  }

  obtenerDescripcionVencimientoClave(cliente: Cliente, tiempo: moment.Moment): string {
    tiempo = tiempo.startOf('day');

    const fechaExpiracionClave = moment(cliente.fecha_expiracion_clave).startOf('day');

    const diasFaltantesParaExpiracion: number = fechaExpiracionClave.diff(tiempo, 'days');

    const diasFaltantesMensaje: string = diasFaltantesParaExpiracion > 0
      ? `vencerá en ${diasFaltantesParaExpiracion} ${diasFaltantesParaExpiracion > 1 ? 'días' : 'día'}`
      : 'vence hoy';

    return `Tu clave de acceso ${diasFaltantesMensaje}. Si querés cambiarla ahora, ingresá a Cambio de Clave.`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
