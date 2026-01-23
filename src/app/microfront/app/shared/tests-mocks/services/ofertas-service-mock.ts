import { Observable } from 'rxjs';
import { IOfertaSimulada } from '../../../modules/prestamos/interfaces/oferta-simulada';
import { montoMaximo, montoMinimo, ofertaMock } from '../data/oferta-mock';

export class OfertasServiceMock {
    ofertasArrayMock: IOfertaSimulada[] = ofertaMock;

    ofertasSetter(ofertas) {
      this.ofertasArrayMock = ofertas;
    }
    ofertasGet() {
      return this.ofertasArrayMock;
    }

    getOfertas() {
      return new Observable((observer) => {
        setInterval(() => {
          observer.next(ofertaMock);
        }, 1000);
      });
    }
    getOfertaMontos() {
      const result = {
        monto_minimo: montoMinimo,
        monto_maximo: montoMaximo
      };
      return new Observable((observer) => {
        setInterval(() => {
          observer.next(result);
        }, 1000);
      });
    }
  }
