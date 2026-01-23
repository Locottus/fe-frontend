import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes.component';
import { FaqService } from '../../../shared/services/faq.service';
import { of, throwError } from 'rxjs';
import { FaqDTO } from '../../../shared/models/faq.dto';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/core/services/auth.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';

describe('PreguntasFrecuentesComponent', () => {
  let component: PreguntasFrecuentesComponent;
  let fixture: ComponentFixture<PreguntasFrecuentesComponent>;
  let faqServiceSpy: jasmine.SpyObj<FaqService>;
  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let globalServiceMock: jasmine.SpyObj<GlobalService>;
  let layoutRemoteServiceMock: jasmine.SpyObj<LayoutRemoteService>;

  beforeEach(async () => {
    faqServiceSpy = jasmine.createSpyObj('FaqService', ['getFaqs']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAuthMethod']);
    authServiceMock.getAuthMethod.and.returnValue('normal');
    globalServiceMock = jasmine.createSpyObj('GlobalService', ['getExistePreguntasFrecuentes', 'getFaqs']);
    globalServiceMock.getExistePreguntasFrecuentes.and.returnValue(false);
    layoutRemoteServiceMock = jasmine.createSpyObj('LayoutRemoteService', ['ocultarLayout']);

    await TestBed.configureTestingModule({
      declarations: [PreguntasFrecuentesComponent],
      providers: [
        { provide: FaqService, useValue: faqServiceSpy },
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: GlobalService, useValue: globalServiceMock },
        { provide: LayoutRemoteService, useValue: layoutRemoteServiceMock }
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntasFrecuentesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load faqs on init', () => {
    const mockFaq: FaqDTO = { preguntas: [{ pregunta: '¿Test?', respuesta: 'Sí' }] } as any;
    faqServiceSpy.getFaqs.and.returnValue(of(mockFaq));
    component.ngOnInit();
    expect(component.pregFrecuentes).toEqual(mockFaq);
  });

  it('should handle error when loading faqs', () => {
    spyOn(console, 'error');
    const testError = new Error('fail');
    faqServiceSpy.getFaqs.and.returnValue(throwError(testError));
    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('Error al obtener las preguntas frecuentes: ', testError);
    expect(component.isLoading).toBeTrue();
    expect(component.pregFrecuentes).toBeNull();
  });

  it('should navigate to /solicitudes when backAction is called', () => {
    component.backAction();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/solicitudes']);
  });

  it('should set isMobile to true when authMethod is mobile', () => {
    authServiceMock.getAuthMethod.and.returnValue('mobile');
    faqServiceSpy.getFaqs.and.returnValue(of({ preguntas: [] } as any));
    
    component.ngOnInit();
    
    expect(component.isMobile).toBe(true);
  });

  it('should set isMobile to false when authMethod is not mobile', () => {
    authServiceMock.getAuthMethod.and.returnValue('desktop');
    faqServiceSpy.getFaqs.and.returnValue(of({ preguntas: [] } as any));
    
    component.ngOnInit();
    
    expect(component.isMobile).toBe(false);
  });

  it('should use cached faqs when getExistePreguntasFrecuentes returns true', () => {
    const cachedFaqs: FaqDTO = { preguntas: [{ pregunta: 'Cached?', respuesta: 'Yes' }] } as any;
    globalServiceMock.getExistePreguntasFrecuentes.and.returnValue(true);
    globalServiceMock.getFaqs.and.returnValue(cachedFaqs);
    
    component.obtenerFaq();
    
    expect(faqServiceSpy.getFaqs).not.toHaveBeenCalled();
    expect(component.pregFrecuentes).toEqual(cachedFaqs);
    expect(component.isLoading).toBe(false);
  });

  it('should fetch faqs from service when not cached', () => {
    const mockFaq: FaqDTO = { preguntas: [{ pregunta: '¿New?', respuesta: 'Fresh' }] } as any;
    globalServiceMock.getExistePreguntasFrecuentes.and.returnValue(false);
    faqServiceSpy.getFaqs.and.returnValue(of(mockFaq));
    
    component.obtenerFaq();
    
    expect(faqServiceSpy.getFaqs).toHaveBeenCalled();
    expect(component.pregFrecuentes).toEqual(mockFaq);
    expect(component.isLoading).toBe(false);
  });

  it('should set pfStyle based on colorBg input', () => {
    component.colorBg = '#ff0000';
    faqServiceSpy.getFaqs.and.returnValue(of({ preguntas: [] } as any));
    
    component.ngOnInit();
    
    expect(component.pfStyle.background).toBe('#ff0000');
  });

  it('should dispatch customizeHeaderEvent on init', () => {
    const dispatchSpy = spyOn(window, 'dispatchEvent');
    faqServiceSpy.getFaqs.and.returnValue(of({ preguntas: [] } as any));
    
    component.ngOnInit();
    
    expect(dispatchSpy).toHaveBeenCalled();
    const event = dispatchSpy.calls.mostRecent().args[0] as CustomEvent;
    expect(event.type).toBe('customizeHeaderEvent');
    expect(event.detail.title).toBe('Préstamos Prendarios');
  });

  it('should set isLoading to true on ngOnInit', () => {
    faqServiceSpy.getFaqs.and.returnValue(of({ preguntas: [] } as any));
    
    component.ngOnInit();
    
    // After loading completes, isLoading should be false
    expect(globalServiceMock.getExistePreguntasFrecuentes).toHaveBeenCalled();
  });

  it('should initialize with default values', () => {
    expect(component.isLoading).toBe(true);
    expect(component.pregFrecuentes).toBeNull();
  });
});
