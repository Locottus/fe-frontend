import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SettingsService } from 'src/app/core/services/settings.service';
import { Cuenta } from 'src/app/shared/components/seleccionar-cuenta-drawer/seleccionar-cuenta-drawer.component';
import { CuentaVistaDTO } from '../interfaces/cuenta-vista.dto';

@Injectable({
  providedIn: 'root'
})
export class CuentasVistaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.apiUrl = `${this.settingsService.settings.baseUrl}${this.settingsService.settings.backendRodadosUrl}`;
  }

  /**
   * Obtiene las cuentas vista del cliente
   * @param idCuentaCliente ID del cliente para obtener sus cuentas
   * @returns Observable con array de Cuenta mapeado desde CuentaVistaDTO
   */
  getCuentasVista(idCuentaCliente: number): Observable<Cuenta[]> {
    const url = `${this.apiUrl}CuentasVista/${idCuentaCliente}`;

    return this.http.get<CuentaVistaDTO[]>(url).pipe(
      map(cuentas => this.mapCuentasVistaToCuentas(cuentas)),
      catchError(error => {
        console.error('Error al obtener cuentas vista:', error);
        return of([]);
      })
    );
  }

  /**
   * Mapea el array de CuentaVistaDTO al formato Cuenta usado en el componente
   */
  private mapCuentasVistaToCuentas(cuentasVista: CuentaVistaDTO[]): Cuenta[] {
    if (!cuentasVista || !Array.isArray(cuentasVista)) {
      return [];
    }

    return cuentasVista.map(cuenta => ({
      id: cuenta.idCuentaVista,
      descripcion: cuenta.descripcion,
      saldo: this.parseSaldo(cuenta.saldo),
      moneda: cuenta.moneda?.descripcion || cuenta.moneda?.simbolo || 'ARS'
    }));
  }

  /**
   * Parsea el saldo de string a number
   */
  private parseSaldo(saldo: string | number): number {
    if (typeof saldo === 'number') {
      return saldo;
    }
    const parsed = parseFloat(saldo);
    return isNaN(parsed) ? 0 : parsed;
  }
}
