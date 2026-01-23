import { EstadosCreditos } from '../../models/estados-creditos';
import { SideBarPrestamosComponent } from './side-bar-prestamos.component';
import { of, BehaviorSubject } from 'rxjs';

describe('SideBarPrestamosComponent', () => {
  let component: SideBarPrestamosComponent;
  let routerMock: any;
  let globalServiceMock: any;
  let prestamosServiceMock: any;
  let clienteServiceMock: any;
  let detallePrestamoServiceMock: any;
  let detalleSolicitudServiceMock: any;
  let creditosDetalleServiceMock: any;

  beforeEach(() => {
    routerMock = { navigate: jasmine.createSpy('navigate'), url: '/prestamo-en-curso' };

    globalServiceMock = {
      getCabeceraSolicitudes: jasmine.createSpy('getCabeceraSolicitudes'),
      getCabeceraPrestamos: jasmine.createSpy('getCabeceraPrestamos'),
      getExisteDetalleSolicitudes: jasmine.createSpy('getExisteDetalleSolicitudes').and.returnValue(false),
      getExisteDetallePrestamos: jasmine.createSpy('getExisteDetallePrestamos').and.returnValue(false),
      getSolicitudesDetalladas: jasmine.createSpy('getSolicitudesDetalladas'),
      getPrestamosDetallados: jasmine.createSpy('getPrestamosDetallados'),
      setPrestamosDetalladosMap: jasmine.createSpy('setPrestamosDetalladosMap'),
      setSolicitudesDetalladasMap: jasmine.createSpy('setSolicitudesDetalladasMap'),
      setPrestamoSelected: jasmine.createSpy('setPrestamoSelected'),
      setSolicitudSelected: jasmine.createSpy('setSolicitudSelected'),
      getPrestamoSelected: jasmine.createSpy('getPrestamoSelected'),
      getSolicitudSelected: jasmine.createSpy('getSolicitudSelected'),
      creditos$: new BehaviorSubject([
        { nroOrden: 1, estado: 'Vigente', cantCuotas: 12, idSolicitud: 'A', tipoOperacion: 'prestamo' },
        { nroOrden: 2, estado: 'Finalizado', cantCuotas: 6, idSolicitud: 'B', tipoOperacion: 'prestamo' },
        { nroOrden: 3, estado: 'Pendiente', cantCuotas: 10, idSolicitud: 'C', tipoOperacion: 'solicitud' }
      ]).asObservable()
    };

    prestamosServiceMock = {};
    clienteServiceMock = {
      getClienteSession: jasmine.createSpy('getClienteSession').and.returnValue({ persona_id: '123' })
    };

    detallePrestamoServiceMock = {
      getDetallePrestamo: jasmine.createSpy('getDetallePrestamo').and.returnValue(of({}))
    };

    detalleSolicitudServiceMock = {
      getDetalleSolicitud: jasmine.createSpy('getDetalleSolicitud').and.returnValue(of({ solicitud: {} }))
    };

    creditosDetalleServiceMock = {
      obtenerDetalles: jasmine.createSpy('obtenerDetalles').and.callFake((prestamos: any[], solicitudes: any[], userID: number) => {
        return of({ prestamosDetallados: [], solicitudesDetalladas: [] });
      })
    };

    component = new SideBarPrestamosComponent(
      routerMock,
      globalServiceMock,
      prestamosServiceMock,
      clienteServiceMock,
      detallePrestamoServiceMock,
      detalleSolicitudServiceMock,
      creditosDetalleServiceMock
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formatDetalleSolicitud returns original if null or missing solicitud', () => {
    expect((component as any).formatDetalleSolicitud(null)).toBeNull();
    expect((component as any).formatDetalleSolicitud({})).toEqual({});
  });

  it('formatDate returns empty string and warns for non-string', () => {
    const warnSpy = spyOn(console, 'warn').and.callFake(() => {});
    expect(component.formatDate(123 as any)).toBe('');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('formatDate returns datePart and warns for wrong format', () => {
    const warnSpy = spyOn(console, 'warn').and.callFake(() => {});
    expect(component.formatDate('2024/01/01')).toBe('2024/01/01');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('kiteCardStyle returns correct border for selected and not selected', () => {
    component.selected = { tipo: 'prestamo', id: '1' };
    expect(component.kiteCardStyle('1')).toEqual({ border: '1px solid $red900' });
    expect(component.kiteCardStyle('2')).toEqual({ border: '1px solid $gray200' });
  });

  it('getKiteListStyle returns correct style for selected and not selected', () => {
    component.selected = { tipo: 'prestamo', id: '1' };
    let style = component.getKiteListStyle('1', 'prestamo');
    expect(style.border).toBe('1px solid $red900');
    style = component.getKiteListStyle('2', 'prestamo');
    expect(style.border).toBe('1px solid $gray500');
    // Debe devolver no seleccionado si el tipo no coincide
    style = component.getKiteListStyle('1', 'solicitud');
    expect(style.border).toBe('1px solid $gray500');
  });

  it('getRutaPorEstado returns correct route', () => {
    expect((component as any).getRutaPorEstado(EstadosCreditos.Pendiente)).toBe('rodados/pendientes-tyc');
    expect((component as any).getRutaPorEstado(EstadosCreditos.Finalizado)).toBe('rodados/prestamo-en-curso');
    expect((component as any).getRutaPorEstado(EstadosCreditos.EnProceso)).toBe('rodados/procesando-solicitud');
    expect((component as any).getRutaPorEstado(EstadosCreditos.Vigente)).toBe('rodados/prestamo-en-curso');
    expect((component as any).getRutaPorEstado('Otro')).toBe('/');
  });

  it('getVariant returns correct variant', () => {
    expect(component.getVariant(EstadosCreditos.Vencida)).toBe('error');
    expect(component.getVariant(EstadosCreditos.Pendiente)).toBe('warning');
    expect(component.getVariant(EstadosCreditos.EnProceso)).toBe('warning');
    expect(component.getVariant(EstadosCreditos.Vigente)).toBe('success');
    expect(component.getVariant(EstadosCreditos.Finalizado)).toBe('default');
    expect(component.getVariant(undefined as any)).toBe('default');
    expect(component.getVariant(null as any)).toBe('default');
    expect(component.getVariant('')).toBe('default');
  });

  it('navegar with undefined navigates to preguntas frecuentes', () => {
    component.navegar(undefined as any);
    expect(routerMock.navigate).toHaveBeenCalledWith(['rodados/preguntas-frecuentes'], { replaceUrl: true });
  });

  it('navegar with prestamo tipoOperacion solicitud', () => {
    const prestamo = { tipoOperacion: 'solicitud', idSolicitud: 123, estado: EstadosCreditos.Pendiente };
    component.navegar(prestamo as any);
    expect(globalServiceMock.setSolicitudSelected).toHaveBeenCalledWith(123);
    expect(component.selected).toEqual({ tipo: 'solicitud', id: '123' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['rodados/pendientes-tyc'], { replaceUrl: true });
  });

  it('navegar with prestamo tipoOperacion prestamo', () => {
    const prestamo = { tipoOperacion: 'prestamo', nroOrden: 456, estado: EstadosCreditos.Vigente };
    component.navegar(prestamo as any);
    expect(globalServiceMock.setPrestamoSelected).toHaveBeenCalledWith(456);
    expect(component.selected).toEqual({ tipo: 'prestamo', id: '456' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['rodados/prestamo-en-curso'], { replaceUrl: true });
  });

  it('getData handles empty arrays', (done) => {
    globalServiceMock.creditos$ = new BehaviorSubject([]).asObservable();
    component.getData();
    setTimeout(() => {
      expect(component.prestamos).toEqual([]);
      expect(component.solicitudes).toEqual([]);
      expect(component.isLoading).toBeFalse();
      done();
    }, 0);
  });

  it('ngOnInit should set selected to solicitud when solicitudSelected exists', () => {
    globalServiceMock.getSolicitudSelected.and.returnValue(123);
    globalServiceMock.getPrestamoSelected.and.returnValue(null);
    component.ngOnInit();
    expect(component.selected).toEqual({ tipo: 'solicitud', id: '123' });
  });

  it('ngOnInit should set selected to prestamo when prestamoSelected exists', () => {
    globalServiceMock.getSolicitudSelected.and.returnValue(null);
    globalServiceMock.getPrestamoSelected.and.returnValue(456);
    component.ngOnInit();
    expect(component.selected).toEqual({ tipo: 'prestamo', id: '456' });
  });

  it('ngOnInit should set selected to null when neither is selected', () => {
    globalServiceMock.getSolicitudSelected.and.returnValue(null);
    globalServiceMock.getPrestamoSelected.and.returnValue(null);
    component.ngOnInit();
    expect(component.selected).toBeNull();
  });

  it('getData should use cached data when existe detalle is true', () => {
    globalServiceMock.getExisteDetalleSolicitudes.and.returnValue(true);
    globalServiceMock.getExisteDetallePrestamos.and.returnValue(true);
    globalServiceMock.getCabeceraSolicitudes.and.returnValue([{ id: 1 }]);
    globalServiceMock.getCabeceraPrestamos.and.returnValue([{ id: 2 }]);
    globalServiceMock.getSolicitudesDetalladas.and.returnValue([{ id: 1, detalle: 'test' }]);
    globalServiceMock.getPrestamosDetallados.and.returnValue([{ id: 2, detalle: 'test' }]);

    component.getData();

    expect(component.solicitudes).toEqual([{ id: 1 }]);
    expect(component.prestamos).toEqual([{ id: 2 }]);
    expect(component.isLoading).toBe(false);
  });

  it('getData should handle undefined solicitudes and prestamos from cache', () => {
    globalServiceMock.getExisteDetalleSolicitudes.and.returnValue(true);
    globalServiceMock.getExisteDetallePrestamos.and.returnValue(true);
    globalServiceMock.getCabeceraSolicitudes.and.returnValue(undefined);
    globalServiceMock.getCabeceraPrestamos.and.returnValue(undefined);

    component.getData();

    expect(component.solicitudes).toEqual([]);
    expect(component.prestamos).toEqual([]);
  });

  it('navegar should call getData when URL is the same', () => {
    spyOn(component, 'getData');
    routerMock.url = 'rodados/pendientes-tyc';
    const prestamo = { tipoOperacion: 'solicitud', idSolicitud: 123, estado: EstadosCreditos.Pendiente };
    component.navegar(prestamo as any);
    expect(component.getData).toHaveBeenCalled();
  });

  it('navegar should clear prestamoSelected when solicitud is selected', () => {
    const prestamo = { tipoOperacion: 'solicitud', idSolicitud: 123, estado: EstadosCreditos.Pendiente };
    component.navegar(prestamo as any);
    expect(globalServiceMock.setPrestamoSelected).toHaveBeenCalledWith(null);
  });

  it('navegar should clear solicitudSelected when prestamo is selected', () => {
    const prestamo = { tipoOperacion: 'prestamo', nroOrden: 456, estado: EstadosCreditos.Vigente };
    component.navegar(prestamo as any);
    expect(globalServiceMock.setSolicitudSelected).toHaveBeenCalledWith(null);
  });

  it('formatDate should return formatted date for valid ISO string', () => {
    const result = component.formatDate('2024-01-15T10:30:00');
    expect(result).toBe('15/01/2024');
  });

  it('formatDate should return empty string for null', () => {
    const result = component.formatDate(null);
    expect(result).toBe('');
  });

  it('formatDate should return empty string for undefined', () => {
    const result = component.formatDate(undefined);
    expect(result).toBe('');
  });
});
