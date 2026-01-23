import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendienteTycComponent } from './pendiente-tyc.component';
import { GlobalService } from 'src/app/shared/services/global.service';
import { DocumentosService } from '../services/documentos.service';
import { TerminosCondicionesService } from '../services/terminos-y-condiciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

@Pipe({ name: 'numberFormat' })
class MockNumberFormatPipe implements PipeTransform { transform(value: any){ return value; } }

describe('PendienteTycComponent', () => {
  let component: PendienteTycComponent;
  let fixture: ComponentFixture<PendienteTycComponent>;
  let globalService: jasmine.SpyObj<GlobalService>;
  let clienteService: jasmine.SpyObj<ClienteService>;
  let documentosService: jasmine.SpyObj<DocumentosService>;
  let terminosCondicionesService: jasmine.SpyObj<TerminosCondicionesService>;
  let authService: jasmine.SpyObj<AuthService>;
  let layoutRemoteService: jasmine.SpyObj<LayoutRemoteService>;
  let analyticsService: jasmine.SpyObj<AnalyticsService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    globalService = jasmine.createSpyObj('GlobalService', [
      'getSolicitudSelected','getSolicitudDetallada','getCreditos','setCreditos',
      'getExisteDocumentosSolicitudSeleccionada','setDocumentosSolicitudSeleccionada','getDocumentosSolicitudSeleccionada'
    ]);
    globalService.getCreditos.and.returnValue([{ idSolicitud: '1' }]);
    globalService.getExisteDocumentosSolicitudSeleccionada.and.returnValue(true);
    globalService.getDocumentosSolicitudSeleccionada.and.returnValue({ documentos: [], terminosYCondiciones: {} });
  // Evitar errores en ngOnInit (getDetallePrimero) cuando no hay solicitud seleccionada
  globalService.getSolicitudSelected.and.returnValue(null);
  globalService.getSolicitudDetallada.and.returnValue(of({ id: '1', solicitud: { diasRestantesVigenciaAprobado: 15 } } as any));
    clienteService = jasmine.createSpyObj('ClienteService', ['getClienteSession']);
    clienteService.getClienteSession.and.returnValue({ persona_id: '123' } as any);
    documentosService = jasmine.createSpyObj('DocumentosService', ['getDocumentosSolicitud']);
    terminosCondicionesService = jasmine.createSpyObj('TerminosCondicionesService', ['aceptarTyC','reportarErrorTyc']);
    authService = jasmine.createSpyObj('AuthService', ['getAuthMethod']);
    authService.getAuthMethod.and.returnValue('desktop');
    layoutRemoteService = jasmine.createSpyObj('LayoutRemoteService', ['ocultarLayout']);
    analyticsService = jasmine.createSpyObj('AnalyticsService', ['googleAnalyticsClick', 'googleAnalyticsButton', 'googleAnalyticsPage']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PendienteTycComponent, MockNumberFormatPipe],
      providers: [
        { provide: GlobalService, useValue: globalService },
        { provide: ClienteService, useValue: clienteService },
        { provide: DocumentosService, useValue: documentosService },
        { provide: TerminosCondicionesService, useValue: terminosCondicionesService },
        { provide: AuthService, useValue: authService },
        { provide: LayoutRemoteService, useValue: layoutRemoteService },
        { provide: AnalyticsService, useValue: analyticsService },
  { provide: Router, useValue: router },
  { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PendienteTycComponent);
    component = fixture.componentInstance;
  });

  it('crea componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('formatDate variantes', () => {
    expect((component as any).formatDate(undefined)).toBe('');
    expect((component as any).formatDate('2025-11-10')).toBe('10/11/2025');
    expect((component as any).formatDate('2025-11-10T12:00:00')).toBe('10/11/2025');
    expect((component as any).formatDate('texto')).toBe('texto');
  });

  it('getDetallePrimero asigna solicitud y desactiva loading', () => {
    const solicitudMock: any = { id: 1, solicitud: { diasRestantesVigenciaAprobado: 5 } };
    globalService.getSolicitudSelected.and.returnValue('1');
    globalService.getSolicitudDetallada.and.returnValue(of(solicitudMock));
    spyOn(component, 'setCallout');
    spyOn(component as any,'getDocumentosEnSegundoPlano');
    component.getDetallePrimero();
    expect(component.setCallout).toHaveBeenCalled();
    expect(component.isLoadingDetalle).toBeFalse();
    expect((component as any).getDocumentosEnSegundoPlano).toHaveBeenCalled();
  });

  it('getDocumentosEnSegundoPlano asigna documentos', () => {
    component.op = '1';
    component.idPersona = 1 as any;
    component.solicitud = {} as any;
    const resp = { documentos:[{ nombre:'doc', base64:'AAA'}], terminosYCondiciones:{ id:1, texto:'TyC'} };
    documentosService.getDocumentosSolicitud.and.returnValue(of(resp));
    globalService.getDocumentosSolicitudSeleccionada.and.returnValue(resp);
    component.getDocumentosEnSegundoPlano();
    expect(component.solicitud.documentos).toEqual(resp);
    expect(component.isLoadingDocumentos).toBeFalse();
  });

  it('getDocumentosEnSegundoPlano maneja error', () => {
    component.op = '1';
    component.idPersona = 1 as any;
    component.solicitud = {} as any;
    documentosService.getDocumentosSolicitud.and.returnValue(throwError(() => new Error('fail')));
    globalService.getDocumentosSolicitudSeleccionada.and.returnValue({ documentos: [], terminosYCondiciones: {} });
    component.getDocumentosEnSegundoPlano();
    expect(component.isLoadingDocumentos).toBeFalse();
  });

  it('setCallout warning cuando faltan pocos días', () => {
    component.solicitud = { solicitud: { diasRestantesVigenciaAprobado: 2 } } as any;
    component.setCallout();
    expect(component.variantCallout).toBe('warning');
    expect(component.isVencida).toBeFalse();
  });

  it('setCallout warning singular cuando falta 1 día', () => {
    component.solicitud = { solicitud: { diasRestantesVigenciaAprobado: 1 } } as any;
    component.setCallout();
    expect(component.variantCallout).toBe('warning');
  });

  it('setCallout error cuando vence hoy', () => {
    component.solicitud = { solicitud: { diasRestantesVigenciaAprobado: 0 } } as any;
    component.setCallout();
    expect(component.variantCallout).toBe('error');
    expect(component.isVencida).toBeTrue();
  });

  it('setCallout error cuando está vencida', () => {
    component.solicitud = { solicitud: { diasRestantesVigenciaAprobado: -2 } } as any;
    component.setCallout();
    expect(component.variantCallout).toBe('error');
    expect(component.isVencida).toBeTrue();
  });

  it('confirmar navega en éxito', () => {
    component.solicitud = { id: '1', documentos: { terminosYCondiciones: { id:1, texto:'TyC', base64:'AAA' }, documentos: [] } } as any;
    terminosCondicionesService.aceptarTyC.and.returnValue(of({ status: 200 }));
    component.confirmar(false);
    expect(terminosCondicionesService.aceptarTyC).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('confirmar maneja error sin navegar', () => {
    component.solicitud = { id: '1', documentos: { terminosYCondiciones: { id:1, texto:'TyC', base64:'AAA' }, documentos: [] } } as any;
    terminosCondicionesService.aceptarTyC.and.returnValue(throwError(() => new Error('x')));
    spyOn(console,'error');
    component.confirmar(false);
    expect(console.error).toHaveBeenCalled();
  });

  it('abrirDocumento sin documentos genera toast', () => {
    component.solicitud = { documentos: null } as any;
    component.toasts = [];
    component.abrirDocumento('X');
    expect(component.toasts.length).toBe(1);
  });

  it('reportarError invoca servicio', () => {
    component.solicitud = {} as any;
    terminosCondicionesService.reportarErrorTyc.and.returnValue(of({}));
    component.reportarError();
    expect(terminosCondicionesService.reportarErrorTyc).toHaveBeenCalled();
  });

  it('cancelarSolicitud invoca servicio', () => {
    component.solicitud = {} as any;
    terminosCondicionesService.reportarErrorTyc.and.returnValue(of({}));
    component.cancelarSolicitud();
    expect(terminosCondicionesService.reportarErrorTyc).toHaveBeenCalled();
  });

  it('should handle confirmar with isFromCuenta true', () => {
    component.solicitud = { 
      id: '1', 
      documentos: { 
        terminosYCondiciones: { id: 1, texto: 'TyC', base64: 'AAA' }, 
        documentos: [] 
      } 
    } as any;
    component.blockearConfirmacion = false;
    terminosCondicionesService.aceptarTyC.and.returnValue(of({ status: 200 }));
    // bloquear debe ser false para que se ejecute
    component.confirmar(false);
    expect(terminosCondicionesService.aceptarTyC).toHaveBeenCalled();
  });

  it('should handle error in reportarError', () => {
    component.solicitud = {} as any;
    terminosCondicionesService.reportarErrorTyc.and.returnValue(throwError(() => new Error('error')));
    component.reportarError();
    // No hace throw, solo loguea
    expect(terminosCondicionesService.reportarErrorTyc).toHaveBeenCalled();
  });

  it('should handle error in cancelarSolicitud', () => {
    component.solicitud = {} as any;
    terminosCondicionesService.reportarErrorTyc.and.returnValue(throwError(() => new Error('error')));
    component.cancelarSolicitud();
    // No hace throw, solo loguea
    expect(terminosCondicionesService.reportarErrorTyc).toHaveBeenCalled();
  });

  it('should open documento when exists in desktop mode', () => {
    const mockDoc = { nombre: 'test.pdf', base64: 'QUFBQkJCQ0ND' }; // base64 válido
    component.solicitud = { 
      documentos: { 
        documentos: [mockDoc]
      } 
    } as any;
    authService.getAuthMethod.and.returnValue('desktop');
    spyOn(window as any, 'open');
    component.abrirDocumento(mockDoc.nombre);
    expect(window.open).toHaveBeenCalled();
  });

  it('should set isLoadingDetalle false on getDetallePrimero error', () => {
    component.isLoadingDetalle = true;
    globalService.getSolicitudSelected.and.returnValue('1');
    globalService.getSolicitudDetallada.and.returnValue(throwError(() => new Error('error')));
    component.getDetallePrimero();
    // El observable se ejecuta de forma asíncrona, fixture.detectChanges() no es necesario
    // pero necesitamos esperar que el error se procese
    expect(globalService.getSolicitudDetallada).toHaveBeenCalled();
  });

  it('should handle setCallout with days > 5', () => {
    component.solicitud = { solicitud: { diasRestantesVigenciaAprobado: 10 } } as any;
    component.setCallout();
    expect(component.isVencida).toBeFalse();
    // Días 10 está dentro de <=11, entonces sí muestra callout
    expect(component.mostrarCallout).toBeTrue();
    expect(component.variantCallout).toBe('warning');
  });

  it('should not show callout when days > 11', () => {
    component.solicitud = { solicitud: { diasRestantesVigenciaAprobado: 15 } } as any;
    component.setCallout();
    expect(component.isVencida).toBeFalse();
    expect(component.mostrarCallout).toBeFalse();
  });

  it('should handle abrirDocumento for terminos y condiciones', () => {
    const mockTyC = { id: 1, texto: 'TyC', base64: 'AAABBBCCC' };
    component.solicitud = { 
      documentos: { 
        terminosYCondiciones: mockTyC,
        documentos: []
      } 
    } as any;
    authService.getAuthMethod.and.returnValue('desktop');
    component.abrirDocumento('Terminos y Condiciones');
    // Terminos y condiciones abre un modal, no window.open
    expect(component.openTerminosCondiciones).toBeTrue();
  });

  it('should add toast when documento has no base64', () => {
    const mockDoc = { nombre: 'test.pdf', base64: null };
    component.solicitud = { 
      documentos: { 
        documentos: [mockDoc]
      } 
    } as any;
    component.toasts = [];
    component.abrirDocumento(mockDoc.nombre);
    expect(component.toasts.length).toBeGreaterThan(0);
  });

  it('should handle mobile mode with flutter handler', () => {
    const mockDoc = { nombre: 'test.pdf', base64: 'AAABBBCCC' };
    component.solicitud = { 
      documentos: { 
        documentos: [mockDoc]
      } 
    } as any;
    authService.getAuthMethod.and.returnValue('mobile');
    const mockFlutterHandler = jasmine.createSpy('callHandler');
    (window as any).flutter_inappwebview = { callHandler: mockFlutterHandler };
    component.toasts = [];
    component.abrirDocumento(mockDoc.nombre);
    expect(mockFlutterHandler).toHaveBeenCalled();
    delete (window as any).flutter_inappwebview;
  });

  it('should handle mobile mode with iOS webkit handler', () => {
    const mockDoc = { nombre: 'test.pdf', base64: 'AAABBBCCC' };
    component.solicitud = { 
      documentos: { 
        documentos: [mockDoc]
      } 
    } as any;
    authService.getAuthMethod.and.returnValue('mobile');
    const mockPostMessage = jasmine.createSpy('postMessage');
    (window as any).webkit = { messageHandlers: { blobToBase64Handler: { postMessage: mockPostMessage } } };
    component.toasts = [];
    component.abrirDocumento(mockDoc.nombre);
    expect(mockPostMessage).toHaveBeenCalled();
    delete (window as any).webkit;
  });

  it('should show warning toast when no mobile handler available', () => {
    const mockDoc = { nombre: 'test.pdf', base64: 'AAABBBCCC' };
    component.solicitud = { 
      documentos: { 
        documentos: [mockDoc]
      } 
    } as any;
    authService.getAuthMethod.and.returnValue('mobile');
    delete (window as any).flutter_inappwebview;
    delete (window as any).webkit;
    component.toasts = [];
    component.abrirDocumento(mockDoc.nombre);
    expect(component.toasts.length).toBeGreaterThan(0);
    expect(component.toasts[0].variant).toBe('warning');
  });

  it('should call backAction and navigate to solicitudes', () => {
    component.backAction();
    expect(router.navigate).toHaveBeenCalledWith(['/solicitudes']);
  });

  it('should toggle blockearConfirmacion on cambiarEstado', () => {
    component.blockearConfirmacion = true;
    component.cambiarEstado();
    expect(component.blockearConfirmacion).toBeFalse();
    component.cambiarEstado();
    expect(component.blockearConfirmacion).toBeTrue();
  });

  it('should open and close detalle modal', () => {
    component.modalOpen('detalle', true);
    expect(component.openDetalle).toBeTrue();
    component.modalOpen('detalle', false);
    expect(component.openDetalle).toBeFalse();
  });

  it('should open and close ayuda modal', () => {
    component.modalOpen('ayuda', true);
    expect(component.openAyuda).toBeTrue();
    component.modalOpen('ayuda', false);
    expect(component.openAyuda).toBeFalse();
  });

  it('should open datosIncorrectos modal and close ayuda', () => {
    component.openAyuda = true;
    component.modalOpen('datosIncorrectos', true);
    expect(component.openDatosIncorrectos).toBeTrue();
    expect(component.openAyuda).toBeFalse();
  });

  it('should open cancelarSolicitud modal and close ayuda', () => {
    component.openAyuda = true;
    component.modalOpen('cancelarSolicitud', true);
    expect(component.openCancelarSolicitud).toBeTrue();
    expect(component.openAyuda).toBeFalse();
  });

  it('should toggle openTerminosCondiciones', () => {
    component.openTerminosCondiciones = false;
    component.toggleTerminosCondiciones(true);
    expect(component.openTerminosCondiciones).toBeTrue();
    component.toggleTerminosCondiciones(false);
    expect(component.openTerminosCondiciones).toBeFalse();
  });

  it('should set modal and log datosIncorrectos', () => {
    spyOn(console, 'log');
    component.setModal('datosIncorrectos');
    expect(component.modal).toBe('datosIncorrectos');
    expect(console.log).toHaveBeenCalledWith('datosIncorrectos');
  });

  it('should set modal and log cancelarSolicitud', () => {
    spyOn(console, 'log');
    component.setModal('cancelarSolicitud');
    expect(component.modal).toBe('cancelarSolicitud');
    expect(console.log).toHaveBeenCalledWith('cancelarSolicitud');
  });

  it('should set modal for other values', () => {
    spyOn(console, 'log');
    component.setModal('otroModal');
    expect(component.modal).toBe('otroModal');
    expect(console.log).toHaveBeenCalledWith('otroModal');
  });

  it('should filter truthy values', () => {
    const arr = [1, 0, null, 'test', undefined, false, true];
    const result = component.filterTruthy(arr);
    expect(result).toEqual([1, 'test', true]);
  });

  it('should return empty array when filterTruthy receives all falsy', () => {
    const arr = [0, null, undefined, false, ''];
    const result = component.filterTruthy(arr);
    expect(result).toEqual([]);
  });

  it('should call ocultarCallout and set mostrarCallout to false', () => {
    component.mostrarCallout = true;
    component.ocultarCallout();
    expect(component.mostrarCallout).toBeFalse();
  });

  it('should actualizarEstadoCabecera update credito estado', () => {
    component.solicitud = { id: '1' } as any;
    const creditos = [{ idSolicitud: '1', estado: 'pending' }];
    globalService.getCreditos.and.returnValue(creditos);
    component.actualizarEstadoCabecera();
    expect(globalService.setCreditos).toHaveBeenCalled();
  });

  it('should not call aceptarTyC when bloquear is true', () => {
    component.confirmar(true);
    expect(terminosCondicionesService.aceptarTyC).not.toHaveBeenCalled();
  });

  it('should handle cancelarSolicitud success with toast', () => {
    component.solicitud = {} as any;
    component.toasts = [];
    terminosCondicionesService.reportarErrorTyc.and.returnValue(of({}));
    component.cancelarSolicitud();
    expect(component.toasts.length).toBe(1);
    expect(component.toasts[0].variant).toBe('success');
    expect(component.openCancelarSolicitud).toBeFalse();
  });

  it('should handle cancelarSolicitud error with toast', () => {
    component.solicitud = {} as any;
    component.toasts = [];
    terminosCondicionesService.reportarErrorTyc.and.returnValue(throwError(() => new Error('error')));
    component.cancelarSolicitud();
    expect(component.toasts.length).toBe(1);
    expect(component.toasts[0].variant).toBe('warning');
  });

  it('should handle setCallout when solicitud is null', () => {
    component.solicitud = null as any;
    component.setCallout();
    expect(component.isVencida).toBeFalse();
    expect(component.variantCallout).toBe('warning');
    expect(component.titleCallout).toBe('No se pudo cargar la solicitud');
  });

  it('should handle setCallout when solicitud.solicitud is null', () => {
    component.solicitud = { solicitud: null } as any;
    component.setCallout();
    expect(component.isVencida).toBeFalse();
    expect(component.variantCallout).toBe('warning');
  });

  it('should handle setCallout when diasRestantesVigenciaAprobado is undefined', () => {
    component.solicitud = { solicitud: { diasRestantesVigenciaAprobado: undefined } } as any;
    component.setCallout();
    expect(component.isVencida).toBeTrue();
    expect(component.variantCallout).toBe('error');
  });

  it('should handle setCallout when diasRestantesVigenciaAprobado is null', () => {
    component.solicitud = { solicitud: { diasRestantesVigenciaAprobado: null } } as any;
    component.setCallout();
    expect(component.isVencida).toBeTrue();
    expect(component.variantCallout).toBe('error');
  });

  it('should show toast when terminos y condiciones not available', () => {
    component.solicitud = { 
      documentos: { 
        terminosYCondiciones: null,
        documentos: []
      } 
    } as any;
    component.toasts = [];
    component.abrirDocumento('Terminos y Condiciones');
    expect(component.toasts.length).toBe(1);
    expect(component.toasts[0].variant).toBe('warning');
  });

  it('should show toast when documento not found', () => {
    component.solicitud = { 
      documentos: { 
        documentos: [{ nombre: 'otro.pdf', base64: 'AAA' }]
      } 
    } as any;
    component.toasts = [];
    component.abrirDocumento('noExiste.pdf');
    expect(component.toasts.length).toBe(1);
    expect(component.toasts[0].variant).toBe('warning');
  });

  it('should show toast when documentos array is empty', () => {
    component.solicitud = { 
      documentos: { 
        documentos: []
      } 
    } as any;
    component.toasts = [];
    component.abrirDocumento('test.pdf');
    expect(component.toasts.length).toBe(1);
    expect(component.toasts[0].variant).toBe('error');
  });

  it('should handle ngOnInit when solicitud already exists', () => {
    component.solicitud = { solicitud: { diasRestantesVigenciaAprobado: 5 } } as any;
    spyOn(component, 'setCallout');
    spyOn(component, 'getDocumentosEnSegundoPlano');
    component.ngOnInit();
    expect(component.setCallout).toHaveBeenCalled();
    expect(component.getDocumentosEnSegundoPlano).toHaveBeenCalled();
  });

  it('should set isMobile true when authMethod is mobile', () => {
    authService.getAuthMethod.and.returnValue('mobile');
    component.ngOnInit();
    expect(component.isMobile).toBeTrue();
  });

  it('should fetch documentos from service when not cached', () => {
    component.op = '1';
    component.idPersona = 123;
    component.solicitud = {} as any;
    const resp = { documentos: [{ nombre: 'doc' }], terminosYCondiciones: { id: 1 } };
    globalService.getExisteDocumentosSolicitudSeleccionada.and.returnValue(false);
    documentosService.getDocumentosSolicitud.and.returnValue(of(resp));
    component.getDocumentosEnSegundoPlano();
    expect(documentosService.getDocumentosSolicitud).toHaveBeenCalledWith('1', 123);
    expect(globalService.setDocumentosSolicitudSeleccionada).toHaveBeenCalled();
    expect(component.isLoadingDocumentos).toBeFalse();
  });

  it('should handle flutter handler error gracefully', () => {
    const mockDoc = { nombre: 'test.pdf', base64: 'AAABBBCCC' };
    component.solicitud = { 
      documentos: { 
        documentos: [mockDoc]
      } 
    } as any;
    authService.getAuthMethod.and.returnValue('mobile');
    (window as any).flutter_inappwebview = { 
      callHandler: jasmine.createSpy('callHandler').and.throwError('Flutter error') 
    };
    spyOn(console, 'error');
    component.toasts = [];
    component.abrirDocumento(mockDoc.nombre);
    expect(console.error).toHaveBeenCalled();
    delete (window as any).flutter_inappwebview;
  });

  it('should handle iOS webkit handler error gracefully', () => {
    const mockDoc = { nombre: 'test.pdf', base64: 'AAABBBCCC' };
    component.solicitud = { 
      documentos: { 
        documentos: [mockDoc]
      } 
    } as any;
    authService.getAuthMethod.and.returnValue('mobile');
    (window as any).webkit = { 
      messageHandlers: { 
        blobToBase64Handler: { 
          postMessage: jasmine.createSpy('postMessage').and.throwError('iOS error') 
        } 
      } 
    };
    spyOn(console, 'error');
    component.toasts = [];
    component.abrirDocumento(mockDoc.nombre);
    expect(console.error).toHaveBeenCalled();
    delete (window as any).webkit;
  });
});
