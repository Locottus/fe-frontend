import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarRangeChangeEventType, CalendarRangeValueType } from '@kite/shared';
import { CuotaDetalle, DetallePrestamoDTO } from '../interfaces/detalle-prestamo.dto';
import { DetallePrestamoService } from '../services/detalle-prestamo.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { parse, isValid, startOfDay, endOfDay } from 'date-fns';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';

@Component({
  selector: 'app-prestamo-prendario-en-curso',
  templateUrl: './prestamo-prendario-en-curso.component.html',
  styleUrls: ['./prestamo-prendario-en-curso.component.scss']
})
export class PrestamoPrendarioEnCursoComponent implements OnInit {
  @ViewChild('menuEstado') menuEstado: any;
  @ViewChild('menuPeriodo') menuPeriodo: any;
  @ViewChild('menuMobile') menuMobile: any;

  calendar = false;
  isFilterEstado = false;
  isFilterPeriodo = false;
  filtroEstado: string | null = null;
  filtroPeriodo: number | null = null;
  fechaActual: Date;
  prestamo: DetallePrestamoDTO;
  op: number;
  isLoading = true;

  selectedRange: CalendarRangeValueType = [null, null];
  fechaMin: Date = new Date(new Date().getFullYear() - 10, 0, 1);
  fechaMax: Date = new Date(new Date().getFullYear() + 10, 11, 31);

  cuotasPrestamoFiltradas: CuotaDetalle[] = [];

  cuotaSeleccionada: CuotaDetalle | null = null;
  mostrarDetalleCuota = false;

  // Tab activo: 'pendientes' o 'pagadas'
  tabActivo: 'pendientes' | 'pagadas' = 'pendientes';

  public kiteButtonStyles = {
    paddingY: '8px',
    marginLeft: '8px',
    '& > kite-button > button': {
      border: '1px solid $gray400',
      backgroundColor: '$white'
      // '&:hover': { backgroundColor: 'var(--colors-button_bg_secondary_hover)' },
      // '&:active': { backgroundColor: 'var(--colors-button_bg_secondary_active)' },
      // '&:focus': { backgroundColor: 'var(--colors-button_bg_secondary_focus)' },
      // '&:disabled': { backgroundColor: 'var(--colors-button_bg_secondary_disabled)' }
    }
  };

  isMobile: boolean;

