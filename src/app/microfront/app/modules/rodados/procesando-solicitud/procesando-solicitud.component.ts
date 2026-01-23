import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import { DetalleSolicitudDTO } from '../interfaces/detalle-solicitud.dto';
import { EstadosCreditos } from 'src/app/shared/models/estados-creditos';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';

@Component({
  selector: 'app-procesando-solicitud',
  templateUrl: './procesando-solicitud.component.html',
  styleUrls: ['./procesando-solicitud.component.scss']
})
export class ProcesandoSolicitudComponent implements OnInit {
  openDetalle = false;
  solicitud: DetalleSolicitudDTO | null = null;
  isLoading = true;
  isMobile: boolean;

  pasos: PasoSolicitud[] = [];

  constructor(
    private router: Router,
    public globalService: GlobalService,
    private layoutRemoteService: LayoutRemoteService,
    private authService: AuthService
  ) {
    if (location.pathname.includes('root')) {
      this.layoutRemoteService.ocultarLayout({ ocultarTodo: true });
    }
  }

  ngOnInit(): void {
    this.isMobile = this.authService.getAuthMethod() === 'mobile';
    this.isLoading = true;
    this.getDetalle();
  }

  getDetalle(): void {
    this.isLoading = true;
    this.globalService.getSolicitudDetallada().subscribe((solicitud) => {
      if (!solicitud) {
        this.solicitud = null;
        this.isLoading = false;
        this.pasos = [
          { estado: EstadosCreditos.Pendiente, descripcion: 'Aceptacion de los términos y condiciones.', completado: false },
          {
            estado: EstadosCreditos.EnProceso,
            descripcion: 'Firma de documentación en concesionaria y espera de confirmación por parte del banco',
            completado: false
          },
          { estado: EstadosCreditos.Pendiente, descripcion: 'Aprobación final y desembolso', completado: false }
        ];
        return;
      } else {
        const desde = solicitud.id.toString().indexOf('-') + 1;

        this.solicitud = {
          ...solicitud,
          id: solicitud.id ? solicitud.id.toString().substring(desde) : '',
          solicitud: solicitud.solicitud
            ? {
                ...solicitud.solicitud
              }
            : undefined
        };
        this.pasos = [
          {
            estado: EstadosCreditos.Pendiente,
            descripcion: 'Aceptacion de los términos y condiciones.',
            fecha: this.solicitud?.solicitud?.fechaAlta,
            completado: !!this.solicitud?.solicitud?.fechaAlta
          },
          {
            estado: EstadosCreditos.EnProceso,
            descripcion: 'Firma de documentación en concesionaria y espera de confirmación por parte del banco',
            fecha: this.solicitud?.solicitud?.primerVencimiento,
            completado: false
          },
          {
            estado: EstadosCreditos.Vigente,
            descripcion: 'Aprobación final y desembolso',
            fecha: this.solicitud?.solicitud?.ultimoVencimiento,
            completado: false
          }
        ];
        this.isLoading = false;
      }
    });
  }

  public backAction() {
    this.router.navigate(['/solicitudes']);
  }

  modalOpen(value: boolean) {
    this.openDetalle = value;
  }
}

export interface PasoSolicitud {
  estado: string;
  descripcion: string;
  fecha?: string;
  completado: boolean;
}
