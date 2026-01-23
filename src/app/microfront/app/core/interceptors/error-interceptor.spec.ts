import { ErrorInterceptor } from './error-interceptor';
import { ErrorService } from '../services/error.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';

const testUrl = '/data';

interface Data {
  name: string;
}

describe('ErrorInterceptor', () => {
  const service: ErrorService = null;
  let errorInterceptor;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  const mockErrorService = {
    getErrorMensajeServidor: jasmine.createSpy(),
    loguearAlServidor: jasmine.createSpy(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: ErrorService, useValue: mockErrorService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        }
      ],
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    errorInterceptor = TestBed.inject(ErrorInterceptor);
  });

  it('should create an instance', () => {
    expect(new ErrorInterceptor(service)).toBeTruthy();
  });


  it('Debería llamar a ErrorService para loguear en el servidor', () => {
    // Arrange
    const emsg = 'Http failure response for /data: 404 Not Found';

    httpClient.get<Data>(testUrl).subscribe(
      res => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.message).toEqual(emsg);
      }
    );

    // Act
    const req = httpMock.expectOne(testUrl);

    // Respond with mock error
    req.flush(emsg, { status: 404, statusText: 'Not Found' });


    // assert
    expect(mockErrorService.getErrorMensajeServidor).toHaveBeenCalledTimes(1);

  });

});
