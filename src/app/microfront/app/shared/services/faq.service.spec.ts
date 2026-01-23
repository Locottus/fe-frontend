import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FaqService } from './faq.service';
import { SettingsService } from 'src/app/core/services/settings.service';

describe('FaqService', () => {
  let service: FaqService;
  let httpMock: HttpTestingController;
  let settingsServiceMock: SettingsService;

  beforeEach(() => {
    settingsServiceMock = new SettingsService();
    settingsServiceMock.settings.baseUrl = 'http://fake-api/';
    settingsServiceMock.settings.backendRodadosUrl = '';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FaqService,
        { provide: SettingsService, useValue: settingsServiceMock }
      ]
    });
    service = TestBed.inject(FaqService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET faqs successfully', () => {
    const mockResponse = { preguntas: [{ id: 1, pregunta: '¿Qué es?', respuesta: 'Una prueba.' }] };
    service.getFaqs().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://fake-api/PreguntasFrecuentes');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error and propagate custom error', (done) => {
    service.getFaqs().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        done();
      }
    });

    const req = httpMock.expectOne('http://fake-api/PreguntasFrecuentes');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should use the correct URL from settingsService', () => {
    expect(service.faqUrl).toBe('http://fake-api/PreguntasFrecuentes');
  });
});
