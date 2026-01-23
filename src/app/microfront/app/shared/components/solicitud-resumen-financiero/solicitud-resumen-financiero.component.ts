import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Cuenta } from '../seleccionar-cuenta-drawer/seleccionar-cuenta-drawer.component';
import { DetalleSolicitudService } from 'src/app/modules/rodados/services/detalle-solicitud.service';
import { CuentaSeleccionDto } from 'src/app/modules/rodados/interfaces/detalle-solicitud.dto';

@Component({
  selector: 'app-solicitud-resumen-financiero',
  templateUrl: './solicitud-resumen-financiero.component.html',
  styleUrls: ['./solicitud-resumen-financiero.component.scss']
})
export class SolicitudResumenFinancieroComponent implements OnInit, OnChanges {
  @Input() solicitud: any;
  
  /** Lista de cuentas disponibles para seleccionar (override manual) */
  @Input() cuentasDisponibles: Cuenta[] = [];
  
  /** Emite cuando se modifica la cuenta seleccionada */
  @Output() cuentaCambiada = new EventEmitter<Cuenta>();

  /** Controla si el drawer de selección de cuenta está abierto */
  isDrawerOpen: boolean = false;

  /** Cuenta seleccionada actualmente */
  cuentaSeleccionadaActual: Cuenta | null = null;

  /** Cuentas mapeadas desde la solicitud */
  private cuentasDeSolicitud: Cuenta[] = [];

  /** Indica si se está actualizando la cuenta */
  isUpdatingCuenta: boolean = false;

  /** Mensaje de error al actualizar cuenta */
  errorActualizarCuenta: string | null = null;

  constructor(
    private detalleSolicitudService: DetalleSolicitudService
  ) {}

  ngOnInit(): void {
    console.log('[SOLICITUD DTO COMPLETO] Objeto recibido por @Input solicitud en ngOnInit:', JSON.stringify(this.solicitud, null, 2));
    this.cargarCuentasDeSolicitud();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia la solicitud, actualizar las cuentas
    if (changes['solicitud'] && !changes['solicitud'].firstChange) {
      this.cargarCuentasDeSolicitud();
    }
  }

  /** Carga las cuentas desde la solicitud (ya vienen en el DTO) */
  private cargarCuentasDeSolicitud(): void {
    if (this.solicitud?.cuentas && Array.isArray(this.solicitud.cuentas)) {
      this.cuentasDeSolicitud = this.mapCuentasFromSolicitud(this.solicitud.cuentas);
      
      // Seleccionar la cuenta preferida o la primera disponible
      if (this.cuentasDeSolicitud.length > 0 && !this.cuentaSeleccionadaActual) {
        const cuentaPreferida = this.cuentasDeSolicitud.find(c => c.preferida === true) 
          || this.cuentasDeSolicitud[0];
        this.cuentaSeleccionadaActual = cuentaPreferida;
      }
    }
  }

  /** Mapea las cuentas del DTO de solicitud al formato Cuenta */
  private mapCuentasFromSolicitud(cuentas: CuentaSeleccionDto[]): Cuenta[] {
    return cuentas.map((c, index) => ({
      id: c.cuenta || `cuenta-${index}`,
      cuenta: c.cuenta, // número de cuenta
      saldo: c.saldo ? parseFloat(c.saldo) : 0,
      preferida: c.preferida,
      idCuentaVista: c.idCuentaVista,
      descripcion: `${c.tipo?.codigo || ''} ${c.moneda?.codigo || ''}`.trim(),
      moneda: c.moneda, // objeto completo
      tipo: c.tipo     // objeto completo
    }));
  }

  /** ID de la cuenta actualmente seleccionada */
  get cuentaSeleccionadaId(): string | null {
    return this.cuentaSeleccionadaActual?.id || this.cuentasParaMostrar[0]?.id || null;
  }

  /** Lista de cuentas a mostrar (prioriza Input manual, luego las de la solicitud) */
  get cuentasParaMostrar(): Cuenta[] {
    if (this.cuentasDisponibles.length > 0) {
      return this.cuentasDisponibles;
    }
    return this.cuentasDeSolicitud;
  }
  /** Devuelve la cuenta seleccionada actual o la primera disponible */
  get cuentaSeleccionada(): Cuenta | null {
    return this.cuentaSeleccionadaActual || this.cuentasParaMostrar[0] || null;
  }

