import { TestBed } from '@angular/core/testing';
import { TerminosCondicionesService } from './terminos-y-condiciones.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from 'src/app/core/services/settings.service';

describe('TerminosCondicionesService', () => {
  let service: TerminosCondicionesService;
  let httpMock: HttpTestingController;
  let settingsServiceMock: SettingsService;

  beforeEach(() => {
    settingsServiceMock = new SettingsService();
    settingsServiceMock.settings.baseUrl = 'http://fake-api/';
    settingsServiceMock.settings.backendRodadosUrl = '';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TerminosCondicionesService,
        { provide: SettingsService, useValue: settingsServiceMock }
      ]
    });

    service = TestBed.inject(TerminosCondicionesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to aceptarTyC with correct body', () => {
    const documentos = [{ id: 1, nombre: 'doc1' }, { id: 2, nombre: 'doc2' }];
    service.aceptarTyC(123, 'ABC', documentos as any, 'T1').subscribe(res => {
      expect(res).toEqual({ ok: true });
    });

    const req = httpMock.expectOne('http://fake-api/TerminosCondiciones');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      idPersona: 123,
      idSolicitud: 'ABC',
      documentosAceptados: {
        idTerminosCondiciones: 'T1',
        documentos: [
          { id: 1, nombreArchivo: 'doc1' },
          { id: 2, nombreArchivo: 'doc2' }
        ]
      }
    });
    req.flush({ ok: true });
  });

  it('should handle error in aceptarTyC', (done) => {
    spyOn(console, 'error');
    service.aceptarTyC(123, 'ABC', [], 'T1').subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(console.error).toHaveBeenCalled();
        expect(err.status).toBe(500);
        done();
      }
    });

    const req = httpMock.expectOne('http://fake-api/TerminosCondiciones');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should POST to /error in reportarErrorTyc', () => {
    const dto = { id: 1, solicitud: {} } as any;
    service.reportarErrorTyc(dto).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://fake-api//error');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(null);
  });
});
