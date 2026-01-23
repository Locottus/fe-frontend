import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AceptacionTycComponent } from './aceptacion-tyc.component';
import { RoutingService } from 'src/app/core/services/routing.service';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Preferencias } from 'src/app/shared/models/cliente';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AceptacionTycComponent', () => {
  let component: AceptacionTycComponent;
  let fixture: ComponentFixture<AceptacionTycComponent>;
  let routingServiceMock: jasmine.SpyObj<RoutingService>;
  let layoutRemoteServiceMock: jasmine.SpyObj<LayoutRemoteService>;
  let clienteServiceMock: jasmine.SpyObj<ClienteService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    routingServiceMock = jasmine.createSpyObj('RoutingService', ['navigate']);
    layoutRemoteServiceMock = jasmine.createSpyObj('LayoutRemoteService', ['ocultarLayout']);
    clienteServiceMock = jasmine.createSpyObj('ClienteService', ['getClienteSession']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAuthMethod']);
    authServiceMock.getAuthMethod.and.returnValue('normal');
    clienteServiceMock.getClienteSession.and.returnValue({
      nombre: 'Test',
      apellido: 'User',
      ultimo_login: new Date(),
      fecha_expiracion_clave: new Date(),
      preferencias: {},
      email: 'test@email.com'
    });

    await TestBed.configureTestingModule({
      declarations: [AceptacionTycComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceMock },
        { provide: LayoutRemoteService, useValue: layoutRemoteServiceMock },
        { provide: ClienteService, useValue: clienteServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AceptacionTycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch internalLoadingEvent on ngAfterViewChecked', () => {
    const dispatchEventSpy = spyOn(window, 'dispatchEvent');

    component.ngAfterViewChecked();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new CustomEvent('internalLoadingEvent', { detail: { loading: false, remote: 'feObiRodados' } })
    );
  });

  it('should navigate to "/procesando-solicitud" when salir() is called', () => {
    component.salir();
    expect(routingServiceMock.navigate).toHaveBeenCalledWith('rodados/procesando-solicitud');
  });

  it('should call navigate exactly once with "/procesando-solicitud" when salir() is called', () => {
    component.salir();
    expect(routingServiceMock.navigate).toHaveBeenCalledTimes(1);
    expect(routingServiceMock.navigate).toHaveBeenCalledWith('rodados/procesando-solicitud');
  });
});
describe('ngOnInit', () => {
  let component: AceptacionTycComponent;
  let fixture: ComponentFixture<AceptacionTycComponent>;
  let clienteServiceMock: jasmine.SpyObj<ClienteService>;
  let routingServiceMock: jasmine.SpyObj<RoutingService>;
  let layoutRemoteServiceMock: jasmine.SpyObj<LayoutRemoteService>;
  const mockCliente = {
    nombre: 'Test',
    apellido: 'User',
    ultimo_login: new Date(),
    fecha_expiracion_clave: new Date(),
    preferencias: {},
    email: 'test@email.com'
  };

  beforeEach(() => {
    routingServiceMock = jasmine.createSpyObj('RoutingService', ['navigate']);
    layoutRemoteServiceMock = jasmine.createSpyObj('LayoutRemoteService', ['ocultarLayout']);
    clienteServiceMock = jasmine.createSpyObj('ClienteService', ['getClienteSession']);
    clienteServiceMock.getClienteSession.and.returnValue(mockCliente);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [AceptacionTycComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceMock },
        { provide: LayoutRemoteService, useValue: layoutRemoteServiceMock },
        { provide: ClienteService, useValue: clienteServiceMock },
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['getAuthMethod']) }
      ],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AceptacionTycComponent);
    component = fixture.componentInstance;
  });

  it('should set cliente and email from ClienteService on ngOnInit', () => {
    component.ngOnInit();
    expect(clienteServiceMock.getClienteSession).toHaveBeenCalled();
    expect(component.cliente).toEqual(mockCliente);
    expect(component.email).toBe(mockCliente.email);
  });
});