  /** Descripción de la cuenta seleccionada para mostrar (usada en tests y UI) */
  get cuentaSeleccionadaDescripcion(): string {
    const cuenta = this.cuentaSeleccionada;
    if (!cuenta) return 'Sin cuenta asignada';
    // Si la cuenta tiene descripcion, usarla
    if (cuenta.descripcion) {
      return cuenta.descripcion;
    }
    // Fallback: usar datos de la cuenta seleccionada primero
    const codigo = (cuenta as any).tipo?.codigo || (cuenta.moneda ?? '');
    const descripcion = cuenta.moneda ?? '';
    const cuentaNum = (cuenta as any).idCuentaVista || cuenta.id || '';
    // Si no hay datos suficientes, buscar en el DTO original
    if (!codigo || !descripcion || !cuentaNum) {
      const cuentaOriginal = (this.solicitud?.cuentas || []).find((c: any) => c.cuenta === cuenta.id);
      const codigoOrig = cuentaOriginal?.tipo?.codigo || '';
      const descripcionOrig = cuentaOriginal?.moneda?.codigo || '';
      const cuentaNumOrig = cuentaOriginal?.idCuentaVista || cuentaOriginal?.cuenta || cuenta.id || '';
      return `${codigoOrig} ${descripcionOrig} ${cuentaNumOrig}`.trim();
    }
    return `${codigo} ${descripcion} ${cuentaNum}`.trim();
  }

  onModificarCuenta(): void {
    console.log('=== DEBUG: Abriendo drawer de cuentas ===');
    const objetoDrawer = {
      isOpen: this.isDrawerOpen,
      cuentas: this.cuentasParaMostrar,
      cuentaSeleccionadaId: this.cuentaSeleccionadaId
    };
    console.log('Objeto enviado a <app-seleccionar-cuenta-drawer>:', objetoDrawer);
    // Mostrar el objeto completo en formato JSON
    console.log('Objeto completo enviado a <app-seleccionar-cuenta-drawer> (JSON):', JSON.stringify(objetoDrawer, null, 2));
    console.log('Cuentas a enviar al drawer:', this.cuentasParaMostrar);
    console.log('Cuenta seleccionada actual:', this.cuentaSeleccionadaActual);
    console.log('Solicitud completa:', this.solicitud);
    this.isDrawerOpen = true;
  }

  onDrawerClose(): void {
    console.log('=== DEBUG: Cerrando drawer sin cambios ===');
    console.log('Cuenta seleccionada (sin modificar):', this.cuentaSeleccionadaActual);
    this.isDrawerOpen = false;
  }

  onCuentaModificada(cuenta: Cuenta): void {
    console.log('=== DEBUG: Cuenta modificada por el cliente ===');
    console.log('Nueva cuenta seleccionada:', cuenta);
    console.log('Cuenta anterior:', this.cuentaSeleccionadaActual);

    /*----------------------------------------------------- */
    //esto esta solo mientras hago debug.
          this.cuentaSeleccionadaActual = cuenta;
          this.cuentaCambiada.emit(cuenta);
          this.isDrawerOpen = false;
          this.isUpdatingCuenta = false;

    //descomentar cuando este confirmado api endpoint y crear el metodo.
    //this.actualizarCuentaEnBackend(cuenta);
  }

  /**
   * Asigna/actualiza la cuenta de acreditación en el backend usando POST
   * COMENTADO TEMPORALMENTE - Ajustes de UI en progreso
   */
  /*
  private actualizarCuentaEnBackend(cuenta: Cuenta): void {
    const idSolicitud = this.solicitud?.id;

    if (!idSolicitud) {
      console.error('No se puede actualizar: falta idSolicitud');
      this.errorActualizarCuenta = 'No se pudo actualizar la cuenta. Intente nuevamente.';
      return;
    }

    if (!cuenta.idCuentaVista) {
      console.error('No se puede actualizar: falta idCuentaVista en la cuenta seleccionada');
      this.errorActualizarCuenta = 'No se pudo actualizar la cuenta. Intente nuevamente.';
      return;
    }

    this.isUpdatingCuenta = true;
    this.errorActualizarCuenta = null;

    this.detalleSolicitudService
      .asignarCuentaAcreditacion(idSolicitud, cuenta.idCuentaVista)
      .subscribe({
        next: () => {
          // Actualizar la lista de cuentas: quitar preferida de las demás y marcar la seleccionada
          this.cuentasDeSolicitud = this.cuentasDeSolicitud.map(c => ({
            ...c,
            preferida: c.id === cuenta.id
          }));
          
          this.cuentaSeleccionadaActual = cuenta;
          this.cuentaCambiada.emit(cuenta);
          this.isDrawerOpen = false;
          this.isUpdatingCuenta = false;
        },
        error: (error) => {
          console.error('Error al asignar cuenta:', error);
          this.errorActualizarCuenta = 'Error al actualizar la cuenta. Intente nuevamente.';
          this.isUpdatingCuenta = false;
        }
      });
  }
  */

    /** Mapea la descripción de moneda a código */
  mapMonedaDescripcion(descripcion: string | undefined): string {
    if (!descripcion) return '';
    if (descripcion === 'Pesos Argentinos') return 'ARS';
    return descripcion;
  }

  displayDate(value: string | undefined | null): string {
    if (!value) { return ''; }
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
      const [datePart] = value.split('T');
      const [y,m,d] = datePart.split('-');
      return `${d}/${m}/${y}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y,m,d] = value.split('-');
      return `${d}/${m}/${y}`;
    }
    return value; // already formatted or unexpected format
  }
}
