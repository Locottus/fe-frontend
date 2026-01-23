import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

export interface Cuenta {
  id: string;
  cuenta: string;
  saldo?: number;
  preferida?: boolean;
  idCuentaVista?: string;
  descripcion?: string;
  moneda?: any;
  tipo?: any;
}

@Component({
  selector: 'app-solicitud-resumen-financiero',
  templateUrl: './solicitud-resumen-financiero.component.html',
  styleUrls: ['./solicitud-resumen-financiero.component.scss']
})
export class SolicitudResumenFinancieroComponent implements OnInit, OnChanges {
  @Input() solicitud: any;
  @Input() cuentasDisponibles: Cuenta[] = [];
  @Output() cuentaCambiada = new EventEmitter<Cuenta>();

  isDrawerOpen = false;
  cuentaSeleccionadaActual: Cuenta | null = null;
  private cuentasDeSolicitud: Cuenta[] = [];

  ngOnInit(): void {
    this.cargarCuentasDeSolicitud();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['solicitud'] && !changes['solicitud'].firstChange) {
      this.cargarCuentasDeSolicitud();
    }
  }

  private cargarCuentasDeSolicitud(): void {
    if (!this.cuentasDeSolicitud.length) {
      this.cuentasDeSolicitud = [
        {
          id: 'cc-pesos-12345',
          cuenta: '0001234567',
          preferida: true,
          idCuentaVista: 'cc-pesos-12345',
          descripcion: 'Cuenta Corriente ARS 0001234567',
          moneda: { codigo: 'ARS', descripcion: 'Pesos Argentinos' },
          tipo: { codigo: 'CC' }
        },
        {
          id: 'cc-usd-98765',
          cuenta: '0009876543',
          preferida: false,
          idCuentaVista: 'cc-usd-98765',
          descripcion: 'Cuenta Corriente USD 0009876543',
          moneda: { codigo: 'USD', descripcion: 'Dólares' },
          tipo: { codigo: 'CC' }
        }
      ];
    }
    if (!this.cuentaSeleccionadaActual) {
      const cuentaPreferida = this.cuentasDeSolicitud.find(c => c.preferida) || this.cuentasDeSolicitud[0];
      this.cuentaSeleccionadaActual = cuentaPreferida;
    }
  }

  get cuentaSeleccionadaId(): string | null {
    return this.cuentaSeleccionadaActual?.id || this.cuentasParaMostrar[0]?.id || null;
  }

  get cuentasParaMostrar(): Cuenta[] {
    if (this.cuentasDisponibles.length > 0) {
      return this.cuentasDisponibles;
    }
    return this.cuentasDeSolicitud;
  }

  get cuentaSeleccionada(): Cuenta | null {
    return this.cuentaSeleccionadaActual || this.cuentasParaMostrar[0] || null;
  }

  onModificarCuenta(): void {
    this.isDrawerOpen = true;
  }

  onDrawerClose(): void {
    this.isDrawerOpen = false;
  }

  onCuentaModificada(cuenta: Cuenta): void {
    this.cuentaSeleccionadaActual = cuenta;
    this.cuentaCambiada.emit(cuenta);
    this.isDrawerOpen = false;
  }

  mapMonedaDescripcion(descripcion: string | undefined): string {
    if (!descripcion) return '';
    if (descripcion === 'Pesos Argentinos') return 'ARS';
    if (descripcion === 'Dólares') return 'USD';
    return descripcion;
  }
}
