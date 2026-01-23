import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DetalleSolicitudDTO, Documento } from '../interfaces/detalle-solicitud.dto';
import { catchError, map } from 'rxjs/operators';
import { SettingsService } from 'src/app/core/services/settings.service';

export interface AsignarCuentaRequest {
  origen: string;
  idSolicitud: string;
  idCuentaVista: string;
}

export interface AsignarCuentaResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DetalleSolicitudService {
  apiUrl: string;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.apiUrl = `${this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl}`;
  }

  getDetalleSolicitud(idSolicitud: string, idPersona: number): Observable<DetalleSolicitudDTO> {
    const url = `${this.apiUrl}Solicitudes/${idSolicitud}`;
    let params = new HttpParams();

    if (idPersona) {
      params = params.append('idPersona', idPersona.toString());
    }

    return this.http.get<any>(url, { params }).pipe(
      map((response) => {
        console.log('*********************');
        console.log('[API RESPUESTA COMPLETA] Datos recibidos del API para solicitud:', idSolicitud);
        console.log(JSON.stringify(response, null, 2));
        console.log('*********************');
        const dto: DetalleSolicitudDTO = {
          id: response?.id ?? idSolicitud,
          vehiculo: {
            codia: response?.vehiculo?.codia ?? 0,
            anio: response?.vehiculo?.anio ?? 0,
            marca: response?.vehiculo?.marca ?? '',
            modelo: response?.vehiculo?.modelo ?? '',
            numeroMotor: response?.vehiculo?.numeroMotor ?? '',
            numeroChasis: response?.vehiculo?.numeroChasis ?? '',
            numeroDominio: response?.vehiculo?.numeroDominio ?? '',
            gnc: !!response?.vehiculo?.gnc,
            ceroKm: !!response?.vehiculo?.ceroKm,
            uso: response?.vehiculo?.uso ?? '',
            valorVehiculo: response?.vehiculo?.valorVehiculo ?? 0,
            tipoAutomotor: response?.vehiculo?.tipoAutomotor ?? '',
            categoriaAutomovil: response?.vehiculo?.categoriaAutomovil ?? ''
          },
          solicitud: {
            capital: response?.solicitud?.capital ?? 0,
            capitalEnUvas: response?.solicitud?.capitalEnUvas ?? 0,
            plazo: response?.solicitud?.plazo ?? 0,
            tna: response?.solicitud?.tna ?? 0,
            cft: response?.solicitud?.cft ?? 0,
            ltv: response?.solicitud?.ltv ?? 0,
            tea: response?.solicitud?.tea ?? 0,
            cfta: response?.solicitud?.cfta ?? 0,
            cftea: response?.solicitud?.cftea ?? 0,
            precioTotalFinanciado: response?.solicitud?.precioTotalFinanciado ?? 0,
            primerVencimiento: this.formatDate(response?.solicitud?.primerVencimiento),
            ultimoVencimiento: this.formatDate(response?.solicitud?.ultimoVencimiento),
            primeraCuota: response?.solicitud?.primeraCuota ?? 0,
            primeraCuotaEnUvas: response?.solicitud?.primeraCuotaEnUvas ?? 0,
            ultimaCuota: response?.solicitud?.ultimaCuota ?? 0,
            ultimaCuotaEnUvas: response?.solicitud?.ultimaCuotaEnUvas ?? 0,
            uvaAlDIa: response?.solicitud?.uvaAlDIa ?? 0,
            montoInscripcionPrenda: response?.solicitud?.montoInscripcionPrenda ?? 0,
            moneda: response?.solicitud?.moneda ?? '',
            monedaBantotal: response?.solicitud?.monedaBantotal ?? 0,
            periodicidad: response?.solicitud?.periodicidad ?? '',
            cuotaPura: response?.solicitud?.cuotaPura ?? 0,
            tipoTasa: response?.solicitud?.tipoTasa ?? '',
            sistemaAmortizacion: response?.solicitud?.sistemaAmortizacion ?? '',
            esUva: !!response?.solicitud?.esUva,
            fechaAlta: this.formatDate(response?.solicitud?.fechaAlta),
            diasRestantesVigenciaAprobado: response?.solicitud?.diasRestantesVigenciaAprobado ?? 0,
            fechaAutorizacionCredito: response?.solicitud?.fechaAutorizacionCredito ?? ''
          },
          seguro: {
            aseguradora: response?.seguro?.aseguradora ?? '',
            cobertura: response?.seguro?.cobertura ?? '',
            costoMensual: response?.seguro?.costoMensual ?? 0,
            opcionesSeguro: response?.seguro?.opcionesSeguro ?? [],
            idCotizacion: response?.seguro?.idCotizacion ?? '',
            esUva: !!response?.seguro?.esUva,
            esPreprenda: !!response?.seguro?.esPreprenda
          },
          concesionario: {
            id: response?.concesionario?.id ?? 0,
            razonSocial: response?.concesionario?.razonSocial ?? '',
            cuit: response?.concesionario?.cuit ?? '',
            asesorComercial: response?.concesionario?.asesorComercial ?? '',
            codigoSucursalSupervielle: response?.concesionario?.codigoSucursalSupervielle ?? '',
            nombreSucursalSupervielle: response?.concesionario?.nombreSucursalSupervielle ?? '',
            emails: response?.concesionario?.emails ?? [],
            cbu: response?.concesionario?.cbu ?? ''
          },
          cuentas: (response?.cuentas ?? []).map((c: any) => ({
            tipo: c?.tipo ? {
              codigo: c.tipo.codigo ?? '',
              descripcion: c.tipo.descripcion ?? ''
            } : undefined,
            preferida: !!c?.preferida,
            moneda: c?.moneda ? {
              codigo: c.moneda.codigo ?? '',
              descripcion: c.moneda.descripcion ?? '',
              simbolo: c.moneda.simbolo ?? ''
            } : undefined,
            cuenta: c?.cuenta ?? '',
            saldo: c?.saldo ?? undefined,
            idCuentaVista: c?.idCuentaVista ?? undefined,
            cbu: c?.cbu ?? undefined
          })),
          documentos: response?.documentos ?? {
            documentos: [],
            terminosYCondiciones: {
              id: '',
              texto: ''
            }
          }
        };

        return dto;
      }),
      catchError((error) => {
        console.error('Error al obtener detalle de solicitud:', error);
        throw error;
      })
    );
  }

  /**
   * Asigna/actualiza la cuenta de acreditación de una solicitud
   * @param idSolicitud ID de la solicitud (formato: ORIGEN-NUMERO, ej: OBI-12345)
   * @param idCuentaVista ID de la cuenta vista (GUID de 38 caracteres)
   * @returns Observable con el resultado de la operación
   */
  asignarCuentaAcreditacion(
    idSolicitud: string,
    idCuentaVista: string
  ): Observable<AsignarCuentaResponse> {
    const url = `${this.apiUrl}PersonasFisicas/asignarcuenta`;
    
    // Extraer origen del idSolicitud (formato: ORIGEN-NUMERO)
    const origen = this.extraerOrigenDeSolicitud(idSolicitud);
    
    const body: AsignarCuentaRequest = {
      origen,
      idSolicitud,
      idCuentaVista
    };

    return this.http.post<AsignarCuentaResponse>(url, body).pipe(
      map((response) => response || { success: true }),
      catchError((error) => {
        console.error('Error al asignar cuenta de acreditación:', error);
        throw error;
      })
    );
  }

  /**
   * Extrae el origen del id de solicitud
   * @param idSolicitud ID en formato ORIGEN-NUMERO (ej: OBI-12345)
   * @returns El origen (ej: OBI)
   */
  private extraerOrigenDeSolicitud(idSolicitud: string): string {
    if (!idSolicitud) return '';
    const partes = idSolicitud.split('-');
    return partes.length > 0 ? partes[0] : '';
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
