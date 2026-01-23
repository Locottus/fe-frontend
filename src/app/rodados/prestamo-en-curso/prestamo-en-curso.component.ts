import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prestamo-en-curso',
  templateUrl: './prestamo-en-curso.component.html',
  styleUrls: ['./prestamo-en-curso.component.scss']
})
export class PrestamoEnCursoComponent implements OnInit {
  isLoading = false;
  isMobile = false;
  filtroEstado: string | null = null;
  filtroPeriodo: number | null = null;
  cuotaSeleccionada: any = null;
  mostrarDetalleCuota = false;

  // Datos estáticos del préstamo
  prestamo = {
    detallePrestamo: {
      prestamo: {
        operacion: {
          codigo: 78901
        },
        capital: 5000000,
        fecha_vencimiento: '2027-01-15',
        cantidad_cuotas: 36,
        cantidad_cuotas_impagas: 28
      }
    },
    vehiculo: {
      modelo: 'Corolla',
      ceroKm: true,
      anio: 2023
    },
    cuotas: [
      {
        nro_cuota: 1,
        fecha_vencimiento: '2024-02-15',
        importe: 180000,
        estado_descripcion: 'Pagada',
        fecha_pago: '2024-02-14'
      },
      {
        nro_cuota: 2,
        fecha_vencimiento: '2024-03-15',
        importe: 180000,
        estado_descripcion: 'Pagada',
        fecha_pago: '2024-03-13'
      },
      {
        nro_cuota: 3,
        fecha_vencimiento: '2024-04-15',
        importe: 180000,
        estado_descripcion: 'Pagada',
        fecha_pago: '2024-04-14'
      },
      {
        nro_cuota: 4,
        fecha_vencimiento: '2024-05-15',
        importe: 180000,
        estado_descripcion: 'Pagada',
        fecha_pago: '2024-05-15'
      },
      {
        nro_cuota: 5,
        fecha_vencimiento: '2024-06-15',
        importe: 180000,
        estado_descripcion: 'Pagada',
        fecha_pago: null
      },
      {
        nro_cuota: 6,
        fecha_vencimiento: '2024-07-15',
        importe: 180000,
        estado_descripcion: 'Pagada',
        fecha_pago: null
      },
      {
        nro_cuota: 7,
        fecha_vencimiento: '2024-08-15',
        importe: 180000,
        estado_descripcion: 'Pagada',
        fecha_pago: null
      },
      {
        nro_cuota: 8,
        fecha_vencimiento: '2024-09-15',
        importe: 180000,
        estado_descripcion: 'Pagada',
        fecha_pago: null
      },
      {
        nro_cuota: 9,
        fecha_vencimiento: '2026-01-20',
        importe: 200000,
        estado_descripcion: 'Vencida',
        fecha_pago: null
      },
      {
        nro_cuota: 10,
        fecha_vencimiento: '2026-02-15',
        importe: 200000,
        estado_descripcion: 'Pendiente',
        fecha_pago: null
      },
      {
        nro_cuota: 11,
        fecha_vencimiento: '2026-03-15',
        importe: 200000,
        estado_descripcion: 'Pendiente',
        fecha_pago: null
      },
      {
        nro_cuota: 12,
        fecha_vencimiento: '2026-04-15',
        importe: 200000,
        estado_descripcion: 'Pendiente',
        fecha_pago: null
      }
    ]
  };

  cuotasPrestamoFiltradas: any[] = [];

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
    this.aplicarFiltros();
  }

  backAction(): void {
    this.route.navigate(['/rodados/solicitudes']);
  }

  aplicarFiltros(): void {
    let cuotas = [...this.prestamo.cuotas];

    // Filtrar por estado
    if (this.filtroEstado) {
      cuotas = cuotas.filter(c => c.estado_descripcion === this.filtroEstado);
    }

    // Filtrar por período (últimos N días)
    if (this.filtroPeriodo) {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - this.filtroPeriodo);
      
      cuotas = cuotas.filter(c => {
        const fechaVenc = new Date(c.fecha_vencimiento);
        return fechaVenc >= fechaLimite;
      });
    }

    this.cuotasPrestamoFiltradas = cuotas;
  }

  setFiltroEstado(estado: string): void {
    this.filtroEstado = this.filtroEstado === estado ? null : estado;
  }

  setFiltroPeriodo(dias: number): void {
    this.filtroPeriodo = this.filtroPeriodo === dias ? null : dias;
  }

  aplicarFiltrosYCerrar(): void {
    this.aplicarFiltros();
  }

  borrarFiltros(): void {
    this.filtroEstado = null;
    this.filtroPeriodo = null;
    this.aplicarFiltros();
  }

  isSameFilter(value: any, tipo: 'estado' | 'periodo'): boolean {
    if (tipo === 'estado') {
      return this.filtroEstado === value;
    } else {
      return this.filtroPeriodo === value;
    }
  }

  getFilterCount(): number {
    let count = 0;
    if (this.filtroEstado) count++;
    if (this.filtroPeriodo) count++;
    return count;
  }

  getVariant(estado: string): 'error' | 'success' | 'warning' {
    switch (estado) {
      case 'Pagada':
        return 'success';
      case 'Vencida':
        return 'error';
      default:
        return 'warning';
    }
  }

  getBadgeLabel(cuota: any): string | null {
    if (cuota.estado_descripcion === 'Pagada') {
      return null;
    }
    if (cuota.estado_descripcion === 'Vencida') {
      return 'Vencida';
    }
    
    // Calcular días hasta vencimiento para pendientes
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(cuota.fecha_vencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3 && diffDays > 0) {
      return `Vence en ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    }
    
    return null;
  }

  verDetalleCuota(cuota: any): void {
    this.cuotaSeleccionada = cuota;
    this.mostrarDetalleCuota = true;
  }

  cerrarDetalleCuota(): void {
    this.mostrarDetalleCuota = false;
    this.cuotaSeleccionada = null;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR');
  }
}
