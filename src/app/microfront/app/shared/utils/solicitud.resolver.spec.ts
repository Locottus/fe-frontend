import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { SolicitudDetalleResolver } from './solicitud.resolver';
import { GlobalService } from '../services/global.service';

describe('SolicitudDetalleResolver', () => {
  let resolver: SolicitudDetalleResolver;
  let globalServiceMock: jasmine.SpyObj<GlobalService>;

  beforeEach(() => {
    globalServiceMock = jasmine.createSpyObj('GlobalService', ['getSolicitudDetallada']);

    TestBed.configureTestingModule({
      providers: [
        SolicitudDetalleResolver,
        { provide: GlobalService, useValue: globalServiceMock }
      ]
    });

    resolver = TestBed.inject(SolicitudDetalleResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve and return solicitud detallada', (done) => {
    const mockSolicitud = { id: '123', estado: 'Aprobado' };
    globalServiceMock.getSolicitudDetallada.and.returnValue(of(mockSolicitud));

    const route = {} as ActivatedRouteSnapshot;

    resolver.resolve(route).subscribe(result => {
      expect(result).toEqual(mockSolicitud);
      expect(globalServiceMock.getSolicitudDetallada).toHaveBeenCalled();
      done();
    });
  });
});
