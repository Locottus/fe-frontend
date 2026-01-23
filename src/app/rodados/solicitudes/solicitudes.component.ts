import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  title = 'Prestamos Prendarios';
  tienePrestamos = true;
  loading = false;
  isMobile = false;

  // Datos estáticos de solicitudes (Pendiente T&C)
  solicitudes = [
    {
      idSolicitud: '001',
      solicitud: {
        idSolicitudSinOrigen: '12345',
        capital: 3500000,
        plazo: 36,
        tea: 18.5,
        tna: 17.2,
        cftea: 22.1,
        fechaAlta: '2026-01-15',
        esUva: false,
        ultimaCuotaEnUvas: null
      },
      vehiculo: {
        modelo: 'Corolla 2024',
        ceroKm: true,
        anio: 2024,
        marca: 'Toyota'
      },
      seguro: {
        aseguradora: 'Zurich',
        costoMensual: 15000
      },
      estado: 'Pendiente',
      cantCuotas: 36,
      nroOrden: null
    },
    {
      idSolicitud: '002',
      solicitud: {
        idSolicitudSinOrigen: '12346',
        capital: 2800000,
        plazo: 48,
        tea: 19.2,
        tna: 17.9,
        cftea: 23.5,
        fechaAlta: '2026-01-10',
        esUva: true,
        ultimaCuotaEnUvas: 312.45
      },
      vehiculo: {
        modelo: 'Cronos 2023',
        ceroKm: false,
        anio: 2023,
        marca: 'Fiat'
      },
      seguro: {
        aseguradora: 'Galicia Seguros',
        costoMensual: 12000
      },
      estado: 'En Proceso',
      cantCuotas: 48,
      nroOrden: null
    }
  ];

  // Datos estáticos de préstamos (Vigente o Finalizado)
  prestamos = [
    {
      detallePrestamo: {
        prestamo: {
          operacion: { codigo: 78901 },
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
      estado: 'Vigente'
    },
    {
      detallePrestamo: {
        prestamo: {
          operacion: { codigo: 78902 },
          capital: 4200000,
          fecha_vencimiento: '2026-06-20',
          cantidad_cuotas: 24,
          cantidad_cuotas_impagas: 0
        }
      },
      vehiculo: {
        modelo: 'Civic',
        ceroKm: false,
        anio: 2022
      },
      estado: 'Finalizado'
    }
  ];

  solicitudesDetalladas: any[] = [];
  prestamosDetallados: any[] = [];

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.loading = false;
    this.isMobile = window.innerWidth < 768;
  }

  navegar(prestamo?: any) {
    if (!prestamo) {
      return;
    }

    this.loading = true;

    // Navegación según el estado
    if (prestamo.estado === 'Pendiente') {
      this.router.navigate(['rodados/pendiente-tyc']);
    } else if (prestamo.estado === 'Finalizado' || prestamo.estado === 'Vigente') {
      this.router.navigate(['rodados/prestamo-en-curso']);
    } else if (prestamo.estado === 'En Proceso') {
      // Procesando solicitud
      this.loading = false;
    } else {
      this.router.navigate(['/']);
    }
  }

  backAction(): void {
    this.router.navigate(['./']);
  }

  getVariant(estado: string): 'error' | 'info' | 'success' | 'warning' | 'default' {
    switch (estado) {
      case 'Vigente':
      case 'Finalizado':
      case 'Pagada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'En Proceso':
        return 'info';
      case 'Vencida':
      case 'Rechazada':
        return 'error';
      default:
        return 'default';
    }
  }

  abrirLanding() {
    window.open('https://www.supervielle.com.ar/personas/prestamos/prendarios', '_blank', 'noopener');
  }
}
