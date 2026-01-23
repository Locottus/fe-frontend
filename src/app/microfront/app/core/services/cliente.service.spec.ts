import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { SettingsService } from './settings.service';
import { Cliente, Preferencias } from '../../shared/models/cliente';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;
  let settingsService: jasmine.SpyObj<SettingsService>;

  const mockSettings = {
    baseUrl: 'https://api.test.com/',
    backendUrl: 'v1/'
  };

  const mockCliente: Cliente = {
    persona_id: '123',
    nombre: 'Juan',
    apellido: 'Pérez',
    ultimo_login: '2023-01-01T00:00:00.000Z' as any,
    fecha_expiracion_clave: '2024-01-01T00:00:00.000Z' as any,
    email: 'juan@test.com',
    celular: '1234567890',
    preferencias: {
      vio_menu: true,
      clave_por_vencer: false,
      vio_notificacion_clave: true
    }
  };

  beforeEach(() => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', [], {
      settings: mockSettings
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClienteService,
        { provide: SettingsService, useValue: settingsSpy }
      ]
    });

    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
    settingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;

    // Mock sessionStorage
    const mockSessionStorage = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
      clear: jasmine.createSpy('clear'),
      length: 0,
      key: jasmine.createSpy('key')
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Constructor', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getCliente', () => {
    it('should fetch cliente and process changes successfully', async () => {
      spyOn(service, 'procesarCambiosEnEntidadCliente');

      const clientePromise = service.getCliente();

      const req = httpMock.expectOne('https://api.test.com/v1/clientes');
      expect(req.request.method).toBe('GET');
      req.flush(mockCliente);

      const result = await clientePromise;

      expect(result).toEqual(mockCliente);
      expect(service.procesarCambiosEnEntidadCliente).toHaveBeenCalledWith(mockCliente);
    });

    it('should reject promise on HTTP error', async () => {
      const clientePromise = service.getCliente();

      const req = httpMock.expectOne('https://api.test.com/v1/clientes');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      try {
        await clientePromise;
        fail('Should have rejected');
      } catch (error) {
        // El servicio llama reject() sin parámetros, por lo que error será undefined
        expect(error).toBeUndefined();
      }
    });
  });

  describe('getClienteSession', () => {
    it('should return parsed cliente from sessionStorage', () => {
      const clienteJson = JSON.stringify(mockCliente);
      (window.sessionStorage.getItem as jasmine.Spy).and.returnValue(clienteJson);

      const result = service.getClienteSession();

      expect(result).toEqual(mockCliente);
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('cliente');
    });

    it('should return null if no cliente in sessionStorage', () => {
      (window.sessionStorage.getItem as jasmine.Spy).and.returnValue(null);

      const result = service.getClienteSession();

      expect(result).toBeNull();
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('cliente');
    });
  });

  describe('updatePreferencias', () => {
    it('should update preferencias and process changes', () => {
      const mockPreferencias: Preferencias = {
        vio_menu: false,
        clave_por_vencer: true,
        vio_notificacion_clave: false
      };
      
      const updatedCliente = { ...mockCliente, preferencias: mockPreferencias };
      (window.sessionStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockCliente));
      spyOn(service, 'procesarCambiosEnEntidadCliente');

      service.updatePreferencias(mockPreferencias);

      const req = httpMock.expectOne('https://api.test.com/v1/clientes');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockPreferencias);
      req.flush({});

      expect(service.procesarCambiosEnEntidadCliente).toHaveBeenCalledWith(updatedCliente);
    });

    it('should handle updatePreferencias request correctly', () => {
      const mockPreferencias: Preferencias = {
        vio_menu: false,
        clave_por_vencer: true,
        vio_notificacion_clave: false
      };
      
      (window.sessionStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockCliente));
      spyOn(service, 'procesarCambiosEnEntidadCliente');

      service.updatePreferencias(mockPreferencias);

      const req = httpMock.expectOne('https://api.test.com/v1/clientes');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockPreferencias);
      
      // Simular respuesta exitosa
      req.flush({});
      
      // Verificar que se procesaron los cambios
      expect(service.procesarCambiosEnEntidadCliente).toHaveBeenCalled();
    });
  });

  describe('procesarCambiosEnEntidadCliente', () => {
    it('should save cliente to sessionStorage and emit update', () => {
      spyOn(service, 'emitirActualizacionDatosCliente');

      service.procesarCambiosEnEntidadCliente(mockCliente);

      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('cliente', JSON.stringify(mockCliente));
      expect(service.emitirActualizacionDatosCliente).toHaveBeenCalledWith(mockCliente);
    });
  });

  describe('getcliente$', () => {
    it('should return observable that filters null values', (done) => {
      service.emitirActualizacionDatosCliente(mockCliente);

      service.getcliente$().subscribe(cliente => {
        expect(cliente).toEqual(mockCliente);
        done();
      });
    });

    it('should not emit null values', (done) => {
      let emittedCount = 0;

      service.getcliente$().subscribe(cliente => {
        emittedCount++;
        expect(cliente).toEqual(mockCliente);
        
        if (emittedCount === 1) {
          done();
        }
      });

      service.emitirActualizacionDatosCliente(null);
      service.emitirActualizacionDatosCliente(mockCliente);
    });
  });

  describe('emitirActualizacionDatosCliente', () => {
    it('should emit cliente through BehaviorSubject', (done) => {
      const subscription = service.getcliente$().subscribe(cliente => {
        expect(cliente).toEqual(mockCliente);
        subscription.unsubscribe();
        done();
      });

      service.emitirActualizacionDatosCliente(mockCliente);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full flow: fetch -> store -> retrieve', async () => {
      const fetchedCliente = await new Promise<Cliente>((resolve) => {
        service.getCliente().then(cliente => {
          resolve(cliente);
        });

        const req = httpMock.expectOne('https://api.test.com/v1/clientes');
        req.flush(mockCliente);
      });

      expect(fetchedCliente).toEqual(mockCliente);
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('cliente', JSON.stringify(mockCliente));

      (window.sessionStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockCliente));
      const sessionCliente = service.getClienteSession();
      expect(sessionCliente).toEqual(mockCliente);
    });
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
