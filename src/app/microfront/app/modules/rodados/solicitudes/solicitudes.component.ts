import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreditosService } from '../services/creditos.service';
import { GlobalService as GlobalService } from 'src/app/shared/services/global.service';
import { CreditoData } from '../interfaces/lista-credito.dto';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from 'src/app/shared/models/cliente';
import { AuthService } from 'src/app/core/services/auth.service';
import { Auth } from 'src/app/shared/models/auth';
import { EstadosCreditos } from 'src/app/shared/models/estados-creditos';
import { of } from 'rxjs';
import { CreditosDetalleService } from 'src/app/shared/services/creditos-detalle.service';
import { map } from 'rxjs/operators';
import { formatDate, formatDetalleSolicitud, getVariant } from 'src/app/shared/utils/creditos-utils';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  title = 'Prestamos Prendarios';
  tienePrestamos: boolean;
  userID: number;
  prestamos: CreditoData[] = [];
  contratos: CreditoData[];
  solicitudes: CreditoData[];
  solicitudesDetalladas: any[];
  prestamosDetallados: any[];
  todos: any[];
  loading = true;
  cliente: Cliente;
  auth: Auth;
  isMobile: boolean;

  constructor(
    public router: Router,
    public creditosService: CreditosService,
    public globalService: GlobalService,
    public clienteService: ClienteService,
    public authService: AuthService,
  private creditosDetalleService: CreditosDetalleService,
    private layoutRemoteService: LayoutRemoteService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.isMobile = this.authService.getAuthMethod() === 'mobile';
    this.layoutRemoteService.ocultarLayout({ ocultarTodo: false });
    if ((this.globalService.getIdPersona() != undefined) || (this.globalService.getIdPersona() != null)){
      this.userID = Number.parseInt(this.globalService.getIdPersona(), 10);
    } else {
      this.cliente = this.clienteService.getClienteSession();
      this.userID = Number.parseInt(this.cliente.persona_id, 10);
    }
    this.obtenerCreditos();

    const headerEvent = new CustomEvent('customizeHeaderEvent', {
      detail: {
        title: 'Préstamos Prendarios',
        showCloseButton: false,
        showBackButton: false,
        hideLogo: false,
        actionBackButton: null,
        actionCloseButton: null
      }
    });

    window.dispatchEvent(headerEvent);
  }

  obtenerCreditos(): void {
    if (!this.globalService.getExisteCreditos()) {
      const idPersona = Number.parseInt(this.cliente.persona_id, 10);

      this.creditosService.getPrestamosYSolicitudes(idPersona).subscribe({
        next: ({ prestamos, solicitudes, todos }) => {
          this.prestamos = prestamos;
          this.solicitudes = solicitudes;
          this.tienePrestamos = todos.length > 0;
          this.globalService.setCreditos(todos);
          this.globalService.setCabeceraSolicitudes(solicitudes);
          this.globalService.setCabeceraPrestamos(prestamos);
          this.getDetalles$().subscribe(() => {
            if (solicitudes?.length > 0 && this.globalService.getFirstSignIn()) {
              this.globalService.setFirstSignIn(false);
              this.navegar(solicitudes[0]);
            } else {
              this.loading = false;
            }
          });
        },
        error: (error) => {
          console.error('Error al obtener los créditos:', error);
          this.tienePrestamos = false;
          this.loading = false;
        }
      });
    } else {
      this.contratos = this.globalService.getCreditos();
      this.solicitudes = this.globalService.getCabeceraSolicitudes();
      this.prestamos = this.globalService.getCabeceraPrestamos();
      this.getDetalles$().subscribe(() => {
        if (this.solicitudes?.length > 0 && this.globalService.getFirstSignIn()) {
          this.globalService.setSolicitudSelected(this.solicitudes[0].idSolicitud);
          this.navegar(this.solicitudes[0]);
        } else {
          this.loading = false;
          this.tienePrestamos = this.contratos.length > 0;
        }
      });
    }
  }

  clickPasoAtras(e: any) {
    const url = '/';
    this.router.navigate([url]);
  }

  getDetalles$() {
    if (this.globalService.getExisteDetalleSolicitudes() && this.globalService.getExisteDetallePrestamos()) {
      this.solicitudesDetalladas = this.globalService.getSolicitudesDetalladas();
      this.prestamosDetallados = this.globalService.getPrestamosDetallados();
      return of(void 0);
    }
    return this.creditosDetalleService.obtenerDetalles(this.prestamos, this.solicitudes, this.userID).pipe(
      map(({ prestamosDetallados, solicitudesDetalladas }) => {
        this.globalService.setPrestamosDetalladosMap(prestamosDetallados);
        this.globalService.setSolicitudesDetalladasMap(solicitudesDetalladas);
        this.prestamosDetallados = prestamosDetallados;
        this.solicitudesDetalladas = solicitudesDetalladas;
      })
    );
  }

  private formatDetalleSolicitud(detalle: any): any { return formatDetalleSolicitud(detalle); }
  formatDate(date: string | undefined | null): string { return formatDate(date); }
  navegar(prestamo?: CreditoData) {
    if (!prestamo) {
      this.router.navigate(['/rodados/preguntas-frecuentes']);
      return;
    }

    this.globalService.setSolicitudSelected(prestamo.idSolicitud);
    this.globalService.setPrestamoSelected(prestamo.nroOrden);

    this.loading = true;

    switch (prestamo.estado) {
      case EstadosCreditos.Pendiente:
        this.router.navigate(['rodados/pendientes-tyc']);
        break;
      case EstadosCreditos.Finalizado:
        this.router.navigate(['rodados/prestamo-en-curso']);
        break;
      case EstadosCreditos.EnProceso:
        this.router.navigate(['rodados/procesando-solicitud']);
        break;
      case EstadosCreditos.Vigente:
        this.router.navigate(['rodados/prestamo-en-curso']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  backAction(): void {
    this.router.navigate(['./']);
  }

  getVariant(estado: string): 'error' | 'info' | 'success' | 'warning' | 'default' { return getVariant(estado); }

  abrirLanding() {
    window.open('https://www.supervielle.com.ar/personas/prestamos/prendarios', '_blank', 'noopener');
  }
}
