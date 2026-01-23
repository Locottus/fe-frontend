import { TestBed } from '@angular/core/testing';
import { DocumentosService } from './documentos.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from 'src/app/core/services/settings.service';

describe('DocumentosService', () => {
  let service: DocumentosService;
  let httpMock: HttpTestingController;
  let settingsServiceMock: SettingsService;

  beforeEach(() => {
    settingsServiceMock = new SettingsService();
    settingsServiceMock.settings.baseUrl = 'http://fake-api/';
    settingsServiceMock.settings.backendRodadosUrl = '';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentosService, { provide: SettingsService, useValue: settingsServiceMock }]
    });

    service = TestBed.inject(DocumentosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET documentos without idPersona', () => {
    const mockResponse = { documentos: [] };
    service.getDocumentosSolicitud('123').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://fake-api/Documentos/solicitud/123');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('idPersona')).toBeFalse();
    req.flush(mockResponse);
  });

  it('should call GET documentos with idPersona', () => {
    const mockResponse = { documentos: [] };
    service.getDocumentosSolicitud('123', 456).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (r) => r.url === 'http://fake-api/Documentos/solicitud/123' && r.params.get('idPersona') === '456'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error and log it', () => {
    spyOn(console, 'error');
    service.getDocumentosSolicitud('123').subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(console.error).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne('http://fake-api/Documentos/solicitud/123');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
