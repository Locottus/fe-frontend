import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pendiente-tyc',
  templateUrl: './pendiente-tyc.component.html',
  styleUrls: ['./pendiente-tyc.component.scss']
})
export class PendienteTycComponent implements OnInit {
  blockearConfirmacion = true;
  openDetalle = false;
  openAyuda = false;
  openCancelarSolicitud = false;
  openDatosIncorrectos = false;
  openSoftToken = false;
  modal: string = '';
  isLoadingDetalle = false;
  isLoadingDocumentos = false;
  isMobile = false;
  isloadingConfirmar = false;
  mostrarCallout = true;
  isVencida = false;
  variantCallout = 'warning';
  titleCallout = 'Tu solicitud vence el 30/01/2026';
  descriptionCallout = 'Si no la confirmás antes de esa fecha deberás solicitar una nueva.';

  // Datos estáticos de la solicitud
  solicitud = {
    id: '001',
    op: '12345',
    solicitud: {
      idSolicitudSinOrigen: '12345',
      fechaAlta: '15/01/2026',
      capital: 5000000,
      plazo: 36,
      tea: 45.5,
      tna: 38.2,
      cftea: 52.3,
      esUva: false,
      ultimaCuotaEnUvas: null,
      diasRestantesVigenciaAprobado: 7
    },
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2023,
      ceroKm: true
    },
    seguro: {
      aseguradora: 'Seguros Rivadavia',
      cobertura: 'Todo Riesgo'
    },
    concesionario: {
      razonSocial: 'Automóviles del Sur S.A.',
      asesorComercial: 'Juan Pérez'
    },
    documentos: [
      { nombre: 'Resumen Productos Y Servicios', url: '#' },
      { nombre: 'Solicitud de Credito Prendario', url: '#' },
      { nombre: 'terminos y condiciones', url: '#' },
      { nombre: 'Anexo seguros', url: '#' }
    ]
  };

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
    this.isLoadingDetalle = false;
    this.isLoadingDocumentos = false;
  }

  backAction(): void {
    this.route.navigate(['/rodados/solicitudes']);
  }

  cambiarEstado(): void {
    this.blockearConfirmacion = !this.blockearConfirmacion;
  }

  confirmar(bloqueado: boolean): void {
    if (bloqueado) return;
    
    this.openSoftToken = true;
  }

  modalOpen(modalName: string, open: boolean): void {
    this.openDetalle = false;
    this.openAyuda = false;
    this.openCancelarSolicitud = false;
    this.openDatosIncorrectos = false;

    if (open) {
      switch (modalName) {
        case 'detalle':
          this.openDetalle = true;
          break;
        case 'ayuda':
          this.openAyuda = true;
          break;
        case 'cancelarSolicitud':
          this.openCancelarSolicitud = true;
          break;
        case 'datosIncorrectos':
          this.openDatosIncorrectos = true;
          break;
      }
    }
  }

  setModal(modalName: string): void {
    this.modal = modalName;
    this.openAyuda = false;
  }

  abrirDocumento(nombreDocumento: string): void {
    console.log('Abriendo documento:', nombreDocumento);
    alert(`Documento "${nombreDocumento}" - Funcionalidad no implementada con datos estáticos`);
  }

  ocultarCallout(): void {
    this.mostrarCallout = false;
  }

  abrirSoftToken(): void {
    this.openSoftToken = true;
  }

  cerrarSoftToken(): void {
    this.openSoftToken = false;
  }

  onSoftTokenVerified(estado: any): void {
    this.cerrarSoftToken();
    alert('Solicitud confirmada exitosamente');
    this.route.navigate(['/rodados/solicitudes']);
  }
}
