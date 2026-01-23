import { TestBed } from '@angular/core/testing';
import { SoftTokenService } from './soft-token.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from 'src/app/core/services/settings.service';
import { AuthService } from 'src/app/core/services/auth.service';

describe('SoftTokenService', () => {
  let service: SoftTokenService;
  let httpMock: HttpTestingController;
  let settingsServiceMock: SettingsService;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    settingsServiceMock = new SettingsService();
    settingsServiceMock.settings.baseUrl = 'http://fake-api/';
    settingsServiceMock.settings.backendRodadosUrl = 'obi/rodados/api/v1/';

    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getAuthMethod',
      'fetchToken',
      'extractTokenMobile',
      'getTokenDueTime'
    ]) as jasmine.SpyObj<AuthService>;
    authServiceMock.getAuthMethod.and.returnValue('normal');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SoftTokenService,
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(SoftTokenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerEstadoToken', () => {
    it('should get token status successfully', async () => {
      const idPersona = 12345;
      const mockResponse = {
        estado: 'activo',
        fechaExpiracion: '2026-01-20T12:00:00Z',
        intentosRestantes: 3
      };

      const promise = service.obtenerEstadoToken(idPersona);

      const req = httpMock.expectOne('http://fake-api/obi/rodados/api/v1/soft-token/estado/12345');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when getting token status', async () => {
      const idPersona = 12345;

      const promise = service.obtenerEstadoToken(idPersona);

      const req = httpMock.expectOne('http://fake-api/obi/rodados/api/v1/soft-token/estado/12345');
      req.error(new ErrorEvent('error'), { status: 404, statusText: 'Not Found' });

      await expectAsync(promise).toBeRejectedWithError('No se pudo obtener el estado del soft token');
    });
  });
});
