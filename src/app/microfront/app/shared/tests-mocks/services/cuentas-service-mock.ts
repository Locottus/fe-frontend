import { Observable } from 'rxjs';
import { cuentasMock } from '../data/cuentas-mock';

export class CuentasServiceMock {
  cuentasMock = cuentasMock;
  private cuenta;
  cuentasSetter(cuentas) {
    this.cuentasMock = cuentas;
  }

  cuentasGet() {
    return this.cuentasMock;
  }

  setCuentaSeleccionada(value) {
    this.cuenta = value;
  }

  getCuentaSeleccionada() {
    return this.cuenta;
  }

  getCuentas() {
    return new Observable((observer) => {
      setInterval(() => {
        observer.next(cuentasMock);
      }, 1000);
    });
  }
}
