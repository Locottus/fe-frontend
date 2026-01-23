import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MonedaApiDto, TipoApiDto } from 'src/app/modules/rodados/interfaces/detalle-solicitud.dto';

export interface Cuenta {
  id: string;
  cuenta?: string;
  descripcion: string;
  saldo: number;
  moneda?: string | MonedaApiDto;
  tipo?: TipoApiDto;
  preferida?: boolean;
  idCuentaVista?: string;
}

@Component({
  selector: 'app-seleccionar-cuenta-drawer',
  templateUrl: './seleccionar-cuenta-drawer.component.html',
  styleUrls: ['./seleccionar-cuenta-drawer.component.scss'],
})
export class SeleccionarCuentaDrawerComponent implements OnInit, OnChanges {
  /** Controla si el drawer está abierto */
  @Input() isOpen: boolean = false;
  
  /** Lista de cuentas disponibles para seleccionar */
  @Input() cuentas: Cuenta[] = [];
  
  /** Cuenta actualmente seleccionada (por defecto) */
  @Input() cuentaSeleccionadaId: string | null = null;

  /** Emite cuando se cierra el drawer */
  @Output() close = new EventEmitter<void>();
  
  /** Emite la cuenta seleccionada cuando se confirma la modificación */
  @Output() cuentaModificada = new EventEmitter<Cuenta>();

  /** Cuenta temporalmente seleccionada en el drawer (antes de confirmar) */
  cuentaSeleccionadaTemp: string | null = null;

  /** Indica si la selección fue automática (sin favorito previo) */
  seleccionAutomatica: boolean = false;

  //constructor() { }

  ngOnInit(): void {
    this.inicializarCuentaSeleccionada();
  }

  /**
   * Inicializa la cuenta seleccionada.
   * Prioridad: 1) cuenta favorita, 2) primera con saldo positivo, 3) primera de la lista.
   */
  private inicializarCuentaSeleccionada(): void {
    if (this.cuentaSeleccionadaId) {
      this.cuentaSeleccionadaTemp = this.cuentaSeleccionadaId;
      this.seleccionAutomatica = false;
    } else {
      // Buscar la primera cuenta con saldo positivo
      const primeraConSaldo = this.cuentas.find(cuenta => cuenta.saldo > 0);
      if (primeraConSaldo) {
        this.cuentaSeleccionadaTemp = primeraConSaldo.id;
        this.seleccionAutomatica = true;
      } else if (this.cuentas.length > 0) {
        // Si no hay cuenta con saldo, seleccionar la primera de la lista
        this.cuentaSeleccionadaTemp = this.cuentas[0].id;
        this.seleccionAutomatica = true;
      } else {
        this.cuentaSeleccionadaTemp = null;
        this.seleccionAutomatica = false;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Sincronizar selección temporal cuando cambia la cuenta seleccionada externamente
    if (changes['cuentaSeleccionadaId'] && !changes['cuentaSeleccionadaId'].firstChange) {
      this.cuentaSeleccionadaTemp = this.cuentaSeleccionadaId;
    }
    // Reset temporal selection when drawer opens
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.cuentaSeleccionadaTemp = this.cuentaSeleccionadaId;
    }
  }

  /**
   * Cierra el drawer sin guardar cambios
   */
  onClose(): void {
    this.cuentaSeleccionadaTemp = this.cuentaSeleccionadaId; // Reset to original
    this.close.emit();
  }

  /**
   * Selecciona temporalmente una cuenta
   */
  seleccionarCuenta(cuenta: Cuenta): void {
    this.cuentaSeleccionadaTemp = cuenta.id;
  }

  /**
   * Verifica si una cuenta está seleccionada temporalmente
   */
  esCuentaSeleccionada(cuenta: Cuenta): boolean {
    return this.cuentaSeleccionadaTemp === cuenta.id;
  }

  /**
   * Verifica si se puede modificar (hay una selección diferente a la original o fue selección automática)
   */
  puedeModificar(): boolean {
    return this.cuentaSeleccionadaTemp !== null && 
           (this.seleccionAutomatica || this.cuentaSeleccionadaTemp !== this.cuentaSeleccionadaId);
  }

  /**
   * Confirma la modificación y emite la cuenta seleccionada
   */
  confirmarModificacion(): void {
    if (this.puedeModificar()) {
      const cuentaSeleccionada = this.cuentas.find(c => c.id === this.cuentaSeleccionadaTemp);
      if (cuentaSeleccionada) {
        // Marcar la cuenta seleccionada como preferida
        const cuentaConPreferida: Cuenta = { ...cuentaSeleccionada, preferida: true };
        this.cuentaModificada.emit(cuentaConPreferida);
        this.close.emit();
      }
    }
  }

  /**
   * Formatea el saldo para mostrar
   */
  formatearSaldo(saldo: number): string {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(saldo);
  }

  /** Mapea la descripción de moneda a código */
  mapMonedaDescripcion(descripcion: string | undefined): string {
    if (!descripcion) return '';
    if (descripcion === 'Pesos Argentinos') return 'ARS';
    return descripcion;
  }
    
}
