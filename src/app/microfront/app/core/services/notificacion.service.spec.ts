import { TestBed } from '@angular/core/testing';

import { NotificacionService } from './notificacion.service';
import { ClienteService } from './cliente.service';
import { of } from 'rxjs';
import { Cliente, Preferencias } from '../../shared/models/cliente';
import * as moment from 'moment';

describe('NotificacionService', () => {
  let service: NotificacionService;
  let mockClienteService;
  let mockCliente: Cliente;
  let mockPreferencias: Preferencias;

  beforeEach(() => {

    mockClienteService = {
        getcliente$: jasmine.createSpy()
    };

    mockPreferencias = {
      clave_por_vencer: true, vio_menu: true, vio_notificacion_clave: false
    };

    mockCliente = {
      nombre: 'Nombre de usuario',
      apellido: 'Apellido de usuario',
      ultimo_login: new Date(),
      preferencias: mockPreferencias,
      fecha_expiracion_clave: moment('2020-05-10').toDate()
    };

    mockClienteService.getcliente$.and.returnValue(of(mockCliente));

    TestBed.configureTestingModule({
      providers: [
        ClienteService,
        { provide: ClienteService, useValue: mockClienteService }
      ]
    });
    service = TestBed.inject(NotificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deberia generar una notificacion si el cliente tiene la clave por vencer', () => {
    service.notificacionesList = [];
    mockCliente.preferencias.clave_por_vencer = true;
    service.actualizarNotificaciones(mockCliente);
    expect(service.notificacionesList.length === 1).toBeTruthy();
  });

  it('no deberia generar una notificacion si el cliente no tiene la clave por vencer', () => {
    service.notificacionesList = [];
    mockCliente.preferencias.clave_por_vencer = false;
    service.actualizarNotificaciones(mockCliente);
    expect(service.notificacionesList.length === 0).toBeTruthy();
  });

  it('deberia generar un mensaje correcto cuando la clave del cliente vence en el dia de la fecha', () => {
    const hoy = moment('2020-05-10');
    const descripcion = service.obtenerDescripcionVencimientoClave(mockCliente, hoy);
    expect(descripcion).toBe('Tu clave de acceso vence hoy. Si querés cambiarla ahora, ingresá a Cambio de Clave.');
  });

  it('deberia generar un mensaje correcto cuando la clave del cliente tiene vencimiento no en el dia de la fecha', () => {
    const ndias = moment('2020-05-05');
    const descripcion = service.obtenerDescripcionVencimientoClave(mockCliente, ndias);

    expect(descripcion).toBe('Tu clave de acceso vencerá en 5 días. Si querés cambiarla ahora, ingresá a Cambio de Clave.');
  });

  it('deberia generar un mensaje correcto cuando la clave del cliente tiene vencimiento en un dia', () => {
    const ndias = moment.utc('2020-05-09');
    const descripcion = service.obtenerDescripcionVencimientoClave(mockCliente, ndias);
    expect(descripcion).toBe('Tu clave de acceso vencerá en 1 día. Si querés cambiarla ahora, ingresá a Cambio de Clave.');
  });
});
