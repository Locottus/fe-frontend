import { Component, OnInit } from '@angular/core';

interface Moneda {
  capital: number;
  interes: number;
  impuestos: number;
  seguro: number;
  comisiones: number;
  recargo: number;
  total: number;
}

interface UVA {
  capital: number;
  interes: number;
  impuestos: number;
  seguro: number;
  comisiones: number;
  recargo: number;
  total: number;
}

interface Cuota {
  numero: number;
  fecha_vencimiento: string;
  estado: string;
  estado_descripcion: string;
  fecha_pago: string;
  moneda: Moneda;
  uva: UVA;
}

interface Vehiculo {
  anio: number;
  marca: string;
  modelo: string;
  uso: string;
  ceroKm: boolean;
}

interface SolicitudResumenFinanciero {
  id: string;
  estado: string;
  plazo: number;
  capital: number;
  saldo_capital: number;
  tna: number;
  cantidad_cuotas: number;
  cuotas_pagas: number;
  vehiculo: Vehiculo;
  cuotas: Cuota[];
}

@Component({
  selector: 'app-design-showcase',
  standalone: false,
  templateUrl: './design-showcase.component.html',
  styleUrls: ['./design-showcase.component.scss'],
})
export class DesignShowcaseComponent implements OnInit {
  title = 'Design Showcase';

  // Modal states
  isOpenDetalleCuota = false;
  cuotaSeleccionada: Cuota | null = null;

  // Main data
  solicitud: SolicitudResumenFinanciero;
  proximoCuota: Cuota | null = null;

  // Form controls
  inputValue: string = 'Valor de ejemplo';
  selectValue: string = 'option1';
  checkboxValue: boolean = false;
  radioValue: string = 'radio1';
  textareaValue: string = 'Área de texto de ejemplo';

  constructor() {
    this.solicitud = this.generateDummySolicitud();
  }

  ngOnInit(): void {
    this.proximoCuota = this.solicitud.cuotas[0] || null;
  }

  // Generate dummy data based on rodados structure
  private generateDummySolicitud(): SolicitudResumenFinanciero {
    const cuotas = this.generateDummyCuotas();

    return {
      id: 'SOL-2026-001234',
      estado: 'Vigente',
      plazo: 60,
      capital: 350000,
      saldo_capital: 245000,
      tna: 18.5,
      cantidad_cuotas: 60,
      cuotas_pagas: 15,
      vehiculo: {
        anio: 2023,
        marca: 'Toyota',
        modelo: 'Corolla Sedan',
        uso: 'Particular',
        ceroKm: false,
      },
      cuotas,
    };
  }

  private generateDummyCuotas(): Cuota[] {
    const cuotas: Cuota[] = [];
    const today = new Date();

    for (let i = 1; i <= 15; i++) {
      const vencimiento = new Date(today);
      vencimiento.setMonth(vencimiento.getMonth() + i);

      let estado = 'Pendiente';
      let estado_descripcion = 'Pendiente';

      if (i <= 5) {
        estado = 'Pagada';
        estado_descripcion = 'Pagada';
      } else if (i === 6) {
        estado = 'Vencida';
        estado_descripcion = 'Vencida';
      }

      const montoBase = 6200 + i * 50;

      cuotas.push({
        numero: i,
        fecha_vencimiento: vencimiento.toISOString(),
        estado,
        estado_descripcion,
        fecha_pago: i <= 5 ? vencimiento.toISOString() : '',
        moneda: {
          capital: 5500,
          interes: 450,
          impuestos: 180,
          seguro: 70,
          comisiones: 0,
          recargo: estado_descripcion === 'Vencida' ? 150 : 0,
          total: montoBase,
        },
        uva: {
          capital: 250.5,
          interes: 20.25,
          impuestos: 8.12,
          seguro: 3.25,
          comisiones: 0,
          recargo: estado_descripcion === 'Vencida' ? 7.5 : 0,
          total: 289.62,
        },
      });
    }

    return cuotas;
  }

  // Modal methods
  openDetalleCuota(cuota: Cuota): void {
    this.cuotaSeleccionada = cuota;
    this.isOpenDetalleCuota = true;
  }

  closeDetalleCuota(): void {
    this.isOpenDetalleCuota = false;
    this.cuotaSeleccionada = null;
  }

  // Helper methods for badges and labels
  getBadgeVariant(cuota: Cuota | null | undefined): string {
    if (!cuota) return 'default';

    if (cuota.estado_descripcion === 'Pagada') {
      return 'success';
    }
    if (cuota.estado_descripcion === 'Vencida') {
      return 'error';
    }

    const dias = this.getDiasHastaVencimiento(cuota.fecha_vencimiento);
    if (dias <= 7 && dias >= 0) {
      return 'warning';
    }

    return 'default';
  }

  getBadgeLabel(cuota: Cuota | null | undefined): string {
    if (!cuota) return 'N/A';

    if (cuota.estado_descripcion === 'Pagada') {
      return 'Pagada';
    }
    if (cuota.estado_descripcion === 'Vencida') {
      return 'Vencida';
    }

    const dias = this.getDiasHastaVencimiento(cuota.fecha_vencimiento);
    if (dias <= 7 && dias >= 0) {
      if (dias === 0) return 'Vence hoy';
      if (dias === 1) return 'Vence mañana';
      return `Vence en ${dias} días`;
    }

    return 'Pendiente';
  }

  isProximaAVencer(cuota: Cuota | null | undefined): boolean {
    if (
      !cuota ||
      cuota.estado_descripcion === 'Pagada' ||
      cuota.estado_descripcion === 'Vencida'
    ) {
      return false;
    }
    const dias = this.getDiasHastaVencimiento(cuota.fecha_vencimiento);
    return dias <= 7 && dias >= 0;
  }

  isPendiente(cuota: Cuota | null | undefined): boolean {
    if (
      !cuota ||
      cuota.estado_descripcion === 'Pagada' ||
      cuota.estado_descripcion === 'Vencida'
    ) {
      return false;
    }
    const dias = this.getDiasHastaVencimiento(cuota.fecha_vencimiento);
    return dias > 7;
  }

  getMensajePendiente(cuota: Cuota | null | undefined): string {
    if (!cuota) return '';

    const esuva = cuota.uva && cuota.uva.total > 0;
    if (esuva) {
      return 'Se debitará el día del vencimiento. El importe en pesos puede variar según la cotización UVA de ese día y la actualización del valor del seguro.';
    }
    return 'Se debitará el día del vencimiento. El importe en pesos puede variar según la actualización del valor del seguro.';
  }

  private getDiasHastaVencimiento(fechaVencimiento: string): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Control handlers
  onInputChange(value: string): void {
    console.log('Input changed:', value);
    this.inputValue = value;
  }

  onSelectChange(value: string): void {
    console.log('Select changed:', value);
    this.selectValue = value;
  }

  onCheckboxChange(checked: boolean): void {
    console.log('Checkbox changed:', checked);
    this.checkboxValue = checked;
  }

  onRadioChange(value: string): void {
    console.log('Radio changed:', value);
    this.radioValue = value;
  }

  onTextareaChange(value: string): void {
    console.log('Textarea changed:', value);
    this.textareaValue = value;
  }

  onButtonClick(buttonName: string): void {
    console.log('Button clicked:', buttonName);
    alert(`Botón "${buttonName}" presionado`);
  }
}
