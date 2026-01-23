import { TestBed } from '@angular/core/testing';
import { DetallePrestamoService } from './detalle-prestamo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from 'src/app/core/services/settings.service';

describe('DetallePrestamoService', () => {
  let service: DetallePrestamoService;
  let httpMock: HttpTestingController;
  let settingsServiceMock: SettingsService;

  beforeEach(() => {
    settingsServiceMock = new SettingsService();
    settingsServiceMock.settings.baseUrl = 'http://fake-api/';
    settingsServiceMock.settings.backendRodadosUrl = '';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DetallePrestamoService,
        { provide: SettingsService, useValue: settingsServiceMock }
      ]
    });

    service = TestBed.inject(DetallePrestamoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET detalle prestamo without optional params', (done) => {
    const mockResponse = {
      detallePrestamo: {
        prestamo: {} as any,
        cuotas: { listado: [] }
      },
      vehiculo: {} as any
    };
    service.getDetallePrestamo(123).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('http://fake-api/Prestamos/123');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('idPersona')).toBeFalse();
    expect(req.request.params.has('idSolicitud')).toBeFalse();
    req.flush(mockResponse);
  });

  it('should call GET detalle prestamo with idPersona', (done) => {
    const mockResponse = {
      detallePrestamo: {
        prestamo: {} as any,
        cuotas: { listado: [] }
      },
      vehiculo: {} as any
    };
    service.getDetallePrestamo(123, 456).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(
      (r) => r.url === 'http://fake-api/Prestamos/123' && r.params.get('idPersona') === '456'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call GET detalle prestamo with idPersona and idSolicitud', (done) => {
    const mockResponse = {
      detallePrestamo: {
        prestamo: {} as any,
        cuotas: { listado: [] }
      },
      vehiculo: {} as any
    };
    service.getDetallePrestamo(123, 456, 'ABC').subscribe((res) => {
      expect(res).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne(
      (r) => r.url === 'http://fake-api/Prestamos/123' && r.params.get('idPersona') === '456' && r.params.get('idSolicitud') === 'ABC'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error and log it', (done) => {
    spyOn(console, 'error');
    service.getDetallePrestamo(123, 456, 'ABC').subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(console.error).toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(
      (r) => r.url === 'http://fake-api/Prestamos/123' && r.params.get('idPersona') === '456' && r.params.get('idSolicitud') === 'ABC'
    );
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
