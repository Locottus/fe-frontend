import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { Idle } from '@ng-idle/core';
import { MatDialog } from '@angular/material/dialog';
import { MonitorActividadService } from './core/services/monitor-actividad.service';
import { SettingsService } from './core/services/settings.service';
import { RoutingService } from './core/services/routing.service';
import { GlobalStyleService } from './core/services/global-style.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let idleSpy: jasmine.SpyObj<Idle>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let routingServiceSpy: jasmine.SpyObj<RoutingService>;
  let globalStylesServiceSpy: jasmine.SpyObj<GlobalStyleService>;

  beforeEach(() => {
    idleSpy = jasmine.createSpyObj('Idle', [
      'setIdle',
      'setTimeout',
      'setInterrupts',
      'setAutoResume',
      'watch',
      'timeout'
    ], {
      onTimeout: { subscribe: jasmine.createSpy('subscribe') },
      onTimeoutWarning: { subscribe: jasmine.createSpy('subscribe') }
    });

    settingsServiceSpy = jasmine.createSpyObj('SettingsService', [], {
      settings: { idleSeconds: 10, idleTimeoutSeconds: 5 }
    });

    routingServiceSpy = jasmine.createSpyObj('RoutingService', ['logout']);
    globalStylesServiceSpy = jasmine.createSpyObj('GlobalStyleService', ['getGlobalSpinnerState$']);
    globalStylesServiceSpy.getGlobalSpinnerState$.and.returnValue({ subscribe: jasmine.createSpy('subscribe') });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: Idle, useValue: idleSpy },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open', 'closeAll']) },
        { provide: MonitorActividadService, useValue: jasmine.createSpyObj('MonitorActividadService', ['decrementarCountDown']) },
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: GlobalStyleService, useValue: globalStylesServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should set title to Obi on ngOnInit', () => {
    spyOnProperty(component, 'estaDentroDeRoot', 'get').and.returnValue(true);
    component.ngOnInit();
    expect(component.title).toBe('Obi');
  });

  it('should call inicializarControlDeSesionActiva if not inside /root', () => {
    spyOnProperty(component, 'estaDentroDeRoot', 'get').and.returnValue(false);
    const spy = spyOn(component as any, 'inicializarControlDeSesionActiva');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call inicializarControlDeSesionActiva if inside /root', () => {
    spyOnProperty(component, 'estaDentroDeRoot', 'get').and.returnValue(true);
    const spy = spyOn(component as any, 'inicializarControlDeSesionActiva');
    component.ngOnInit();
    expect(spy).not.toHaveBeenCalled();
  });
});