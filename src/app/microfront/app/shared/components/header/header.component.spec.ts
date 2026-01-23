import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificacionService } from 'src/app/core/services/notificacion.service';
import { By } from '@angular/platform-browser';
import { NotificationDrawerComponent } from '../notification-drawer/notification-drawer.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNotificacionService: jasmine.SpyObj<NotificacionService>;
  let mockActivatedRoute;
  let mockRouter;

  beforeEach(waitForAsync(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['fetchToken']);
    mockNotificacionService = jasmine.createSpyObj('NotificacionService', 
      ['getMostrarAvisoNotificacion$', 'setMostrarAvisoNotificacion'], 
      { notificacionesList: [] });
    mockNotificacionService.getMostrarAvisoNotificacion$.and.returnValue(of(false));

    mockActivatedRoute = {
      root: {
        snapshot: {
            children: [
          {
            data: {
              titulo: 'Primer Nivel'
            },
            children: [
              {
                data: {
                  titulo: 'Segundo Nivel',
                }
              }
            ]
          }
        ]
          }
      }
    };

    mockRouter = {
      events: of<Event>(new NavigationEnd(0, 'test', 'testAfterRedirect')),
    };

    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        NotificationDrawerComponent,
      ],
      imports: [
        HttpClientTestingModule,
        AngularMaterialModule,
        MatIconTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificacionService, useValue: mockNotificacionService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // Set up default sessionStorage spy to return null by default
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrarse siempre la campana de notificaciones', () => {
    const notificaciones = fixture.debugElement.query(By.css('.boton-notificacion') );
    expect(notificaciones).not.toBeNull();
  });

  it('debería llamarse a localStorage.removeItem("token") cuando se usa el botón de salir', () => {
    spyOn(localStorage, 'removeItem');
    const salirBoton = fixture.debugElement.query(By.css('.boton-salir'));
    expect(salirBoton).toBeTruthy();
    salirBoton.triggerEventHandler('click', {});
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('debería mostrar el breadcrum adecuado', () => {
    fixture.detectChanges();

    const breadcrumbItems = fixture.debugElement.queryAll(By.css('.header-breadcrumbs .header-breadcrumbs__item'));
    expect(breadcrumbItems.length).toBe(2);
    expect(breadcrumbItems[0].nativeElement.textContent.trim()).toBe('Primer Nivel');
    expect(breadcrumbItems[1].nativeElement.textContent.trim()).toBe('Segundo Nivel');

  });
});
