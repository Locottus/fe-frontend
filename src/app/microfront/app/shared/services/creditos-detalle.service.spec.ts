import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CreditosDetalleService } from './creditos-detalle.service';
import { DetallePrestamoService } from 'src/app/modules/rodados/services/detalle-prestamo.service';
import { DetalleSolicitudService } from 'src/app/modules/rodados/services/detalle-solicitud.service';

describe('CreditosDetalleService', () => {
  let service: CreditosDetalleService;
  let detallePrestamoServiceMock: jasmine.SpyObj<DetallePrestamoService>;
  let detalleSolicitudServiceMock: jasmine.SpyObj<DetalleSolicitudService>;

  beforeEach(() => {
    detallePrestamoServiceMock = jasmine.createSpyObj('DetallePrestamoService', ['getDetallePrestamo']);
    detalleSolicitudServiceMock = jasmine.createSpyObj('DetalleSolicitudService', ['getDetalleSolicitud']);

    TestBed.configureTestingModule({
      providers: [
        CreditosDetalleService,
        { provide: DetallePrestamoService, useValue: detallePrestamoServiceMock },
        { provide: DetalleSolicitudService, useValue: detalleSolicitudServiceMock }
      ]
    });

    service = TestBed.inject(CreditosDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty arrays when no prestamos and no solicitudes', (done) => {
    service.obtenerDetalles([], [], 123).subscribe(result => {
      expect(result).toEqual({ prestamosDetallados: [], solicitudesDetalladas: [] });
      done();
    });
  });

  it('should return empty arrays when prestamos and solicitudes are undefined', (done) => {
    service.obtenerDetalles(undefined, undefined, 123).subscribe(result => {
      expect(result).toEqual({ prestamosDetallados: [], solicitudesDetalladas: [] });
      done();
    });
  });

  it('should obtain prestamos details', (done) => {
    const mockPrestamos = [
      { nroOrden: 1, idSolicitud: 'A' },
      { nroOrden: 2, idSolicitud: 'B' }
    ];
    const mockDetalle1 = { nroOrden: 1, monto: 1000 };
    const mockDetalle2 = { nroOrden: 2, monto: 2000 };

    detallePrestamoServiceMock.getDetallePrestamo.and.returnValues(
      of(mockDetalle1),
      of(mockDetalle2)
    );

    service.obtenerDetalles(mockPrestamos, [], 123).subscribe(result => {
      expect(result.prestamosDetallados).toEqual([mockDetalle1, mockDetalle2]);
      expect(result.solicitudesDetalladas).toEqual([]);
      expect(detallePrestamoServiceMock.getDetallePrestamo).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should obtain solicitudes details', (done) => {
    const mockSolicitudes = [
      { idSolicitud: 'A' },
      { idSolicitud: 'B' }
    ];
    const mockDetalle1 = { solicitud: { idSolicitud: 'A', monto: 1000 } };
    const mockDetalle2 = { solicitud: { idSolicitud: 'B', monto: 2000 } };

    detalleSolicitudServiceMock.getDetalleSolicitud.and.returnValues(
      of(mockDetalle1),
      of(mockDetalle2)
    );

    service.obtenerDetalles([], mockSolicitudes, 123).subscribe(result => {
      expect(result.prestamosDetallados).toEqual([]);
      expect(result.solicitudesDetalladas.length).toBe(2);
      expect(detalleSolicitudServiceMock.getDetalleSolicitud).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should handle errors in prestamo details and continue', (done) => {
    const mockPrestamos = [
      { nroOrden: 1, idSolicitud: 'A' },
      { nroOrden: 2, idSolicitud: 'B' }
    ];
    const mockDetalle = { nroOrden: 2, monto: 2000 };
    const consoleSpy = spyOn(console, 'error');

    detallePrestamoServiceMock.getDetallePrestamo.and.returnValues(
      throwError({ error: 'Error' }),
      of(mockDetalle)
    );

    service.obtenerDetalles(mockPrestamos, [], 123).subscribe(result => {
      expect(result.prestamosDetallados).toEqual([mockDetalle]);
      expect(consoleSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should handle errors in solicitud details and continue', (done) => {
    const mockSolicitudes = [
      { idSolicitud: 'A' },
      { idSolicitud: 'B' }
    ];
    const mockDetalle = { solicitud: { idSolicitud: 'B', monto: 2000 } };
    const consoleSpy = spyOn(console, 'error');

    detalleSolicitudServiceMock.getDetalleSolicitud.and.returnValues(
      throwError({ error: 'Error' }),
      of(mockDetalle)
    );

    service.obtenerDetalles([], mockSolicitudes, 123).subscribe(result => {
      expect(result.solicitudesDetalladas.length).toBe(1);
      expect(consoleSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should obtain both prestamos and solicitudes details', (done) => {
    const mockPrestamos = [{ nroOrden: 1, idSolicitud: 'A' }];
    const mockSolicitudes = [{ idSolicitud: 'B' }];
    const mockPrestamo = { nroOrden: 1, monto: 1000 };
    const mockSolicitud = { solicitud: { idSolicitud: 'B', monto: 2000 } };

    detallePrestamoServiceMock.getDetallePrestamo.and.returnValue(of(mockPrestamo));
    detalleSolicitudServiceMock.getDetalleSolicitud.and.returnValue(of(mockSolicitud));

    service.obtenerDetalles(mockPrestamos, mockSolicitudes, 123).subscribe(result => {
      expect(result.prestamosDetallados).toEqual([mockPrestamo]);
      expect(result.solicitudesDetalladas.length).toBe(1);
      done();
    });
  });

  it('should filter out null results', (done) => {
    const mockPrestamos = [
      { nroOrden: 1, idSolicitud: 'A' },
      { nroOrden: 2, idSolicitud: 'B' }
    ];
    const consoleSpy = spyOn(console, 'error');

    detallePrestamoServiceMock.getDetallePrestamo.and.returnValues(
      throwError({ error: 'Error' }),
      throwError({ error: 'Error' })
    );

    service.obtenerDetalles(mockPrestamos, [], 123).subscribe(result => {
      expect(result.prestamosDetallados).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
