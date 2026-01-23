import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SolicitudesComponent } from './solicitudes.component';
import { GlobalService } from 'src/app/shared/services/global.service';
import { CreditosService } from '../services/creditos.service';
import { Router } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CreditoData } from '../interfaces/lista-credito.dto';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EstadosCreditos } from 'src/app/shared/models/estados-creditos';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitudesComponent', () => {
  let component: SolicitudesComponent;
  let fixture: ComponentFixture<SolicitudesComponent>;
  let globalServiceMock: jasmine.SpyObj<GlobalService>;
  let creditosServiceMock: jasmine.SpyObj<CreditosService>;
  let clienteServiceMock: jasmine.SpyObj<ClienteService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockPrestamos: CreditoData[] = [
    {
      nroOrden: 1,
      estado: EstadosCreditos.Vigente,
      cantCuotas: 12,
      tipoOperacion: 'prestamo',
      idSolicitud: 'P-A',
      idSolicitudSinOrigen: 'A'
    },
    {
      nroOrden: 2,
      estado: EstadosCreditos.Finalizado,
      cantCuotas: 6,
      tipoOperacion: 'prestamo',
      idSolicitud: 'P-B',
      idSolicitudSinOrigen: 'B'
    }
  ];
  let mockSolicitudes: CreditoData[];
  const cliente = {
    nombre: '',
    apellido: '',
    ultimo_login: new Date('20250604'),
    fecha_expiracion_clave: new Date('20250604'),
    preferencias: null,
    club_beneficio_id: null,
    celular: '',
    email: '',
    core: '',
    persona_id: '123'
  };

  beforeEach(async () => {
    // Siempre inicializa mockSolicitudes limpio y con idSolicitud definido
    mockSolicitudes = [
      {
        nroOrden: 3,
        estado: EstadosCreditos.Pendiente,
        cantCuotas: 10,
        tipoOperacion: 'solicitud',
        idSolicitud: 'P-C',
        idSolicitudSinOrigen: 'C'
      },
      {
        nroOrden: 4,
        estado: EstadosCreditos.EnProceso,
        cantCuotas: 8,
        tipoOperacion: 'solicitud',
        idSolicitud: 'P-D',
        idSolicitudSinOrigen: 'D'
      }
    ];

    globalServiceMock = jasmine.createSpyObj('GlobalService', [
      'setCreditos',
      'getCreditos',
      'getCabeceraSolicitudes',
      'setCabeceraSolicitudes',
      'setCabeceraPrestamos',
      'getCabeceraPrestamos',
      'setSolicitudSelected',
      'setPrestamoSelected',
      'setPrestamosDetalladosMap',
      'setSolicitudesDetalladasMap',
      'getExisteCreditos',
      'getExisteDetalleSolicitudes',
      'getExisteDetallePrestamos',
      'getSolicitudesDetalladas',
      'getPrestamosDetallados',
      'getIdPersona',
      'getFirstSignIn',
      'setFirstSignIn'
    ]);

    globalServiceMock.getIdPersona.and.returnValue('123');

    globalServiceMock.creditos$ = of([]);
    creditosServiceMock = jasmine.createSpyObj('CreditosService', ['getPrestamosYSolicitudes']);
    clienteServiceMock = jasmine.createSpyObj('ClienteService', ['getClienteSession']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAuth', 'getAuthMethod']);
    authServiceMock.getAuthMethod.and.returnValue('normal');
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SolicitudesComponent],
      providers: [
        { provide: GlobalService, useValue: globalServiceMock },
        { provide: CreditosService, useValue: creditosServiceMock },
        { provide: ClienteService, useValue: clienteServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudesComponent);
    component = fixture.componentInstance;
    component.cliente = cliente;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading true and call obtenerCreditos on ngOnInit', () => {
    spyOn(component, 'obtenerCreditos');
    clienteServiceMock.getClienteSession.and.returnValue(cliente);
    component.ngOnInit();
    expect(component.loading).toBeTrue();
    expect(component.obtenerCreditos).toHaveBeenCalled();
  });

  it('should set loading false and tienePrestamos false on obtenerPrestamos error', () => {
    component.auth = {
      access_token: '1231',
      expires_in: 30,
      refresh_expires_in: 20,
      refresh_token: ''
    };
    creditosServiceMock.getPrestamosYSolicitudes.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');
    clienteServiceMock.getClienteSession.and.returnValue(cliente);
    component.obtenerCreditos();
    expect(component.tienePrestamos).toBeFalse();
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should set loading false if no solicitudes and not call navegar', fakeAsync(() => {
    component.auth = {
      access_token: '1231',
      expires_in: 30,
      refresh_expires_in: 20,
      refresh_token: ''
    };

    clienteServiceMock.getClienteSession.and.returnValue(cliente);

    creditosServiceMock.getPrestamosYSolicitudes.and.returnValue(
      of({
        prestamos: mockPrestamos,
        solicitudes: [],
        todos: mockPrestamos
      })
    );
    spyOn(component, 'navegar');
    component.obtenerCreditos();
    tick();
    expect(component.loading).toBeTrue();
    expect(component.navegar).not.toHaveBeenCalled();
  }));

  it('should navigate to "/" when clickPasoAtras is called', () => {
    component.clickPasoAtras({});
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set loading false, setSolicitud, setPrestamoSelected y navegar según estado', () => {
    const prestamo: CreditoData = {
      nroOrden: 10,
      estado: 'Pendiente',
      cantCuotas: 10,
      tipoOperacion: 'solicitud',
      idSolicitud: 'P-X',
      idSolicitudSinOrigen: 'X'
    };

    globalServiceMock.creditos$ = new BehaviorSubject([]).asObservable();
    component.navegar(prestamo);
    expect(globalServiceMock.setSolicitudSelected).toHaveBeenCalledWith('P-X');
    expect(globalServiceMock.setPrestamoSelected).toHaveBeenCalledWith(10);
    expect(routerMock.navigate).toHaveBeenCalledWith(['rodados/pendientes-tyc']);

    prestamo.estado = EstadosCreditos.Finalizado;
    component.navegar(prestamo);
    expect(routerMock.navigate).toHaveBeenCalledWith(['rodados/prestamo-en-curso']);

    prestamo.estado = EstadosCreditos.EnProceso;
    component.navegar(prestamo);
    expect(routerMock.navigate).toHaveBeenCalledWith(['rodados/procesando-solicitud']);

    prestamo.estado = EstadosCreditos.Pendiente;
    component.navegar(prestamo);
    expect(routerMock.navigate).toHaveBeenCalledWith(['rodados/prestamo-en-curso']);

    prestamo.estado = 'Otro';
    component.navegar(prestamo);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should return correct variant for getVariant', () => {
    expect(component.getVariant(EstadosCreditos.Vencida)).toBe('error');
    expect(component.getVariant(EstadosCreditos.Pendiente)).toBe('warning');
    expect(component.getVariant(EstadosCreditos.EnProceso)).toBe('warning');
    expect(component.getVariant(EstadosCreditos.Vigente)).toBe('success');
    expect(component.getVariant(EstadosCreditos.Finalizado)).toBe('default');
    expect(component.getVariant('Desconocido')).toBe('default');
  });

  it('should handle obtenerCreditos when creditos already exist', () => {
    const mockContratos = [{ nroOrden: 1, estado: 'Vigente' }] as CreditoData[];
    globalServiceMock.getExisteCreditos.and.returnValue(true);
    globalServiceMock.getCreditos.and.returnValue(mockContratos);
    globalServiceMock.getCabeceraSolicitudes.and.returnValue([]);
    globalServiceMock.getCabeceraPrestamos.and.returnValue(mockPrestamos);
    globalServiceMock.getExisteDetalleSolicitudes.and.returnValue(true);
    globalServiceMock.getExisteDetallePrestamos.and.returnValue(true);
    globalServiceMock.getSolicitudesDetalladas.and.returnValue([]);
    globalServiceMock.getPrestamosDetallados.and.returnValue([]);
    
    component.obtenerCreditos();
    
    expect(component.contratos).toEqual(mockContratos);
  });

  it('should set userID from globalService if available', () => {
    globalServiceMock.getIdPersona.and.returnValue('12345');
    globalServiceMock.getExisteCreditos.and.returnValue(false);
    clienteServiceMock.getClienteSession.and.returnValue(cliente);
    creditosServiceMock.getPrestamosYSolicitudes.and.returnValue(of({
      prestamos: [],
      solicitudes: [],
      todos: []
    }));
    
    component.ngOnInit();
    expect(component.userID).toBe(12345);
  });

  it('should navigate to first solicitud when firstSignIn is true', fakeAsync(() => {
    clienteServiceMock.getClienteSession.and.returnValue(cliente);
    globalServiceMock.getFirstSignIn.and.returnValue(true);
    globalServiceMock.getExisteCreditos.and.returnValue(false);
    globalServiceMock.getExisteDetalleSolicitudes.and.returnValue(true);
    globalServiceMock.getExisteDetallePrestamos.and.returnValue(true);
    globalServiceMock.getSolicitudesDetalladas.and.returnValue([]);
    globalServiceMock.getPrestamosDetallados.and.returnValue([]);
    
    const mockSolicitud = { 
      nroOrden: 1, 
      estado: EstadosCreditos.Pendiente, 
      tipoOperacion: 'solicitud',
      idSolicitud: 'P-123'
    } as CreditoData;

    creditosServiceMock.getPrestamosYSolicitudes.and.returnValue(
      of({
        prestamos: [],
        solicitudes: [mockSolicitud],
        todos: [mockSolicitud]
      })
    );
    
    spyOn(component, 'navegar');
    component.obtenerCreditos();
    tick();
    
    expect(globalServiceMock.setFirstSignIn).toHaveBeenCalledWith(false);
    expect(component.navegar).toHaveBeenCalledWith(mockSolicitud);
  }));

  it('should format date correctly with formatDate', () => {
    expect(component.formatDate('2024-12-25')).toBe('25/12/2024');
    expect(component.formatDate('2024-12-25T10:30:00')).toBe('25/12/2024');
    expect(component.formatDate(null as any)).toBe('');
  });

  it('should handle navegar with Vigente estado', () => {
    const prestamo: CreditoData = {
      nroOrden: 10,
      estado: EstadosCreditos.Vigente,
      cantCuotas: 10,
      tipoOperacion: 'prestamo',
      idSolicitud: 'P-X',
      idSolicitudSinOrigen: 'X'
    };
    
    globalServiceMock.creditos$ = new BehaviorSubject([]).asObservable();
    component.navegar(prestamo);
    expect(routerMock.navigate).toHaveBeenCalledWith(['rodados/prestamo-en-curso']);
  });

  it('should handle navegar with Vencida estado (default case)', () => {
    const prestamo: CreditoData = {
      nroOrden: 10,
      estado: EstadosCreditos.Vencida,
      cantCuotas: 10,
      tipoOperacion: 'prestamo',
      idSolicitud: 'P-X',
      idSolicitudSinOrigen: 'X'
    };
    
    globalServiceMock.creditos$ = new BehaviorSubject([]).asObservable();
    component.navegar(prestamo);
    // Vencida no tiene case específico, va al default
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
