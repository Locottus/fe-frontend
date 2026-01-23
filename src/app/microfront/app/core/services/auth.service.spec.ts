import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, ResponseTokenMobile, RequestTokenMobile, AuthType } from './auth.service';
import { SettingsService } from './settings.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let settingsService: jasmine.SpyObj<SettingsService>;
  let jwtHelperService: jasmine.SpyObj<JwtHelperService>;

  const mockSettings = {
    baseUrl: 'https://api.test.com/',
    backendUrl: 'v1/',
    jwtProviderUrl: 'https://jwt.test.com/token'
  };

  beforeEach(() => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', [], {
      settings: mockSettings
    });

    const jwtSpy = jasmine.createSpyObj('JwtHelperService', [
      'getTokenExpirationDate',
      'isTokenExpired'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: SettingsService, useValue: settingsSpy },
        { provide: JwtHelperService, useValue: jwtSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    settingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
    jwtHelperService = TestBed.inject(JwtHelperService) as jasmine.SpyObj<JwtHelperService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Constructor', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('fetchToken', () => {
    it('should fetch token from mobile when mobile token exists', (done) => {
      spyOn(service, 'extractTokenMobile').and.returnValue('mobile-token-123');
      
      const result$ = service.fetchToken();

      result$.subscribe(token => {
        expect(token).toBe('obi-token-response');
        expect(service.extractTokenMobile).toHaveBeenCalled();
        expect(service.getAuthMethod()).toBe('mobile');
        done();
      });

      const req = httpMock.expectOne('https://api.test.com/v1/mobile/autorizacion');
      req.flush({ token_obi: 'obi-token-response' });
    });

    it('should fetch token from legacy when mobile token does not exist', (done) => {
      spyOn(service, 'extractTokenMobile').and.returnValue(null);

      const result$ = service.fetchToken();

      result$.subscribe(token => {
        expect(token).toBe('legacy-token');
        expect(service.extractTokenMobile).toHaveBeenCalled();
        expect(service.getAuthMethod()).toBe('normal');
        done();
      });

      const req = httpMock.expectOne('https://jwt.test.com/token');
      req.flush('legacy-token');
    });
  });

  describe('fetchTokenFromMobile', () => {
    it('should set auth method to mobile and make correct HTTP request', (done) => {
      const mobileToken = 'test-mobile-token';
      const expectedResponse: ResponseTokenMobile = {
        token_obi: 'obi-token-response'
      };

      const result$ = (service as any).fetchTokenFromMobile(mobileToken);

      result$.subscribe(token => {
        expect(token).toBe('obi-token-response');
        expect(service.getAuthMethod()).toBe('mobile');
        done();
      });

      const req = httpMock.expectOne('https://api.test.com/v1/mobile/autorizacion');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        token_mobile: mobileToken
      } as RequestTokenMobile);

      req.flush(expectedResponse);
    });
  });

  describe('fetchTokenFromLegacy', () => {
    it('should set auth method to normal and make correct HTTP request', (done) => {
      const expectedToken = 'legacy-jwt-token';

      const result$ = (service as any).fetchTokenFromLegacy();

      result$.subscribe(token => {
        expect(token).toBe(expectedToken);
        expect(service.getAuthMethod()).toBe('normal');
        done();
      });

      const req = httpMock.expectOne('https://jwt.test.com/token');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('text');

      req.flush(expectedToken);
    });
  });

  describe('extractTokenMobile', () => {
    it('should return null when URLSearchParams is not available', () => {
      const originalURLSearchParams = (window as any).URLSearchParams;
      delete (window as any).URLSearchParams;

      const token = service.extractTokenMobile();

      expect(token).toBeNull();

      (window as any).URLSearchParams = originalURLSearchParams;
    });

    it('should work with URLSearchParams available', () => {
      // Since we can't easily mock window.location in this test environment,
      // we'll just test that the method doesn't throw an error when URLSearchParams exists
      expect(() => service.extractTokenMobile()).not.toThrow();
    });
  });

  describe('getAuthMethod', () => {
    it('should return undefined initially', () => {
      const authMethod = service.getAuthMethod();
      expect(authMethod).toBeUndefined();
    });

    it('should return mobile after fetchTokenFromMobile', (done) => {
      (service as any).fetchTokenFromMobile('test-token').subscribe(() => {
        expect(service.getAuthMethod()).toBe('mobile');
        done();
      });

      const req = httpMock.expectOne('https://api.test.com/v1/mobile/autorizacion');
      req.flush({ token_obi: 'test-obi-token' });
    });

    it('should return normal after fetchTokenFromLegacy', (done) => {
      (service as any).fetchTokenFromLegacy().subscribe(() => {
        expect(service.getAuthMethod()).toBe('normal');
        done();
      });

      const req = httpMock.expectOne('https://jwt.test.com/token');
      req.flush('test-token');
    });
  });
});