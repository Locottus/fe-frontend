import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ErrorService', () => {
  let service: ErrorService;
  let mensaje: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ErrorService);
  });

  it('deberia crearse el servicio errorService', () => {
    expect(service).toBeTruthy();
  });

  it('deberia devolver el mensaje "No autorizado" si el ErrorResponse tiene un StatusCode 401', () => {
    const errorResponse = new HttpErrorResponse({
      error: '401 error',
      status: 401, statusText: 'Unauthorized'
    });

    mensaje = service.getErrorMensajeServidorByStatus(errorResponse);

    expect(mensaje).toEqual('No autorizado');
  });

  it('deberia devolver el mensaje "Backend no disponible" si el ErrorResponse tiene un StatusCode 0', () => {
    const errorResponse = new HttpErrorResponse({
      error: '0 error',
      status: 0, statusText: ''
    });

    mensaje = service.getErrorMensajeServidorByStatus(errorResponse);

    expect(mensaje).toEqual('Backend no disponible');
  });

  it('deberia devolver el mensaje "Error del servidor" si el ErrorResponse tiene un StatusCode 500', () => {
    const errorResponse = new HttpErrorResponse({
      error: '500 error',
      status: 500, statusText: 'Internal Server Error'
    });

    mensaje = service.getErrorMensajeServidorByStatus(errorResponse);

    expect(mensaje).toEqual('Error del servidor');
  });

  it('deberia devolver el mensaje del objeto Error si la propiedad mensaje es nula', () => {
    const error = new Error();

    mensaje = service.getErrorMensajeCliente(error);

    expect(mensaje).toEqual(error.toString());
  });

  it('deberia devolver el valor de la propiedad mensaje si no es nula ni vacia', () => {
    const error = new Error();
    error.message = 'Mensaje de error';
    mensaje = service.getErrorMensajeCliente(error);

    expect(mensaje).toEqual('Mensaje de error');
  });
});
