import { Observable } from 'rxjs';
import { bifurcacionesMock } from '../data/bifurcaciones-mock';


export class BifurcacionesServiceMock {
  bifurcar() {
    return new Observable((observer) => {
      setInterval(() => {
        observer.next(bifurcacionesMock);
      }, 1000);
    });
  }
}
