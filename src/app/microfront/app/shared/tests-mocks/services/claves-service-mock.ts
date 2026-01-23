import { Observable, of } from 'rxjs';

export class ClavesServiceMock {
  generar() {
    return new Observable((observer) => {
      setInterval(() => {
        observer.next('http://localhost:5000/obi/api/claves/456789');
      }, 1000);
    });
  }

  validar(uri: string, codigo: string) {
    return new Observable((observer) => {
      setInterval(() => {
        observer.next({});
      }, 1000);
    });
  }
  tieneAsociadoToken() {
    return of(
          {
            doble_factor: true
          }
    );
  }
}
