import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NotificationDrawerComponent } from './notification-drawer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Notificacion } from '../../models/notificacion';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { AngularMaterialModule } from '../../../angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let mockNotificacionService;
let component: NotificationDrawerComponent;
let notificaciones: Notificacion[];
let fixture: ComponentFixture<NotificationDrawerComponent>;

xdescribe('NotificationDrawerComponent', () => {

  mockNotificacionService = {
    setMostrarAvisoNotificacion: jasmine.createSpy(),
    notificacionesList: []
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationDrawerComponent ],
      providers: [
        { provide: NotificacionService, useValue: mockNotificacionService },
      ],
      imports: [AngularMaterialModule, HttpClientTestingModule, BrowserAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDrawerComponent);
    component = fixture.componentInstance;
  });

  it('debería mostrar el mensaje de notificaciones leidas, cuando no hay notificaciones', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.notificacion')).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.css('.notification-drawer-message#notificacionesLeidas')).length).toBe(1);
  });
});

describe('', () => {
  beforeEach(waitForAsync(() => {
    notificaciones = [
      {
        title: 'Titulo de notificación',
        description: 'Descripción de notificación',
        link: {
          description: 'Descripción de Link',
          href: '/link'
        }
      }
    ];

    mockNotificacionService = {
      setMostrarAvisoNotificacion: jasmine.createSpy(),
      notificacionesList: notificaciones
    };

    TestBed.configureTestingModule({
      declarations: [NotificationDrawerComponent],
      providers: [
        { provide: NotificacionService, useValue: mockNotificacionService },
      ],
      imports: [AngularMaterialModule, HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDrawerComponent);
    component = fixture.componentInstance;
  });

  it('debería mostrar las notificaciones, cuando no hay notificaciones', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.notificacion')).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.css('.notification-drawer-message#notificacionesLeidas')).length).toBe(0);
  });
});
