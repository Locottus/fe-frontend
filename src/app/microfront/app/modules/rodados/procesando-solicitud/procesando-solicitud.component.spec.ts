import { ProcesandoSolicitudComponent } from './procesando-solicitud.component';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ProcesandoSolicitudComponent', () => {
  let component: ProcesandoSolicitudComponent;
  let globalServiceMock: any;
  let routerMock: any;
  let layoutRemoteServiceMock: any;
  let authServiceMock: any;

  beforeEach(() => {
    globalServiceMock = jasmine.createSpyObj('ContratosService', ['getSolicitudDetallada', 'getSolicitud', 'getCreditos']);
    routerMock = { navigate: jasmine.createSpy('navigate') };
    layoutRemoteServiceMock = jasmine.createSpyObj('LayoutRemoteService', ['ocultarLayout']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAuthMethod']);
    authServiceMock.getAuthMethod.and.returnValue('normal');

    component = new ProcesandoSolicitudComponent(
      routerMock as any,
      globalServiceMock,
      layoutRemoteServiceMock,
      authServiceMock
    );
  });

  it('should set solicitud to null and isLoading to false if no solicitud is returned', (done) => {
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(null));
    component.solicitud = { id: '1' } as any;
    component.isLoading = false;

    component.getDetalle();

    setTimeout(() => {
      expect(component.solicitud).toBeNull();
      expect(component.isLoading).toBe(false);
      done();
    }, 0);
  });

  it('should set solicitud and pasos correctly when solicitud is returned', fakeAsync(() => {
    const solicitudMock = {
      id: 123,
      solicitud: {
        primerVencimiento: '2024-06-01T00:00:00',
        ultimoVencimiento: '2024-07-01T00:00:00',
        fechaAlta: '2024-05-01T00:00:00'
      }
    };
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(solicitudMock));

    component.getDetalle();
    tick(); // Espera a que se resuelva el observable

    expect(component.solicitud).toBeDefined();
    expect(component.solicitud?.id).toBe('123');
    expect(component.solicitud?.solicitud?.primerVencimiento).toBe('2024-06-01T00:00:00');
    expect(component.solicitud?.solicitud?.ultimoVencimiento).toBe('2024-07-01T00:00:00');
    expect(component.solicitud?.solicitud?.fechaAlta).toBe('2024-05-01T00:00:00');
    expect(component.pasos.length).toBe(3);
    expect(component.pasos[0].completado).toBe(true);
    expect(component.isLoading).toBe(false);
  }));

  it('should handle solicitud.solicitud undefined gracefully', (done) => {
    const solicitudMock = {
      id: 456,
      solicitud: undefined
    };
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(solicitudMock));

    component.getDetalle();

    setTimeout(() => {
      expect(component.solicitud).toBeDefined();
      expect(component.solicitud?.id).toBe('456');
      expect(component.solicitud?.solicitud).toBeUndefined();
      expect(component.pasos.length).toBe(3);
      expect(component.pasos[0].fecha).toBeUndefined();
      expect(component.pasos[0].completado).toBe(false);
      expect(component.isLoading).toBe(false);
      done();
    }, 0);
  });

  it('should call ngOnInit and set isMobile and call getDetalle', () => {
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(null));
    spyOn(component, 'getDetalle');
    
    component.ngOnInit();
    
    expect(component.isMobile).toBe(false);
    expect(component.isLoading).toBe(true);
    expect(component.getDetalle).toHaveBeenCalled();
  });

  it('should set isMobile to true when authMethod is mobile', () => {
    authServiceMock.getAuthMethod.and.returnValue('mobile');
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(null));
    
    component.ngOnInit();
    
    expect(component.isMobile).toBe(true);
  });

  it('should navigate to /solicitudes when backAction is called', () => {
    component.backAction();
    
    expect(routerMock.navigate).toHaveBeenCalledWith(['/solicitudes']);
  });

  it('should set openDetalle to true when modalOpen is called with true', () => {
    component.openDetalle = false;
    
    component.modalOpen(true);
    
    expect(component.openDetalle).toBe(true);
  });

  it('should set openDetalle to false when modalOpen is called with false', () => {
    component.openDetalle = true;
    
    component.modalOpen(false);
    
    expect(component.openDetalle).toBe(false);
  });

  it('should handle solicitud with id containing dash', fakeAsync(() => {
    const solicitudMock = {
      id: 'PREFIX-789',
      solicitud: {
        primerVencimiento: '2024-06-01',
        ultimoVencimiento: '2024-07-01',
        fechaAlta: '2024-05-01'
      }
    };
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(solicitudMock));

    component.getDetalle();
    tick();

    expect(component.solicitud?.id).toBe('789');
  }));

  it('should set pasos with default values when solicitud is null', (done) => {
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(null));

    component.getDetalle();

    setTimeout(() => {
      expect(component.pasos.length).toBe(3);
      expect(component.pasos[0].completado).toBe(false);
      expect(component.pasos[1].completado).toBe(false);
      expect(component.pasos[2].completado).toBe(false);
      done();
    }, 0);
  });

  it('should handle solicitud with empty id', fakeAsync(() => {
    const solicitudMock = {
      id: '',
      solicitud: {
        fechaAlta: '2024-05-01'
      }
    };
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(solicitudMock));

    component.getDetalle();
    tick();

    expect(component.solicitud?.id).toBe('');
  }));

  it('should set pasos[0].completado to false when fechaAlta is empty', fakeAsync(() => {
    const solicitudMock = {
      id: '123',
      solicitud: {
        primerVencimiento: '2024-06-01',
        ultimoVencimiento: '2024-07-01',
        fechaAlta: ''
      }
    };
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(solicitudMock));

    component.getDetalle();
    tick();

    expect(component.pasos[0].completado).toBe(false);
  }));
});
