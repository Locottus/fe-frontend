import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from '../services/settings.service';
import { TestBed } from '@angular/core/testing';
import { TokenClientInterceptor } from './tokenClient.interceptor';

describe('TokenInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let settingsService: SettingsService;

  const token = '111111';
  const auth = { access_token: '222222' };
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SettingsService, TokenClientInterceptor, { provide: HTTP_INTERCEPTORS, useClass: TokenClientInterceptor, multi: true }]
    })
  );

  beforeEach(() => {
    localStorage.setItem('token', token);
    sessionStorage.setItem('auth', JSON.stringify(auth));

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    settingsService = TestBed.inject(SettingsService);
    settingsService.settings.baseUrl = 'http://localhost:5000';
    settingsService.settings.backendUrl = '/obi/api/';
    settingsService.settings.backendRodadosUrl = '/obi/rodados/api/';
  });

  it('should be created', () => {
    const interceptor: TokenClientInterceptor = TestBed.inject(TokenClientInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add token to headers', () => {
    const url = `${settingsService.settings.backendUrl}test`;
    sessionStorage.removeItem('auth');

    httpClient.get(url).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);

    httpTestingController.verify();
  });
});
