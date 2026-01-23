import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { CreditoData } from 'src/app/modules/rodados/interfaces/lista-credito.dto';
import { CreditosService } from 'src/app/modules/rodados/services/creditos.service';
import { DetallePrestamoService } from 'src/app/modules/rodados/services/detalle-prestamo.service';
import { DetalleSolicitudService } from 'src/app/modules/rodados/services/detalle-solicitud.service';
import { CreditosDetalleService } from '../../services/creditos-detalle.service';
import { formatDate, formatDetalleSolicitud, getVariant, getRutaPorEstado } from 'src/app/shared/utils/creditos-utils';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from 'src/app/shared/models/cliente';


@Component({
  selector: 'app-side-bar-prestamos',
  templateUrl: './side-bar-prestamos.component.html',
  styleUrls: ['./side-bar-prestamos.component.scss']
})
export class SideBarPrestamosComponent implements OnInit {
  userID: number;
  todos: any[];
  prestamos: any[];
  solicitudes: any[];
  solicitudesDetalladas: any[];
  prestamosDetallados: any[];
  cliente: Cliente;
  isLoading = true;
  isLoadingDetalle = true;
  selected: { tipo: 'solicitud' | 'prestamo'; id: string } = null;

  public kiteIconStyle = {
    // display: 'none',
    '& > kite-button-li > button': {
      display: 'none',
      backgroundColor: '$white',
      color: 'var(--colors-button_bg_secondary_hover)',
      '&:hover': { backgroundColor: '$white', display: 'block' },
      // '&:active': { backgroundColor: 'var(--colors-button_bg_secondary_active)' },
      '&:focus': { backgroundColor: 'var(--colors-button_bg_secondary_focus)' }
      // '&:disabled': { backgroundColor: 'var(--colors-button_bg_secondary_disabled)' }
    }
  };

  public kiteListStyle = {
    // display: 'none',
    '& > kite-option-list': {
      backgroundColor: '$white'
      // '&:hover': { backgroundColor: '$white', display: 'block' },
      // '&:active': { backgroundColor: 'var(--colors-button_bg_secondary_active)' },
      // '&:focus': { backgroundColor: 'var(--colors-button_bg_secondary_focus)' },
      // '&:disabled': { backgroundColor: 'var(--colors-button_bg_secondary_disabled)' }
    }
  };

  constructor(
    public router: Router,
    public globalService: GlobalService,
    public prestamosService: CreditosService,
    public clienteService: ClienteService,
    private detallePrestamoService: DetallePrestamoService,
    private detalleSolicitudService: DetalleSolicitudService,
    private creditosDetalleService: CreditosDetalleService
  ) {}

  ngOnInit(): void {
    this.cliente = this.clienteService.getClienteSession();
    this.userID = Number.parseInt(this.cliente.persona_id, 10);

    const solicitudSelected = this.globalService.getSolicitudSelected();
    const prestamoSelected = this.globalService.getPrestamoSelected();

    if (solicitudSelected && !prestamoSelected) {
      this.selected = { tipo: 'solicitud', id: solicitudSelected.toString() };
    } else if (prestamoSelected && !solicitudSelected) {
      this.selected = { tipo: 'prestamo', id: prestamoSelected.toString() };
    } else {
      this.selected = null;
    }

    this.getData();
  }

  getData(): void {
    // Actualiza el seleccionado cada vez que se obtienen datos
    const solicitudSelected = this.globalService.getSolicitudSelected();
    const prestamoSelected = this.globalService.getPrestamoSelected();

    if (solicitudSelected) {
      this.selected = { tipo: 'solicitud', id: solicitudSelected.toString() };
    } else if (prestamoSelected) {
      this.selected = { tipo: 'prestamo', id: prestamoSelected.toString() };
    } else {
      this.selected = null;
    }

    if (this.globalService.getExisteDetalleSolicitudes() && this.globalService.getExisteDetallePrestamos()) {
      this.solicitudes = this.globalService.getCabeceraSolicitudes();
      this.prestamos = this.globalService.getCabeceraPrestamos();
      this.solicitudesDetalladas = this.globalService.getSolicitudesDetalladas();
      this.prestamosDetallados = this.globalService.getPrestamosDetallados();

      if (this.solicitudes === undefined) {
        this.solicitudes = [];
      }

      if (this.prestamos === undefined) {
        this.prestamos = [];
      }

      this.isLoading = false;
    } else {
      this.globalService.creditos$.subscribe((todos) => {
        if (todos) {
          this.todos = todos;
          this.prestamos = todos.filter((c) => c.tipoOperacion === 'prestamo').sort((c1, c2) => (c1.nroOrden > c2.nroOrden ? 1 : -1));

          this.solicitudes = todos
            .filter((c) => c.tipoOperacion === 'solicitud')
            .sort((s1, s2) => (s1.idSolicitud > s2.idSolicitud ? 1 : -1));

          this.creditosDetalleService
            .obtenerDetalles(this.prestamos, this.solicitudes, this.userID)
            .subscribe(({ prestamosDetallados, solicitudesDetalladas }) => {
              this.globalService.setPrestamosDetalladosMap(prestamosDetallados);
              this.globalService.setSolicitudesDetalladasMap(solicitudesDetalladas);
              this.prestamosDetallados = prestamosDetallados;
              this.solicitudesDetalladas = solicitudesDetalladas;
              this.isLoading = false;
            });
        }
      });
    }
  }

  private formatDetalleSolicitud(detalle: any): any { return formatDetalleSolicitud(detalle); }
  formatDate(date: string | undefined | null): string { return formatDate(date); }

  kiteCardStyle(id: string) {
    return this.selected && this.selected.id === id
      ? { border: '1px solid $red900' }
      : { border: '1px solid $gray200' };
  }

  public getKiteListStyle(id: string, tipo: 'solicitud' | 'prestamo') {
    return this.selected && this.selected.id === id && this.selected.tipo === tipo
      ? { gap: '0px', background: '$white', borderRadius: '$md', border: '1px solid $red900', '&:hover': { border: '1px solid $gray200' } }
      : { gap: '0px', background: '$white', borderRadius: '$md', border: '1px solid $gray500' };
  }

  navegar(prestamo?: CreditoData) {

    if (!prestamo) {
      this.router.navigate(['rodados/preguntas-frecuentes'], { replaceUrl: true });
      return;
    }

    if (prestamo.tipoOperacion === 'solicitud') {
      this.globalService.setSolicitudSelected(prestamo.idSolicitud);
      this.globalService.setPrestamoSelected(null); // Limpia el préstamo seleccionado
      this.selected = { tipo: 'solicitud', id: prestamo.idSolicitud.toString() };
    } else {
      this.globalService.setPrestamoSelected(prestamo.nroOrden);
      this.globalService.setSolicitudSelected(null); // Limpia la solicitud seleccionada
      this.selected = { tipo: 'prestamo', id: prestamo.nroOrden.toString() };
    }

    const ruta = this.getRutaPorEstado(prestamo.estado);
    if (this.router.url === ruta) {
      this.getData();
    } else {
      this.router.navigate([ruta], { replaceUrl: true });
    }
  }

  private getRutaPorEstado(estado: string): string { return getRutaPorEstado(estado); }

  getVariant(estado: string): 'error' | 'info' | 'success' | 'warning' | 'default' { return getVariant(estado); }
}
