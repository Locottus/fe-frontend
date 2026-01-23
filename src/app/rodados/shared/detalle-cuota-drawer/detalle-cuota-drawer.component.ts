import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

export interface CuotaDetalleMock {
  nro_cuota: number;
  fecha_vencimiento: string;
  estado_descripcion: string;
  fecha_pago?: string;
  importe: number;
  [key: string]: any;
}

@Component({
  selector: 'app-detalle-cuota-drawer',
  templateUrl: './detalle-cuota-drawer.component.html',
  styleUrls: ['./detalle-cuota-drawer.component.scss'],
})
export class DetalleCuotaDrawerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() cuota: CuotaDetalleMock | null = null;
  @Input() isOpen: boolean = false;

  ngOnInit() {
    console.log('Detalle cuota drawer initialized');
    console.log(this.cuota);
  }

  onClose(): void {
    this.close.emit();
  }

  // Calcula los días hasta el vencimiento
  getDiasHastaVencimiento(fechaVencimiento: string): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Determina el label del badge según el estado y días de vencimiento
  getBadgeLabel(): string {
    if (this.cuota?.estado_descripcion === 'Pagada') {
      return 'Pagada';
    }
    if (this.cuota?.estado_descripcion === 'Vencida') {
      return 'Vencida';
    }
    if (this.cuota?.fecha_vencimiento) {
      const dias = this.getDiasHastaVencimiento(this.cuota.fecha_vencimiento);
      if (dias <= 7 && dias >= 0) {
        if (dias === 0) {
          return 'Vence hoy';
        }
        if (dias === 1) {
          return 'Vence mañana';
        }
        return `Vence en ${dias} días`;
      }
    }
    return 'Pendiente';
  }

  // Determina el variant del badge
  getBadgeVariant(): string {
    if (this.cuota?.estado_descripcion === 'Pagada') {
      return 'success';
    }
    if (this.cuota?.estado_descripcion === 'Vencida') {
      return 'error';
    }
    if (this.cuota?.fecha_vencimiento) {
      const dias = this.getDiasHastaVencimiento(this.cuota.fecha_vencimiento);
      if (dias <= 7 && dias >= 0) {
        return 'warning';
      }
    }
    return 'default';
  }

  // Verifica si la cuota está próxima a vencer (dentro de 7 días)
  isProximaAVencer(): boolean {
    if (this.cuota?.estado_descripcion === 'Pagada' || this.cuota?.estado_descripcion === 'Vencida') {
      return false;
    }
    if (this.cuota?.fecha_vencimiento) {
      const dias = this.getDiasHastaVencimiento(this.cuota.fecha_vencimiento);
      return dias <= 7 && dias > 0;
    }
    return false;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR');
  }
}
