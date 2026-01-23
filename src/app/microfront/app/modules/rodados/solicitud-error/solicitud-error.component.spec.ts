import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudErrorComponent } from './solicitud-error.component';
import { RoutingService } from 'src/app/core/services/routing.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/core/services/auth.service';

describe('SolicitudErrorComponent', () => {
  let component: SolicitudErrorComponent;
  let fixture: ComponentFixture<SolicitudErrorComponent>;
  let routingServiceSpy: jasmine.SpyObj<RoutingService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    routingServiceSpy = jasmine.createSpyObj('RoutingService', ['navigate']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAuthMethod']);
    authServiceMock.getAuthMethod.and.returnValue('normal');

    await TestBed.configureTestingModule({
      declarations: [SolicitudErrorComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: AuthService, useValue: authServiceMock }
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "/" when navegar is called with false', () => {
    component.navegar(false);
    expect(routingServiceSpy.navigate).toHaveBeenCalledWith('/');
  });

  it('should navigate to "/rodados/solicitudes" when navegar is called with true', () => {
    component.navegar(true);
    expect(routingServiceSpy.navigate).toHaveBeenCalledWith('/rodados/solicitudes');
  });
});
