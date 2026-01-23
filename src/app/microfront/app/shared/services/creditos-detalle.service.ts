import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DetallePrestamoService } from 'src/app/modules/rodados/services/detalle-prestamo.service';
import { DetalleSolicitudService } from 'src/app/modules/rodados/services/detalle-solicitud.service';
import { formatDetalleSolicitud } from '../utils/creditos-utils';

@Injectable({ providedIn: 'root' })
export class CreditosDetalleService {
  constructor(
    private detallePrestamoService: DetallePrestamoService,
    private detalleSolicitudService: DetalleSolicitudService
  ) {}

  obtenerDetalles(
    prestamos: any[] | undefined,
    solicitudes: any[] | undefined,
    userID: number
  ): Observable<{ prestamosDetallados: any[]; solicitudesDetalladas: any[] }> {
    if (!prestamos?.length && !solicitudes?.length) {
      return of({ prestamosDetallados: [], solicitudesDetalladas: [] });
    }

    const prestamosObservables = prestamos?.length
      ? prestamos.map((p) =>
          this.detallePrestamoService.getDetallePrestamo(p.nroOrden, userID, p.idSolicitud).pipe(
            catchError((error) => {
              console.error(`Error al obtener detalle de préstamo ${p.nroOrden}:`, error);
              return of(null);
            })
          )
        )
      : [];

    const solicitudesObservables = solicitudes?.length
      ? solicitudes.map((s) =>
          this.detalleSolicitudService.getDetalleSolicitud(s.idSolicitud, userID).pipe(
            map((detalle) => formatDetalleSolicitud(detalle)),
            catchError((error) => {
              console.error(`Error al obtener detalle de solicitud ${s.idSolicitud}:`, error);
              return of(null);
            })
          )
        )
      : [];

    return forkJoin([
      prestamosObservables.length ? forkJoin(prestamosObservables) : of([]),
      solicitudesObservables.length ? forkJoin(solicitudesObservables) : of([])
    ]).pipe(
      map(([prestamosDetalles, solicitudesDetalles]) => {
        return {
          prestamosDetallados: prestamosDetalles.filter((d) => d !== null),
          solicitudesDetalladas: solicitudesDetalles.filter((d) => d !== null)
        };
      })
    );
  }
}
