import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CuotaDetalle } from '../interfaces/detalle-prestamo.dto';

@Component({
  selector: 'app-detalle-cuota-drawer',
  templateUrl: './detalle-cuota-drawer.component.html',
  styleUrls: ['./detalle-cuota-drawer.component.scss'],
})
export class DetalleCuotaDrawerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() cuota: CuotaDetalle | null = null;
  @Input() isOpen: boolean = false;

  //constructor() { }

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
      return dias <= 7 && dias >= 0;
    }
    return false;
  }

  // Verifica si la cuota está pendiente (más de 7 días para vencer)
  isPendiente(): boolean {
    if (this.cuota?.estado_descripcion === 'Pagada' || this.cuota?.estado_descripcion === 'Vencida') {
      return false;
    }
    if (this.cuota?.fecha_vencimiento) {
      const dias = this.getDiasHastaVencimiento(this.cuota.fecha_vencimiento);
      return dias > 7;
    }
    return false;
  }

  // Verifica si el préstamo es en UVA
  isUVA(): boolean {
    return !!(this.cuota?.uva?.total && this.cuota.uva.total > 0);
  }

  // Obtiene el mensaje de alerta según si es UVA o pesos
  getMensajePendiente(): string {
    if (this.isUVA()) {
      return 'Se debitará el día del vencimiento. El importe en pesos puede variar según la cotización UVA de ese día y la actualización del valor del seguro.';
    }
    return 'Se debitará el día del vencimiento. El importe en pesos puede variar según la actualización del valor del seguro.';
  }
}