  constructor(
    private route: Router,
    public detallePrestamoService: DetallePrestamoService,
    public contratosService: GlobalService,
    private layoutRemoteService: LayoutRemoteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fechaActual = new Date();
    this.obtenerPrestamo();

    if (location.pathname.includes('root')) {
      this.layoutRemoteService.ocultarLayout({ ocultarTodo: true });
    }

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('customizeHeaderEvent', {
          detail: {
            title: 'Detalle Préstamo',
            showBackButton: true,
            showCloseButton: false,
            hideLogo: true,
            actionBackButton: () => this.backAction(),
            actionCloseButton: () => this.route.navigate(['/solicitudes'])
          }
        })
      );
    }, 0);

    this.isMobile = this.authService.getAuthMethod() === 'mobile';
  }

  ngOnDestroy(): void {
    window.dispatchEvent(
      new CustomEvent('customizeHeaderEvent', {
        detail: {
          title: '',
          showBackButton: false,
          showCloseButton: false,
          hideLogo: false
        }
      })
    );
  }

  obtenerPrestamo(): void {
    this.op = this.contratosService.getPrestamoSelected();

    this.contratosService.getPrestamoDetallado().subscribe((prestamo) => {
      this.prestamo = prestamo;
      this.aplicarFiltros();
    });
  }

  backAction(): void {
    this.route.navigate(['/solicitudes']);
  }

  getVariant(estado: string) {
    switch (estado) {
      case 'Pagada': {
        return 'success';
      }
      case 'Vencida': {
        return 'error';
      }
      default: {
        return 'warning';
      }
    }
  }

  // Calcula los días hasta el vencimiento
  getDiasHastaVencimiento(fechaVencimiento: string): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = parse(fechaVencimiento, 'yyyy-MM-dd', new Date());
    vencimiento.setHours(0, 0, 0, 0);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Determina el label del badge según el estado y días de vencimiento
  getBadgeLabel(cuota: CuotaDetalle): string | null {
    if (cuota.estado_descripcion === 'Pagada') {
      return null; // No mostrar badge para pagadas
    }
    if (cuota.estado_descripcion === 'Vencida') {
      return 'Vencida';
    }
    // Calcular días hasta vencimiento
    const dias = this.getDiasHastaVencimiento(cuota.fecha_vencimiento);
    if (dias <= 7 && dias >= 0) {
      if (dias === 0) {
        return 'Vence hoy';
      }
      if (dias === 1) {
        return 'Vence mañana';
      }
      return `Vence en ${dias} días`;
    }
    return null; // No mostrar badge si faltan más de 7 días
  }

  // Determina el variant del badge
  getBadgeVariant(cuota: CuotaDetalle): string {
    if (cuota.estado_descripcion === 'Vencida') {
      return 'error';
    }
    const dias = this.getDiasHastaVencimiento(cuota.fecha_vencimiento);
    if (dias <= 7 && dias >= 0) {
      return 'warning';
    }
    return 'default';
  }

  openCalendar() {
    this.calendar = true;
  }

  closeCalendar() {
    this.calendar = false;
    this.selectedRange = [null, null];
  }

  // Métodos para controlar los menús de filtro
  onMenuEstadoClose() {
    // El evento onClose se dispara cuando el menú se cierra
  }

  onMenuPeriodoClose() {
    this.closeCalendar();
  }

  onMenuMobileClose() {
    // El evento onClose se dispara cuando el menú se cierra
  }

  cerrarMenuEstado() {
    if (this.menuEstado?.menuService) {
      this.menuEstado.menuService.close();
    }
  }

  cerrarMenuPeriodo() {
    this.closeCalendar();
    if (this.menuPeriodo?.menuService) {
      this.menuPeriodo.menuService.close();
    }
  }

  cerrarMenuMobile() {
    if (this.menuMobile?.menuService) {
      this.menuMobile.menuService.close();
    }
  }

  aplicarFiltrosYCerrar(tipo: 'estado' | 'periodo') {
    this.aplicarFiltros();
    if (tipo === 'estado') {
      this.cerrarMenuEstado();
    } else {
      this.cerrarMenuPeriodo();
    }
  }

  borrarFiltrosYCerrar(tipo?: 'estado' | 'periodo') {
    this.borrarFiltros(tipo);
    if (tipo === 'estado') {
      this.cerrarMenuEstado();
    } else if (tipo === 'periodo') {
      this.cerrarMenuPeriodo();
    }
  }

  // Métodos para mobile
  aplicarFiltrosYCerrarMobile() {
    this.aplicarFiltros();
    this.cerrarMenuMobile();
  }

  borrarFiltrosYCerrarMobile() {
    this.borrarFiltros();
    this.cerrarMenuMobile();
  }

  // Calcular cantidad de filtros activos para el badge
  getFilterCount(): number {
    let count = 0;
    if (this.filtroEstado) count++;
    if (this.filtroPeriodo) count++;
    return count;
  }

  setFiltroEstado(estado: string) {
    this.filtroEstado = estado;
  }

  setFiltroPeriodo(periodo: number) {
    this.filtroPeriodo = periodo;
  }

  isSameFilter(value: any, filtro: string) {
    return filtro === 'estado' ? this.filtroEstado === value : this.filtroPeriodo === value;
  }

  borrarFiltros(filtro?: string) {
    if (filtro === 'estado') {
      this.filtroEstado = null;
      this.isFilterEstado = false;
    } else {
      this.filtroPeriodo = null;
      this.filtroEstado = null;
      this.isFilterPeriodo = false;
      this.selectedRange = [null, null];
    }

    this.aplicarFiltros();
  }

  aplicarFiltros() {
    // Ahora las cuotas están en .cuotas.listado
    if (this.prestamo !== undefined) {
      this.isLoading = false;
      this.cuotasPrestamoFiltradas = this.prestamo.detallePrestamo.cuotas.listado.filter((cuota) => {
        // Filtrar por tab activo
        const cumpleTab = this.tabActivo === 'pagadas' 
          ? cuota.estado_descripcion === 'Pagada'
          : cuota.estado_descripcion !== 'Pagada';
        const cumpleEstado = this.filtroEstado ? cuota.estado_descripcion === this.filtroEstado : true;
        const cumplePeriodo = this.filtroPeriodo ? this.filtrarPorPeriodo(cuota.fecha_vencimiento) : true;
        return cumpleTab && cumpleEstado && cumplePeriodo;
      });
    }
  }

  // Cambiar tab activo
  setTabActivo(tab: 'pendientes' | 'pagadas') {
    this.tabActivo = tab;
    this.aplicarFiltros();
  }

  filtrarPorPeriodo(vencimiento: string): boolean {
    if (!this.filtroPeriodo) {
      return true;
    }
    const fechaCuota = parse(vencimiento, 'yyyy-MM-dd', new Date());
    if (!isValid(fechaCuota)) {
      console.error('Formato de vencimiento inválido: ', vencimiento);
      return false;
    }
    if (this.filtroPeriodo === 1) {
      const [start, end] = this.selectedRange || [];
      if (!start || !end) {
        console.error('selectedRange no está inicializado correctamente.');
        return false;
      }
      return fechaCuota >= startOfDay(start) && fechaCuota <= endOfDay(end);
    } else {
      const fechaLimite = new Date(this.fechaActual);
      fechaLimite.setDate(fechaLimite.getDate() - this.filtroPeriodo);
      return fechaCuota > startOfDay(fechaLimite);
    }
  }

  onChange(event: CalendarRangeChangeEventType) {
    this.selectedRange = event.value;
    if (this.selectedRange[1]) {
      this.filtroPeriodo = 1;
    }

    if (!event?.value) {
      return;
    }

    const [startDate, endDate] = event.value;
  }


  verDetalleCuota(cuota: CuotaDetalle) {
    this.cuotaSeleccionada = cuota;
    this.mostrarDetalleCuota = true;
  }

  cerrarDetalleCuota() {
    this.mostrarDetalleCuota = false;
  }

}
