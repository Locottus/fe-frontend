import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import { DocumentosService } from '../services/documentos.service';
import { DetalleSolicitudDTO } from '../interfaces/detalle-solicitud.dto';
import { TerminosCondicionesService } from '../services/terminos-y-condiciones.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from 'src/app/shared/models/cliente';
import { EstadosCreditos } from 'src/app/shared/models/estados-creditos';
import * as moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

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
  openTerminosCondiciones = false;
  solicitud: any;
  variantCallout: string;
  titleCallout: string;
  descriptionCallout: string;
  diasDiferencia: number;
  isVencida: boolean;
  op: string;
  modal: string;
  isLoadingDetalle = true;
  isLoadingDocumentos = true;
  isMobile: boolean;
  idPersona = 0;
  cliente: Cliente;
  textoTerminosCondiciones = '';
  isloadingConfirmar = false;
  mostrarCallout = true;
  toasts: any[] = [];

  constructor(
    private route: Router,
    private layoutRemoteService: LayoutRemoteService,
    private activatedRoute: ActivatedRoute,
    public globalService: GlobalService,
    public clienteService: ClienteService,
    private documentosService: DocumentosService,
    private terminosycondicionesService: TerminosCondicionesService,
    private authService: AuthService,
    private analyticsService: AnalyticsService,
  ) {
  }

  ngOnInit(): void {
    this.isMobile = this.authService.getAuthMethod() === 'mobile';
    this.layoutRemoteService.ocultarLayout({ ocultarTodo: true });
    this.cliente = this.clienteService.getClienteSession();
    this.idPersona = Number.parseInt(this.cliente.persona_id, 10);
    this.isLoadingDetalle = true;
    this.isLoadingDocumentos = true;
    this.isloadingConfirmar = false;
    this.mostrarCallout = true;

    if (!this.solicitud?.solicitud) {
      this.getDetallePrimero();
    } else {
      this.setCallout();
      this.getDocumentosEnSegundoPlano();
    }
  }

  getDetallePrimero(): void {
    this.globalService.getSolicitudDetallada().subscribe({
      next: (detalle) => {
        this.solicitud = {
          ...detalle,
          solicitud: {
            ...detalle.solicitud
          }
        };
        this.op = this.solicitud?.id;
        this.setCallout();
        this.isLoadingDetalle = false;
        this.getDocumentosEnSegundoPlano();
      },
      error: () => {
        this.route.navigate(['rodados/solicitud-error']);
      }
    });
  }

  getDocumentosEnSegundoPlano(): void {
    this.isLoadingDocumentos = true;

    if (this.globalService.getExisteDocumentosSolicitudSeleccionada()) {
      this.solicitud.documentos = this.globalService.getDocumentosSolicitudSeleccionada();
      this.isLoadingDocumentos = false;
    } else {
      this.documentosService.getDocumentosSolicitud(this.op, this.idPersona).subscribe({
        next: (documentosResponse) => {
          this.solicitud.documentos = documentosResponse;
          this.globalService.setDocumentosSolicitudSeleccionada(this.solicitud.id, documentosResponse);
          this.isLoadingDocumentos = false;
        },
        error: (error) => {
          console.error('Error al obtener los documentos:', error);
          this.isLoadingDocumentos = false;
        }
      });
    }
  }

  setCallout() {
    if (!this.solicitud || !this.solicitud.solicitud) {
      this.isVencida = false;
      this.variantCallout = 'warning';
      this.titleCallout = 'No se pudo cargar la solicitud';
      this.descriptionCallout = 'Intente nuevamente o contacte a soporte.';
      this.mostrarCallout = true;
      return;
    }

    const diasRestantes = this.solicitud.solicitud.diasRestantesVigenciaAprobado;

    if (diasRestantes === undefined || diasRestantes === null) {
      // Caso especial para undefined/null
      this.isVencida = true;
      this.variantCallout = 'error';
      this.titleCallout = 'Tu solicitud esta vencida';
      this.descriptionCallout = 'Comunicate con la concesionaria para resolver la situación';
      this.mostrarCallout = true;
      return;
    }

    // Solo mostrar el callout si faltan 11 días o menos
    if (diasRestantes > 0 && diasRestantes <= 11) {
      this.isVencida = false;
      this.variantCallout = 'warning';
      const fechaVencimiento = moment().add(diasRestantes, 'days').format('DD/MM/YYYY');
      this.titleCallout = `Tu solicitud vence el ${fechaVencimiento}`;
      this.descriptionCallout = 'Si no la confirmás antes de esa fecha deberás solicitar una nueva.';
      this.mostrarCallout = true;
    } else if (diasRestantes <= 0) {
      this.isVencida = true;
      this.variantCallout = 'error';
      this.titleCallout = 'Tu solicitud esta vencida';
      this.descriptionCallout = 'Comunicate con la concesionaria para resolver la situación';
      this.mostrarCallout = true;
    } else {
      this.variantCallout = '';
      this.titleCallout = '';
      this.descriptionCallout = '';
      this.isVencida = false;
      this.mostrarCallout = false;
    }
  }

  formatDate(date: string | undefined | null): string {
    if (!date || typeof date !== 'string') {
      return '';
    }
    // Si es solo una fecha tipo 'YYYY-MM-DD'
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    }
    // Si es tipo 'YYYY-MM-DDTHH:mm:ss'
    if (/^\d{4}-\d{2}-\d{2}T/.test(date)) {
      const [datePart] = date.split('T');
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    }
    return date;
  }
  
  ocultarCallout(){
    this.mostrarCallout = false;
  }

  backAction() {
     //Analytics: clic en botón Salir
    this.analyticsService.googleAnalyticsClick('button', 'Salir');
    this.route.navigate(['/solicitudes']);
  }

  cambiarEstado() {
    this.blockearConfirmacion = !this.blockearConfirmacion;
  }

  modalOpen(modal: string, value: boolean) {
    switch (modal) {
      case 'detalle':
        this.openDetalle = value;
        break;
      case 'ayuda':
        this.openAyuda = value;

        //Analytics: click en botón "Necesito ayuda"
        this.analyticsService.googleAnalyticsButton('Necesito ayuda', '/necesito-ayuda');

        //Analytics: page_view del modal /necesito-ayuda
        this.analyticsService.googleAnalyticsPage( 'Préstamo Prendario - Necesito ayuda', '/necesito-ayuda' );

        break;
      case 'datosIncorrectos':
        // Analytics: click en botón "Continuar" (dentro del modal necesito-ayuda)
        this.analyticsService.googleAnalyticsButton('Continuar', window.location.pathname + '/necesito-ayuda');
        this.openDatosIncorrectos = value;
        if (value) {
          this.openAyuda = false;
        }
        break;
      case 'cancelarSolicitud':
        // Analytics: click en botón "Continuar" (dentro del modal necesito-ayuda)
        this.analyticsService.googleAnalyticsButton('Continuar', window.location.pathname + '/necesito-ayuda');
        this.openCancelarSolicitud = value;
        if (value) {
          this.openAyuda = false;
        }
        break;
    }
  }

  abrirDocumento(nombreDocumento: string) {
    console.log('=== DEBUG: abrirDocumento inicio ===');
    console.log('nombreDocumento:', nombreDocumento);
    
    // Validar que existan los datos necesarios
    if (!this.solicitud || !this.solicitud.documentos) {
      console.error('No hay solicitud o documentos disponibles');
      this.toasts.push({
        id: Date.now(),
        title: 'Error al abrir documento',
        description: 'No se encontró la información de documentos.',
        variant: 'error'
      });
      return;
    }

    const authMethod = this.authService.getAuthMethod();
    console.log('authMethod:', authMethod);

    if (nombreDocumento.toLowerCase() !== 'terminos y condiciones') {
      const documentos = this.solicitud.documentos.documentos;
      console.log('documentos disponibles:', documentos?.map(d => d.nombre));
      
      if (!documentos || documentos.length === 0) {
        console.error('No hay documentos disponibles');
        this.toasts.push({
          id: Date.now(),
          title: 'Error al abrir documento',
          description: 'No se encontraron documentos disponibles.',
          variant: 'error'
        });
        return;
      }

      const documento = documentos.find((doc) => doc.nombre.toLowerCase() === nombreDocumento.toLowerCase());
      console.log('documento encontrado:', documento?.nombre, 'tiene base64:', !!documento?.base64);
      
      if (!documento) {
        console.error('Documento no encontrado:', nombreDocumento);
        this.toasts.push({
          id: Date.now(),
          title: 'Documento no encontrado',
          description: `No se encontró el documento: ${nombreDocumento}`,
          variant: 'warning'
        });
        return;
      }

      if (!documento.base64) {
        console.error('Documento sin contenido base64:', nombreDocumento);
        this.toasts.push({
          id: Date.now(),
          title: 'Documento sin contenido',
          description: 'El documento no tiene contenido disponible.',
          variant: 'warning'
        });
        return;
      }

      const base64Data = documento.base64.replace(/\s+/g, '');
      console.log('base64Data length:', base64Data.length);

      if (authMethod === 'mobile') {
        console.log('Procesando apertura en móvil');
        console.log('flutter_inappwebview disponible:', !!(window as any).flutter_inappwebview);
        console.log('webkit.messageHandlers disponible:', !!(window as any).webkit?.messageHandlers?.blobToBase64Handler);
        
        let handlerExecuted = false;
        
        // Para Flutter WebView
        if ((window as any).flutter_inappwebview) {
          try {
            console.log('Ejecutando flutter_inappwebview.callHandler');
            (window as any).flutter_inappwebview.callHandler(
              'blobToBase64Handler',
              base64Data
            );
            handlerExecuted = true;
            console.log('Flutter handler ejecutado exitosamente');
            
            // Mostrar toast de éxito
            this.toasts.push({
              id: Date.now(),
              title: 'Abriendo documento',
              description: 'El documento se está abriendo...',
              variant: 'success'
            });
          } catch (error) {
            console.error('Error al ejecutar flutter handler:', error);
          }
        }
        
        // Para iOS WebView
        if (!handlerExecuted && (window as any).webkit?.messageHandlers?.blobToBase64Handler) {
          try {
            console.log('Ejecutando webkit.messageHandlers.blobToBase64Handler');
            (window as any).webkit.messageHandlers.blobToBase64Handler.postMessage([base64Data]);
            handlerExecuted = true;
            console.log('iOS webkit handler ejecutado exitosamente');
            
            // Mostrar toast de éxito
            this.toasts.push({
              id: Date.now(),
              title: 'Abriendo documento',
              description: 'El documento se está abriendo...',
              variant: 'success'
            });
          } catch (error) {
            console.error('Error al ejecutar webkit handler:', error);
          }
        }
        
        if (!handlerExecuted) {
          console.error('Ningún handler móvil disponible');
          this.toasts.push({
            id: Date.now(),
            title: 'No se pudo descargar el documento',
            description: 'La descarga no está soportada en este dispositivo o la aplicación no está actualizada.',
            variant: 'warning'
          });
        }
      } else {
        console.log('Procesando apertura en desktop');
        try {
          // Desktop: descarga normal
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
          console.log('Documento abierto en desktop exitosamente');
        } catch (error) {
          console.error('Error al abrir documento en desktop:', error);
          this.toasts.push({
            id: Date.now(),
            title: 'Error al abrir documento',
            description: 'No se pudo procesar el documento.',
            variant: 'error'
          });
        }
      }
    } else {
      console.log('Abriendo términos y condiciones');
      if (!this.solicitud.documentos.terminosYCondiciones) {
        console.error('No hay términos y condiciones disponibles');
        this.toasts.push({
          id: Date.now(),
          title: 'Error al abrir términos',
          description: 'No se encontraron los términos y condiciones.',
          variant: 'warning'
        });
        return;
      }
      
      this.textoTerminosCondiciones = this.solicitud.documentos.terminosYCondiciones?.texto || 'No hay términos y condiciones disponibles.';
      this.openTerminosCondiciones = true;
      console.log('Modal de términos y condiciones abierto');
    }
    
    console.log('=== DEBUG: abrirDocumento fin ===');
  }

  toggleTerminosCondiciones(value: boolean) {
    this.openTerminosCondiciones = value;
  }

  confirmar(bloquear: boolean) {
    //Analytics: click en Confirmar
    this.analyticsService.googleAnalyticsClick('button', 'Confirmar');

    if (bloquear) {
      return;
    }
    this.isloadingConfirmar = true;
    this.blockearConfirmacion = true;

    const documentos = this.solicitud.documentos.documentos;
    const idTerminosCondiciones = this.solicitud.documentos.terminosYCondiciones.id;

    this.terminosycondicionesService.aceptarTyC(this.idPersona, this.solicitud.id, documentos, idTerminosCondiciones).subscribe({
      next: (response) => {
        if (response) {
          this.actualizarEstadoCabecera();
          this.route.navigate(['rodados/aceptacion-tyc']);
        } else {
          console.warn('Respuesta inesperada al aceptar TyC:');
        }
      },
      error: (error) => {
        console.error('Error al aceptar TyC: ');
      }
    });
  }

  actualizarEstadoCabecera(): void {
    const creditos = this.globalService.getCreditos();
    const credito = creditos.find((c) => c.idSolicitud === this.solicitud.id);
    const indice = creditos.findIndex((c) => c.idSolicitud === credito.idSolicitud);

    credito.estado = EstadosCreditos.EnProceso;
    creditos[indice] = credito;
    this.globalService.setCreditos(creditos);
  }

  reportarError() {
    this.terminosycondicionesService.reportarErrorTyc(this.solicitud).subscribe({
      next: () => {},
      error: (error) => {
        console.error('Error no se pudo reportar el error: ', error);
      }
    });
    this.modalOpen('datosIncorrectos', false);
  }

  cancelarSolicitud() {
    this.terminosycondicionesService.reportarErrorTyc(this.solicitud).subscribe({
      next: () => {
        this.toasts.push({
          id: Date.now(),
          title: 'Cancelaste tu solicitud',
          description: 'Si querés iniciar un nuevo proceso, contactá a la concesionaria',
          variant: 'success'
        });
      },
      error: () => {
        this.toasts.push({
          id: Date.now(),
          title: 'No pudimos cancelar tu solicitud',
          description: 'Por favor, volvé a intentarlo mas tarde.',
          variant: 'warning'
        });
      }
    });
    this.openCancelarSolicitud = false;
  }

  setModal(modal: string) {
    this.modal = modal;
    console.log(modal);

    if (modal === 'datosIncorrectos') {
      this.analyticsService.googleAnalyticsButton( 'Los datos de la solicitud son incorrectos','/necesito-ayuda');
    }

    if (modal === 'cancelarSolicitud') {
      this.analyticsService.googleAnalyticsButton('Ya no me interesa continuar con la solicitud','/necesito-ayuda');
    }
  }


  filterTruthy(arr: any[]): any[] {
    return arr.filter((v) => !!v);
  }
}
