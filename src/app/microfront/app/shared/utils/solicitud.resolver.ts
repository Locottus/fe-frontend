import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GlobalService } from 'src/app/shared/services/global.service';

@Injectable({ providedIn: 'root' })
export class SolicitudDetalleResolver implements Resolve<any> {
  constructor(private globalService: GlobalService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.globalService.getSolicitudDetallada().pipe(take(1));
  }
}