import { Observable } from 'rxjs';
import { contratarPrestamoBodyMock } from '../data/contratar-prestamo-body-mock';
import { PrestamosRespMock } from '../data/prestamos-resp-mock';

export class PrestamosServiceMock {
  contratarPrestamoBody = contratarPrestamoBodyMock;
  prestamosResp = PrestamosRespMock;

  setPrestamoContratadoResp(prestamo) {
    this.prestamosResp = prestamo;
  }

  getPrestamoContratadoResp() {
    return this.prestamosResp;
  }

  setPrestamoContratado(prestamo) {
    this.contratarPrestamoBody = prestamo;
  }

  getPrestamoContratado() {
    return this.setPrestamoContratado;
  }

  contratar(prestamo) {
    return new Observable((observer) => {
      setInterval(() => {
        observer.next(this.contratarPrestamoBody);
      }, 1000);
    });
  }
}
