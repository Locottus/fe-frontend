import { Observable } from 'rxjs';
import { comprobantesMock } from '../data/comprobantes-mock';

export class ComprobantesServiceMock {
  obtenerComprobante() {
    return new Observable((observer) => {
      setInterval(() => {
        observer.next(comprobantesMock);
      }, 1000);
    });
  }
}
