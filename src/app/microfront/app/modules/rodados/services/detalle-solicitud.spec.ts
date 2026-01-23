import { TestBed } from '@angular/core/testing';
import { DetalleSolicitudService, AsignarCuentaRequest } from './detalle-solicitud.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from 'src/app/core/services/settings.service';

describe('DetalleSolicitudService', () => {
  let service: DetalleSolicitudService;
  let httpMock: HttpTestingController;
  let settingsServiceMock: SettingsService;

  beforeEach(() => {
    settingsServiceMock = new SettingsService();
    settingsServiceMock.settings.baseUrl = 'http://fake-api/';
    settingsServiceMock.settings.backendRodadosUrl = '';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DetalleSolicitudService, { provide: SettingsService, useValue: settingsServiceMock }]
    });

    service = TestBed.inject(DetalleSolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDetalleSolicitud', () => {
    it('should call GET detalle solicitud', () => {
      const mockApiResponse = {
        id: '1',
        vehiculo: {
          codia: 123,
          anio: 2020,
          marca: 'Ford',
          modelo: 'Focus',
          numeroMotor: 'ABC123',
          numeroChasis: 'XYZ789',
          numeroDominio: 'AA123BB',
          gnc: false,
          ceroKm: true,
          uso: 'Particular',
          valorVehiculo: 1000000,
          tipoAutomotor: 'Auto',
          categoriaAutomovil: 'Sedan'
        },
        solicitud: {
          capital: 500000,
          capitalEnUvas: 0,
          plazo: 24,
          tna: 30,
          cft: 35,
          ltv: 70,
          tea: 32,
          cfta: 35.5,
          cftea: 36,
          precioTotalFinanciado: 600000,
          primerVencimiento: '2026-01-15T00:00:00',
          ultimoVencimiento: '2028-01-15T00:00:00',
          primeraCuota: 25000,
          primeraCuotaEnUvas: 0,
          ultimaCuota: 25000,
          ultimaCuotaEnUvas: 0,
          uvaAlDIa: 250.5,
          montoInscripcionPrenda: 10000,
          moneda: 'Pesos',
          monedaBantotal: 0,
          periodicidad: 'Mensual',
          cuotaPura: 24000,
          tipoTasa: 'Fija',
          sistemaAmortizacion: 'Francés',
          esUva: false,
          fechaAlta: '2026-01-10T10:00:00',
          diasRestantesVigenciaAprobado: 30,
          fechaAutorizacionCredito: '2026-01-10T00:00:00'
        },
        seguro: {
          aseguradora: 'Test Seguros',
          cobertura: 'Total',
          costoMensual: 5000,
          opcionesSeguro: ['Opción 1', 'Opción 2'],
          idCotizacion: 'COT123',
          esUva: false,
          esPreprenda: false
        },
        concesionario: {
          id: 999,
          razonSocial: 'Concesionario Test',
          cuit: '20123456789',
          asesorComercial: 'Juan Perez',
          codigoSucursalSupervielle: '001',
          nombreSucursalSupervielle: 'Sucursal Centro',
          emails: ['test@test.com'],
          cbu: '1234567890123456789012'
        },
        cuentas: [
          {
            tipo: { codigo: 'CA', descripcion: 'Caja de Ahorros' },
            preferida: true,
            moneda: { codigo: '0080', descripcion: 'Pesos', simbolo: '$' },
            cuenta: '001-123456-7',
            saldo: '10000',
            idCuentaVista: 'guid-123',
            cbu: '1234567890123456789012'
          }
        ],
        documentos: {
          documentos: [],
          terminosYCondiciones: { id: 't1', texto: 'texto' }
        }
      };

      service.getDetalleSolicitud('123', 1).subscribe((res) => {
        // Verificar que los campos principales estén mapeados correctamente
        expect(res.id).toBe('1');
        expect(res.vehiculo.codia).toBe(123);
        expect(res.vehiculo.marca).toBe('Ford');
        expect(res.solicitud.capital).toBe(500000);
        expect(res.solicitud.capitalEnUvas).toBe(0);
        expect(res.solicitud.cfta).toBe(35.5);
        expect(res.solicitud.primerVencimiento).toBe('15/01/2026');
        expect(res.solicitud.ultimoVencimiento).toBe('15/01/2028');
        expect(res.solicitud.fechaAlta).toBe('10/01/2026');
        expect(res.solicitud.uvaAlDIa).toBe(250.5);
        expect(res.seguro.aseguradora).toBe('Test Seguros');
        expect(res.concesionario.id).toBe(999);
        expect(res.concesionario.cuit).toBe('20123456789');
        expect(res.concesionario.cbu).toBe('1234567890123456789012');
        expect(res.cuentas.length).toBe(1);
        expect(res.cuentas[0].preferida).toBe(true);
        expect(res.cuentas[0].saldo).toBe('10000');
        expect(res.cuentas[0].idCuentaVista).toBe('guid-123');
        expect(res.cuentas[0].cbu).toBe('1234567890123456789012');
        expect(res.documentos.documentos).toEqual([]);
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/123?idPersona=1');
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should get detalle solicitud without idPersona parameter', () => {
      const mockApiResponse = {
        id: '456',
        vehiculo: { codia: 456 },
        solicitud: {},
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('456', 0).subscribe((res) => {
        expect(res.id).toBe('456');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/456');
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should handle missing vehiculo data with defaults', () => {
      const mockApiResponse = {
        id: '789',
        solicitud: {},
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('789', 1).subscribe((res) => {
        expect(res.vehiculo.codia).toBe(0);
        expect(res.vehiculo.anio).toBe(0);
        expect(res.vehiculo.marca).toBe('');
        expect(res.vehiculo.gnc).toBe(false);
        expect(res.vehiculo.ceroKm).toBe(false);
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/789?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should handle missing solicitud data with defaults', () => {
      const mockApiResponse = {
        id: '999',
        vehiculo: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('999', 1).subscribe((res) => {
        expect(res.solicitud.capital).toBe(0);
        expect(res.solicitud.plazo).toBe(0);
        expect(res.solicitud.primerVencimiento).toBe('');
        expect(res.solicitud.ultimoVencimiento).toBe('');
        expect(res.solicitud.fechaAlta).toBe('');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/999?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should handle missing seguro data with defaults', () => {
      const mockApiResponse = {
        id: '111',
        vehiculo: {},
        solicitud: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('111', 1).subscribe((res) => {
        expect(res.seguro.aseguradora).toBe('');
        expect(res.seguro.cobertura).toBe('');
        expect(res.seguro.costoMensual).toBe(0);
        expect(res.seguro.opcionesSeguro).toEqual([]);
        expect(res.seguro.esUva).toBe(false);
        expect(res.seguro.esPreprenda).toBe(false);
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/111?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should handle missing concesionario data with defaults', () => {
      const mockApiResponse = {
        id: '222',
        vehiculo: {},
        solicitud: {},
        seguro: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('222', 1).subscribe((res) => {
        expect(res.concesionario.id).toBe(0);
        expect(res.concesionario.razonSocial).toBe('');
        expect(res.concesionario.cuit).toBe('');
        expect(res.concesionario.asesorComercial).toBe('');
        expect(res.concesionario.emails).toEqual([]);
        expect(res.concesionario.cbu).toBe('');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/222?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should handle empty cuentas array', () => {
      const mockApiResponse = {
        id: '333',
        vehiculo: {},
        solicitud: {},
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('333', 1).subscribe((res) => {
        expect(res.cuentas).toEqual([]);
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/333?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should handle cuentas with missing tipo and moneda', () => {
      const mockApiResponse = {
        id: '444',
        vehiculo: {},
        solicitud: {},
        seguro: {},
        concesionario: {},
        cuentas: [
          {
            preferida: false,
            cuenta: '001-123-456'
          }
        ],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('444', 1).subscribe((res) => {
        expect(res.cuentas.length).toBe(1);
        expect(res.cuentas[0].tipo).toBeUndefined();
        expect(res.cuentas[0].moneda).toBeUndefined();
        expect(res.cuentas[0].cuenta).toBe('001-123-456');
        expect(res.cuentas[0].preferida).toBe(false);
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/444?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should handle multiple cuentas', () => {
      const mockApiResponse = {
        id: '555',
        vehiculo: {},
        solicitud: {},
        seguro: {},
        concesionario: {},
        cuentas: [
          {
            tipo: { codigo: 'CA', descripcion: 'Caja de Ahorros' },
            preferida: true,
            moneda: { codigo: '0080', descripcion: 'Pesos', simbolo: '$' },
            cuenta: '001-111-111',
            saldo: '5000',
            idCuentaVista: 'guid-1',
            cbu: 'cbu-1'
          },
          {
            tipo: { codigo: 'CC', descripcion: 'Cuenta Corriente' },
            preferida: false,
            moneda: { codigo: '0240', descripcion: 'Dólares', simbolo: 'USD' },
            cuenta: '001-222-222',
            saldo: '2000',
            idCuentaVista: 'guid-2',
            cbu: 'cbu-2'
          }
        ],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('555', 1).subscribe((res) => {
        expect(res.cuentas.length).toBe(2);
        expect(res.cuentas[0].preferida).toBe(true);
        expect(res.cuentas[0].moneda.codigo).toBe('0080');
        expect(res.cuentas[1].preferida).toBe(false);
        expect(res.cuentas[1].moneda.codigo).toBe('0240');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/555?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should format valid date correctly', () => {
      const mockApiResponse = {
        id: '666',
        vehiculo: {},
        solicitud: {
          primerVencimiento: '2025-12-25T14:30:00',
          fechaAlta: '2024-03-05T09:15:00'
        },
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('666', 1).subscribe((res) => {
        expect(res.solicitud.primerVencimiento).toBe('25/12/2025');
        expect(res.solicitud.fechaAlta).toBe('05/03/2024');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/666?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should handle invalid date format', () => {
      const mockApiResponse = {
        id: '777',
        vehiculo: {},
        solicitud: {
          primerVencimiento: 'invalid-date'
        },
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('777', 1).subscribe((res) => {
        expect(res.solicitud.primerVencimiento).toBe('');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/777?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should use idSolicitud as fallback when id is missing', () => {
      const mockApiResponse = {
        vehiculo: {},
        solicitud: {},
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('fallback-id', 1).subscribe((res) => {
        expect(res.id).toBe('fallback-id');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/fallback-id?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should handle boolean values conversion for vehiculo gnc and ceroKm', () => {
      const mockApiResponse = {
        id: '888',
        vehiculo: {
          gnc: 1,
          ceroKm: 0
        },
        solicitud: {},
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('888', 1).subscribe((res) => {
        expect(res.vehiculo.gnc).toBe(true);
        expect(res.vehiculo.ceroKm).toBe(false);
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/888?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should handle boolean values for solicitud esUva', () => {
      const mockApiResponse = {
        id: '999',
        vehiculo: {},
        solicitud: {
          esUva: 1
        },
        seguro: {
          esUva: true,
          esPreprenda: 0
        },
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('999', 1).subscribe((res) => {
        expect(res.solicitud.esUva).toBe(true);
        expect(res.seguro.esUva).toBe(true);
        expect(res.seguro.esPreprenda).toBe(false);
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/999?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should log API response to console', () => {
      spyOn(console, 'log');
      const mockApiResponse = {
        id: '1000',
        vehiculo: {},
        solicitud: {},
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('1000', 1).subscribe();

      const req = httpMock.expectOne('http://fake-api/Solicitudes/1000?idPersona=1');
      req.flush(mockApiResponse);

      expect(console.log).toHaveBeenCalledWith('*********************');
      expect(console.log).toHaveBeenCalledWith('[API RESPUESTA COMPLETA] Datos recibidos del API para solicitud:', '1000');
    });

    it('should handle error and log it', (done) => {
      spyOn(console, 'error');
      service.getDetalleSolicitud('123', 1).subscribe({
        next: () => fail('should error'),
        error: (err) => {
          expect(err.status).toBe(500);
          expect(console.error).toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/123?idPersona=1');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should handle missing documentos field', () => {
      const mockApiResponse = {
        id: '1001',
        vehiculo: {},
        solicitud: {},
        seguro: {},
        concesionario: {},
        cuentas: []
      };

      service.getDetalleSolicitud('1001', 1).subscribe((res) => {
        expect(res.documentos).toEqual({
          documentos: [],
          terminosYCondiciones: {
            id: '',
            texto: ''
          }
        });
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/1001?idPersona=1');
      req.flush(mockApiResponse);
    });
  });

  describe('asignarCuentaAcreditacion', () => {
    it('should call POST to assign cuenta acreditacion', (done) => {
      const mockResponse = { success: true };
      const idSolicitud = 'OBI-123';
      const idCuentaVista = '12345678-1234-1234-1234-123456789012';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe((res) => {
        expect(res).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        origen: 'OBI',
        idSolicitud,
        idCuentaVista
      } as AsignarCuentaRequest);
      req.flush(mockResponse);
    });

    it('should return success true when response is null', (done) => {
      const idSolicitud = 'OBI-123';
      const idCuentaVista = '12345678-1234-1234-1234-123456789012';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe((res) => {
        expect(res).toEqual({ success: true });
        done();
      });

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      req.flush(null);
    });

    it('should return response with success false', (done) => {
      const mockResponse = { success: false, message: 'Cannot assign account' };
      const idSolicitud = 'OBI-123';
      const idCuentaVista = '12345678-1234-1234-1234-123456789012';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe((res) => {
        expect(res.success).toBe(false);
        expect(res.message).toBe('Cannot assign account');
        done();
      });

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      req.flush(mockResponse);
    });

    it('should handle error when assigning cuenta', (done) => {
      spyOn(console, 'error');
      const idSolicitud = 'OBI-123';
      const idCuentaVista = '12345678-1234-1234-1234-123456789012';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe({
        next: () => fail('should error'),
        error: (err) => {
          expect(err.status).toBe(400);
          expect(console.error).toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });

    it('should extract origen correctly from idSolicitud', (done) => {
      const idSolicitud = 'ABC-999';
      const idCuentaVista = '12345678-1234-1234-1234-123456789012';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe();

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      expect(req.request.body.origen).toBe('ABC');
      req.flush({ success: true });
      done();
    });

    it('should handle idSolicitud with single part (no hyphen)', (done) => {
      const idSolicitud = 'SIMPLE';
      const idCuentaVista = '12345678-1234-1234-1234-123456789012';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe();

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      expect(req.request.body.origen).toBe('SIMPLE');
      req.flush({ success: true });
      done();
    });

    it('should handle empty idSolicitud', (done) => {
      const idSolicitud = '';
      const idCuentaVista = '12345678-1234-1234-1234-123456789012';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe();

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      expect(req.request.body.origen).toBe('');
      req.flush({ success: true });
      done();
    });

    it('should send correct request body with all fields', (done) => {
      const idSolicitud = 'TEST-001';
      const idCuentaVista = 'account-guid-123';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe();

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      expect(req.request.body.origen).toBe('TEST');
      expect(req.request.body.idSolicitud).toBe('TEST-001');
      expect(req.request.body.idCuentaVista).toBe('account-guid-123');
      req.flush({ success: true });
      done();
    });

    it('should handle error with 404 status', (done) => {
      spyOn(console, 'error');
      const idSolicitud = 'OBI-123';
      const idCuentaVista = '12345678-1234-1234-1234-123456789012';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe({
        next: () => fail('should error'),
        error: (err) => {
          expect(err.status).toBe(404);
          expect(console.error).toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle error with 500 status', (done) => {
      spyOn(console, 'error');
      const idSolicitud = 'OBI-123';
      const idCuentaVista = '12345678-1234-1234-1234-123456789012';

      service.asignarCuentaAcreditacion(idSolicitud, idCuentaVista).subscribe({
        next: () => fail('should error'),
        error: (err) => {
          expect(err.status).toBe(500);
          expect(console.error).toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne('http://fake-api/PersonasFisicas/asignarcuenta');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('formatDate (private method through getDetalleSolicitud)', () => {
    it('should format date with leading zeros correctly', () => {
      const mockApiResponse = {
        id: '1',
        vehiculo: {},
        solicitud: {
          primerVencimiento: '2025-01-05T10:30:00'
        },
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('1', 1).subscribe((res) => {
        expect(res.solicitud.primerVencimiento).toBe('05/01/2025');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/1?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should format date correctly for end of month', () => {
      const mockApiResponse = {
        id: '1',
        vehiculo: {},
        solicitud: {
          ultimoVencimiento: '2025-12-31T23:59:59'
        },
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('1', 1).subscribe((res) => {
        expect(res.solicitud.ultimoVencimiento).toBe('31/12/2025');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/1?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should return empty string for null date', () => {
      const mockApiResponse = {
        id: '1',
        vehiculo: {},
        solicitud: {
          primerVencimiento: null
        },
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('1', 1).subscribe((res) => {
        expect(res.solicitud.primerVencimiento).toBe('');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/1?idPersona=1');
      req.flush(mockApiResponse);
    });

    it('should return empty string for undefined date', () => {
      const mockApiResponse = {
        id: '1',
        vehiculo: {},
        solicitud: {
          primerVencimiento: undefined
        },
        seguro: {},
        concesionario: {},
        cuentas: [],
        documentos: { documentos: [], terminosYCondiciones: { id: '', texto: '' } }
      };

      service.getDetalleSolicitud('1', 1).subscribe((res) => {
        expect(res.solicitud.primerVencimiento).toBe('');
      });

      const req = httpMock.expectOne('http://fake-api/Solicitudes/1?idPersona=1');
      req.flush(mockApiResponse);
    });
  });
});
