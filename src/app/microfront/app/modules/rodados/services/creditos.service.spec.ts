import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreditosService } from './creditos.service';
import { SettingsService } from 'src/app/core/services/settings.service';

describe('CreditosService', () => {
  let service: CreditosService;
  let httpMock: HttpTestingController;
  let settings: any;

  beforeEach(() => {
    settings = {
      settings: {
        baseUrl: 'http://api/',
        backendRodadosUrl: 'rodados/'
      }
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreditosService, { provide: SettingsService, useValue: settings }]
    });

    service = TestBed.inject(CreditosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getPrestamosYSolicitudes formatea estados y separa prestamos/solicitudes', (done) => {
    const mock = [
      { tipoOperacion: 'prestamo', estado: 'P', idSolicitud: 'P-100', nroOrden: 1 },
      { tipoOperacion: 'solicitud', estado: 'D', idSolicitud: 'P-200', nroOrden: 2 },
      { tipoOperacion: 'prestamo', estado: 'Pendiente', idSolicitud: 'P-300', nroOrden: 3 }
    ];

    service.getPrestamosYSolicitudes(10).subscribe(({ prestamos, solicitudes, todos }) => {
      expect(todos.length).toBe(3);
      expect(todos[0].estado).toBe('Pendiente');
      expect(todos[1].estado).toBe('En proceso');
      expect(todos[0].idSolicitudSinOrigen).toBe('100');
      expect(prestamos.length).toBe(2);
      expect(solicitudes.length).toBe(1);
      done();
    });

    const req = httpMock.expectOne('http://api/rodados/PersonasFisicas/10/creditos');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getListaCreditos devuelve [] ante respuesta null', (done) => {
    service.getListaCreditos(20).subscribe((lista) => {
      expect(lista).toEqual([]);
      done();
    });
    const req = httpMock.expectOne('http://api/rodados/PersonasFisicas/20/creditos');
    req.flush(null);
  });
});
