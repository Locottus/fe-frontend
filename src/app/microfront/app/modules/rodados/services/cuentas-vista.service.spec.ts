import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CuentasVistaService } from './cuentas-vista.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { CuentaVistaDTO } from '../interfaces/cuenta-vista.dto';

describe('CuentasVistaService', () => {
  let service: CuentasVistaService;
  let httpMock: HttpTestingController;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  const mockSettings = {
    baseUrl: 'http://localhost:4200/',
    backendRodadosUrl: 'api/v1.0/'
  };

  const mockCuentasVistaResponse: CuentaVistaDTO[] = [
    {
      idCuentaVista: '123456',
      descripcion: 'CA ARS 100-584473-1',
      saldo: '15000.50',
      moneda: { codigo: '80', descripcion: 'Pesos', simbolo: '$' },
      bloqueos: { monto: 0, tiene: false },
      bonificaciones: [],
      clase: { codigo: '1', descripcion: 'Cuenta Corriente' },
      compatibilidadBantotal: null,
      datosAdicionales: { cbu: '1234567890123456789012', paquete: null, ultimoMovimiento: '' },
      estado: { codigo: 'A', descripcion: 'Activa' },
      fechaAlta: '2020-01-01',
      fechaAltaCuentaOriginal: '2020-01-01',
      identificadorUnificado: '123456',
      informacionRemunerada: null,
      migracion: null,
      operativoConBloqueo: 'N',
      permiteOperar: { codigo: 'S', descripcion: 'Si' },
      preferida: true,
      saldoAcuerdos: 0,
      saldoInicial: 0,
      saldoUnificado: 15000.50,
      sucursal: { codigo: '100', descripcion: 'Casa Central' },
      tipo: { codigo: 'CA', descripcion: 'Caja de Ahorro' }
    },
    {
      idCuentaVista: '789012',
      descripcion: 'CA ARS 100-584473-2',
      saldo: '50000',
      moneda: { codigo: '80', descripcion: 'Pesos', simbolo: '$' },
      bloqueos: { monto: 0, tiene: false },
      bonificaciones: [],
      clase: { codigo: '1', descripcion: 'Cuenta Corriente' },
      compatibilidadBantotal: null,
      datosAdicionales: { cbu: '9876543210987654321098', paquete: null, ultimoMovimiento: '' },
      estado: { codigo: 'A', descripcion: 'Activa' },
      fechaAlta: '2021-06-15',
      fechaAltaCuentaOriginal: '2021-06-15',
      identificadorUnificado: '789012',
      informacionRemunerada: null,
      migracion: null,
      operativoConBloqueo: 'N',
      permiteOperar: { codigo: 'S', descripcion: 'Si' },
      preferida: false,
      saldoAcuerdos: 0,
      saldoInicial: 0,
      saldoUnificado: 50000,
      sucursal: { codigo: '100', descripcion: 'Casa Central' },
      tipo: { codigo: 'CA', descripcion: 'Caja de Ahorro' }
    }
  ];

  beforeEach(() => {
    settingsServiceSpy = jasmine.createSpyObj('SettingsService', [], {
      settings: mockSettings
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CuentasVistaService,
        { provide: SettingsService, useValue: settingsServiceSpy }
      ]
    });

    service = TestBed.inject(CuentasVistaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCuentasVista', () => {
    it('should return mapped cuentas on success', (done) => {
      const idCuentaCliente = 12345;

      service.getCuentasVista(idCuentaCliente).subscribe(cuentas => {
        expect(cuentas.length).toBe(2);
        expect(cuentas[0].id).toBe('123456');
        expect(cuentas[0].descripcion).toBe('CA ARS 100-584473-1');
        expect(cuentas[0].saldo).toBe(15000.50);
        expect(cuentas[0].moneda).toBe('Pesos');
        expect(cuentas[1].id).toBe('789012');
        expect(cuentas[1].saldo).toBe(50000);
        done();
      });

      const req = httpMock.expectOne(`${mockSettings.baseUrl}${mockSettings.backendRodadosUrl}CuentasVista/${idCuentaCliente}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCuentasVistaResponse);
    });

    it('should return empty array on error', (done) => {
      const idCuentaCliente = 12345;

      service.getCuentasVista(idCuentaCliente).subscribe(cuentas => {
        expect(cuentas).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${mockSettings.baseUrl}${mockSettings.backendRodadosUrl}CuentasVista/${idCuentaCliente}`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should return empty array when response is null', (done) => {
      const idCuentaCliente = 12345;

      service.getCuentasVista(idCuentaCliente).subscribe(cuentas => {
        expect(cuentas).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${mockSettings.baseUrl}${mockSettings.backendRodadosUrl}CuentasVista/${idCuentaCliente}`);
      req.flush(null);
    });

    it('should handle saldo as number', (done) => {
      const idCuentaCliente = 12345;
      const responseWithNumericSaldo = [{
        ...mockCuentasVistaResponse[0],
        saldo: 25000 as any
      }];

      service.getCuentasVista(idCuentaCliente).subscribe(cuentas => {
        expect(cuentas[0].saldo).toBe(25000);
        done();
      });

      const req = httpMock.expectOne(`${mockSettings.baseUrl}${mockSettings.backendRodadosUrl}CuentasVista/${idCuentaCliente}`);
      req.flush(responseWithNumericSaldo);
    });

    it('should use simbolo when descripcion is not available', (done) => {
      const idCuentaCliente = 12345;
      const responseWithSymbol = [{
        ...mockCuentasVistaResponse[0],
        moneda: { codigo: '80', descripcion: null, simbolo: 'USD' }
      }];

      service.getCuentasVista(idCuentaCliente).subscribe(cuentas => {
        expect(cuentas[0].moneda).toBe('USD');
        done();
      });

      const req = httpMock.expectOne(`${mockSettings.baseUrl}${mockSettings.backendRodadosUrl}CuentasVista/${idCuentaCliente}`);
      req.flush(responseWithSymbol);
    });

    it('should default to ARS when moneda is not available', (done) => {
      const idCuentaCliente = 12345;
      const responseWithoutMoneda = [{
        ...mockCuentasVistaResponse[0],
        moneda: null
      }];

      service.getCuentasVista(idCuentaCliente).subscribe(cuentas => {
        expect(cuentas[0].moneda).toBe('ARS');
        done();
      });

      const req = httpMock.expectOne(`${mockSettings.baseUrl}${mockSettings.backendRodadosUrl}CuentasVista/${idCuentaCliente}`);
      req.flush(responseWithoutMoneda);
    });
  });
});
