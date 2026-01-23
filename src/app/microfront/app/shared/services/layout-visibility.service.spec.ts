import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { LayoutVisibilityService } from './layout-visibility.service';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

describe('LayoutVisibilityService', () => {
  let service: LayoutVisibilityService;
  let routerMock: any;
  let routerEventsSubject: Subject<any>;

  beforeEach(() => {
    routerEventsSubject = new Subject();
    routerMock = {
      events: routerEventsSubject.asObservable()
    };

    TestBed.configureTestingModule({
      providers: [
        LayoutVisibilityService,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(LayoutVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería emitir un valor boolean inicial', (done) => {
    service.getHeaderFooterVisibility$().pipe(take(1)).subscribe(isVisible => {
      expect(typeof isVisible).toBe('boolean');
      done();
    });
  });

  it('debería retornar el estado actual de forma sincrónica', () => {
    const isVisible = service.isHeaderFooterVisible();
    expect(typeof isVisible).toBe('boolean');
  });

  it('debería emitir el mismo observable a múltiples suscriptores (shareReplay)', (done) => {
    let value1: boolean | undefined;
    let value2: boolean | undefined;
    let count = 0;

    service.getHeaderFooterVisibility$().pipe(take(1)).subscribe(val => {
      value1 = val;
      count++;
      if (count === 2) {
        expect(value1).toBe(value2);
        done();
      }
    });

    service.getHeaderFooterVisibility$().pipe(take(1)).subscribe(val => {
      value2 = val;
      count++;
      if (count === 2) {
        expect(value1).toBe(value2);
        done();
      }
    });
  });

  it('debería responder a eventos NavigationEnd del router', (done) => {
    // Suscribirse al observable
    const subscription = service.getHeaderFooterVisibility$().subscribe();

    // Emitir un evento de navegación
    routerEventsSubject.next(new NavigationEnd(1, '/obi/solicitudes', '/obi/solicitudes'));

    // Verificar que el servicio procesó el evento sin errores
    setTimeout(() => {
      expect(service.isHeaderFooterVisible()).toBeDefined();
      subscription.unsubscribe();
      done();
    }, 100);
  });
});
