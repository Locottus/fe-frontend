import { EstadosCreditos } from 'src/app/shared/models/estados-creditos';
import { PrestamoPrendarioEnCursoComponent } from './prestamo-prendario-en-curso.component';
import { fakeAsync, tick } from '@angular/core/testing';

describe('PrestamoPrendarioEnCursoComponent', () => {
  let component: PrestamoPrendarioEnCursoComponent;
  let mockRouter: any;
  let mockDetallePrestamoService: any;
  let mockContratosService: any;
  let mockLayoutRemoteService: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockDetallePrestamoService = {};
    mockContratosService = jasmine.createSpyObj('ContratosService', [
      'getContratoSelected', 
      'getContratoDetallado',
      'getPrestamoSelected',
      'getPrestamoDetallado'
    ]);
    mockContratosService.getContratoSelected.and.returnValue(123);
    mockContratosService.getContratoDetallado.and.returnValue({ subscribe: jasmine.createSpy('subscribe') });
    mockContratosService.getPrestamoSelected.and.returnValue(456);
    mockContratosService.getPrestamoDetallado.and.returnValue({ subscribe: jasmine.createSpy('subscribe') });
    mockLayoutRemoteService = jasmine.createSpyObj('LayoutRemoteService', ['ocultarLayout']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAuthMethod']);
    mockAuthService.getAuthMethod.and.returnValue('normal');

    component = new PrestamoPrendarioEnCursoComponent(
      mockRouter,
      mockDetallePrestamoService,
      mockContratosService,
      mockLayoutRemoteService,
      mockAuthService
    );
  });

  describe('getVariant', () => {
    it('should return "success" when estado is "Pagada"', () => {
      expect(component.getVariant('Pagada')).toBe('success');
    });

    it('should return "error" when estado is "Vencida"', () => {
      expect(component.getVariant('Vencida')).toBe('error');
    });

    it('should return "warning" for any other estado', () => {
      expect(component.getVariant(EstadosCreditos.Pendiente)).toBe('warning');
      expect(component.getVariant(EstadosCreditos.EnProceso)).toBe('warning');
      expect(component.getVariant('')).toBe('warning');
      expect(component.getVariant(undefined as any)).toBe('warning');
      expect(component.getVariant(null as any)).toBe('warning');
    });
  });

  describe('backAction', () => {
    it('should navigate to solicitudes', () => {
      component.backAction();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/solicitudes']);
    });
  });

  describe('setFiltroEstado', () => {
    it('should set filtroEstado', () => {
      component.setFiltroEstado('Pagada');
      expect(component.filtroEstado).toBe('Pagada');
    });
  });

  describe('setFiltroPeriodo', () => {
    it('should set filtroPeriodo', () => {
      component.setFiltroPeriodo(5);
      expect(component.filtroPeriodo).toBe(5);
    });
  });

  describe('isSameFilter', () => {
    it('should compare filtroEstado when filtro is "estado"', () => {
      component.filtroEstado = 'Pagada';
      expect(component.isSameFilter('Pagada', 'estado')).toBe(true);
      expect(component.isSameFilter('Vencida', 'estado')).toBe(false);
    });

    it('should compare filtroPeriodo when filtro is not "estado"', () => {
      component.filtroPeriodo = 10;
      expect(component.isSameFilter(10, 'periodo')).toBe(true);
      expect(component.isSameFilter(5, 'periodo')).toBe(false);
    });
  });

  describe('borrarFiltros', () => {
    beforeEach(() => {
      component.filtroEstado = 'Pagada';
      component.isFilterEstado = true;
      component.filtroPeriodo = 5;
      component.isFilterPeriodo = true;
      component.selectedRange = [new Date(), new Date()];
      component.aplicarFiltros = jasmine.createSpy();
    });

    it('should reset estado filters and call aplicarFiltros', () => {
      component.borrarFiltros('estado');
      expect(component.filtroEstado).toBeNull();
      expect(component.isFilterEstado).toBe(false);
      expect(component.aplicarFiltros).toHaveBeenCalled();
    });

    it('should reset periodo filters and call aplicarFiltros', () => {
      component.borrarFiltros('periodo');
      expect(component.filtroPeriodo).toBeNull();
      expect(component.isFilterPeriodo).toBe(false);
      expect(component.selectedRange).toEqual([null, null]);
      expect(component.aplicarFiltros).toHaveBeenCalled();
    });
  });

  describe('openCalendar', () => {
    it('should set calendar to true', () => {
      component.calendar = false;
      component.openCalendar();
      expect(component.calendar).toBe(true);
    });
  });

  describe('closeCalendar', () => {
    it('should set calendar to false and reset selectedRange', () => {
      component.calendar = true;
      component.selectedRange = [new Date(), new Date()];
      component.closeCalendar();
      expect(component.calendar).toBe(false);
      expect(component.selectedRange).toEqual([null, null]);
    });
  });

  describe('onChange', () => {
    it('should update selectedRange', () => {
      const mockEvent = { value: [new Date('2024-01-01'), new Date('2024-01-31')] } as any;
      component.onChange(mockEvent);
      expect(component.selectedRange).toEqual(mockEvent.value);
    });

    it('should set filtroPeriodo to 1 when endDate is present', () => {
      const mockEvent = { value: [new Date('2024-01-01'), new Date('2024-01-31')] } as any;
      component.onChange(mockEvent);
      expect(component.filtroPeriodo).toBe(1);
    });
  });

  describe('filtrarPorPeriodo', () => {
    beforeEach(() => {
      component.fechaActual = new Date('2024-06-15');
    });

    it('should return true when filtroPeriodo is null', () => {
      component.filtroPeriodo = null;
      expect(component.filtrarPorPeriodo('2024-06-01')).toBe(true);
    });

    it('should filter by custom range when filtroPeriodo is 1', () => {
      component.filtroPeriodo = 1;
      component.selectedRange = [new Date('2024-06-01'), new Date('2024-06-10')];
      expect(component.filtrarPorPeriodo('2024-06-05')).toBe(true);
      expect(component.filtrarPorPeriodo('2024-06-15')).toBe(false);
    });

    it('should return false for invalid date format', () => {
      component.filtroPeriodo = 7;
      spyOn(console, 'error');
      expect(component.filtrarPorPeriodo('invalid-date')).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });

    it('should filter by days when filtroPeriodo is greater than 1', () => {
      component.filtroPeriodo = 7;
      component.fechaActual = new Date('2024-06-15');
      expect(component.filtrarPorPeriodo('2024-06-10')).toBe(true);
      expect(component.filtrarPorPeriodo('2024-06-01')).toBe(false);
    });

    it('should return false when selectedRange is not properly initialized and filtroPeriodo is 1', () => {
      component.filtroPeriodo = 1;
      component.selectedRange = [null, null];
      spyOn(console, 'error');
      expect(component.filtrarPorPeriodo('2024-06-05')).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('aplicarFiltros', () => {
    it('should filter cuotas based on filtroEstado', () => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: [
              { estado_descripcion: 'Pagada', fecha_vencimiento: '2024-06-01' },
              { estado_descripcion: 'Vencida', fecha_vencimiento: '2024-06-05' },
              { estado_descripcion: 'Pagada', fecha_vencimiento: '2024-06-10' }
            ]
          }
        }
      } as any;
      component.tabActivo = 'pagadas'; // Cambiar a tab pagadas para filtrar cuotas pagadas
      component.filtroEstado = 'Pagada';
      component.filtroPeriodo = null;
      component.aplicarFiltros();
      expect(component.cuotasPrestamoFiltradas.length).toBe(2);
      expect(component.isLoading).toBe(false);
    });

    it('should filter cuotas based on tabActivo pendientes', () => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: [
              { estado_descripcion: 'Pagada', fecha_vencimiento: '2024-06-01' },
              { estado_descripcion: 'Vencida', fecha_vencimiento: '2024-06-05' },
              { estado_descripcion: 'Pendiente', fecha_vencimiento: '2024-06-10' }
            ]
          }
        }
      } as any;
      component.tabActivo = 'pendientes';
      component.filtroEstado = null;
      component.filtroPeriodo = null;
      component.aplicarFiltros();
      expect(component.cuotasPrestamoFiltradas.length).toBe(2); // Vencida y Pendiente
      expect(component.isLoading).toBe(false);
    });

    it('should filter cuotas based on tabActivo pagadas', () => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: [
              { estado_descripcion: 'Pagada', fecha_vencimiento: '2024-06-01' },
              { estado_descripcion: 'Vencida', fecha_vencimiento: '2024-06-05' },
              { estado_descripcion: 'Pagada', fecha_vencimiento: '2024-06-10' }
            ]
          }
        }
      } as any;
      component.tabActivo = 'pagadas';
      component.filtroEstado = null;
      component.filtroPeriodo = null;
      component.aplicarFiltros();
      expect(component.cuotasPrestamoFiltradas.length).toBe(2); // Solo las pagadas
      expect(component.isLoading).toBe(false);
    });

    it('should not filter when prestamo is undefined', () => {
      component.prestamo = undefined as any;
      component.aplicarFiltros();
      expect(component.isLoading).toBe(true);
    });
  });

  describe('obtenerPrestamo', () => {
    it('should call getPrestamoSelected and getPrestamoDetallado', () => {
      const mockPrestamo = {
        detallePrestamo: {
          cuotas: {
            listado: []
          }
        }
      } as any;
      
      spyOn(component, 'aplicarFiltros');
      component.obtenerPrestamo();
      
      expect(mockContratosService.getPrestamoSelected).toHaveBeenCalled();
      expect(mockContratosService.getPrestamoDetallado).toHaveBeenCalled();
    });
  });

  // Helper function to format date as yyyy-MM-dd in local timezone
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper to calculate expected days (matching component logic with date-fns parse)
  function calcularDiasEsperados(fechaStr: string): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    // Simular como date-fns parse interpreta yyyy-MM-dd
    const [year, month, day] = fechaStr.split('-').map(Number);
    const vencimiento = new Date(year, month - 1, day);
    vencimiento.setHours(0, 0, 0, 0);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  describe('getDiasHastaVencimiento', () => {
    it('should return positive days when fecha is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const fechaStr = formatDateLocal(futureDate);
      const expected = calcularDiasEsperados(fechaStr);

      const result = component.getDiasHastaVencimiento(fechaStr);

      expect(result).toBe(expected);
    });

    it('should return 0 or close to 0 when fecha is today', () => {
      const today = new Date();
      const fechaStr = formatDateLocal(today);
      const expected = calcularDiasEsperados(fechaStr);

      const result = component.getDiasHastaVencimiento(fechaStr);

      expect(result).toBe(expected);
    });

    it('should return negative days when fecha is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 3);
      const fechaStr = formatDateLocal(pastDate);
      const expected = calcularDiasEsperados(fechaStr);

      const result = component.getDiasHastaVencimiento(fechaStr);

      expect(result).toBe(expected);
    });
  });

  describe('getBadgeLabel', () => {
    it('should return null when estado_descripcion is Pagada', () => {
      const cuota = { estado_descripcion: 'Pagada', fecha_vencimiento: '2024-06-01' } as any;

      const result = component.getBadgeLabel(cuota);

      expect(result).toBeNull();
    });

    it('should return "Vencida" when estado_descripcion is Vencida', () => {
      const cuota = { estado_descripcion: 'Vencida', fecha_vencimiento: '2024-06-01' } as any;

      const result = component.getBadgeLabel(cuota);

      expect(result).toBe('Vencida');
    });

    it('should return correct label when fecha_vencimiento is today', () => {
      const today = new Date();
      const fechaStr = formatDateLocal(today);
      const dias = calcularDiasEsperados(fechaStr);
      const cuota = { estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr } as any;

      const result = component.getBadgeLabel(cuota);

      if (dias === 0) {
        expect(result).toBe('Vence hoy');
      } else if (dias === 1) {
        expect(result).toBe('Vence mañana');
      } else if (dias > 1 && dias <= 7) {
        expect(result).toBe(`Vence en ${dias} días`);
      } else {
        expect(result).toBeNull();
      }
    });

    it('should return correct label when fecha_vencimiento is tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const fechaStr = formatDateLocal(tomorrow);
      const dias = calcularDiasEsperados(fechaStr);
      const cuota = { estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr } as any;

      const result = component.getBadgeLabel(cuota);

      if (dias === 0) {
        expect(result).toBe('Vence hoy');
      } else if (dias === 1) {
        expect(result).toBe('Vence mañana');
      } else if (dias > 1 && dias <= 7) {
        expect(result).toBe(`Vence en ${dias} días`);
      } else {
        expect(result).toBeNull();
      }
    });

    it('should return correct label when fecha_vencimiento is within 7 days', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const fechaStr = formatDateLocal(futureDate);
      const dias = calcularDiasEsperados(fechaStr);
      const cuota = { estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr } as any;

      const result = component.getBadgeLabel(cuota);

      if (dias === 0) {
        expect(result).toBe('Vence hoy');
      } else if (dias === 1) {
        expect(result).toBe('Vence mañana');
      } else if (dias > 1 && dias <= 7) {
        expect(result).toBe(`Vence en ${dias} días`);
      } else {
        expect(result).toBeNull();
      }
    });

    it('should return null when fecha_vencimiento is more than 7 days away', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const fechaStr = formatDateLocal(futureDate);
      const cuota = { estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr } as any;

      const result = component.getBadgeLabel(cuota);

      expect(result).toBeNull();
    });
  });

  describe('getBadgeVariant', () => {
    it('should return "error" when estado_descripcion is Vencida', () => {
      const cuota = { estado_descripcion: 'Vencida', fecha_vencimiento: '2024-06-01' } as any;

      const result = component.getBadgeVariant(cuota);

      expect(result).toBe('error');
    });

    it('should return correct variant when fecha_vencimiento is within 7 days', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      const fechaStr = formatDateLocal(futureDate);
      const dias = calcularDiasEsperados(fechaStr);
      const cuota = { estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr } as any;

      const result = component.getBadgeVariant(cuota);

      if (dias >= 0 && dias <= 7) {
        expect(result).toBe('warning');
      } else {
        expect(result).toBe('default');
      }
    });

    it('should return "default" when fecha_vencimiento is more than 7 days away', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const fechaStr = formatDateLocal(futureDate);
      const cuota = { estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr } as any;

      const result = component.getBadgeVariant(cuota);

      expect(result).toBe('default');
    });
  });

  describe('verDetalleCuota', () => {
    it('should set cuotaSeleccionada and mostrarDetalleCuota to true', () => {
      const cuota = { numero: 1, estado_descripcion: 'Pendiente' } as any;

      component.verDetalleCuota(cuota);

      expect(component.cuotaSeleccionada).toBe(cuota);
      expect(component.mostrarDetalleCuota).toBe(true);
    });
  });

  describe('cerrarDetalleCuota', () => {
    it('should set mostrarDetalleCuota to false', () => {
      component.mostrarDetalleCuota = true;

      component.cerrarDetalleCuota();

      expect(component.mostrarDetalleCuota).toBe(false);
    });
  });

  describe('setTabActivo', () => {
    beforeEach(() => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: [
              { estado_descripcion: 'Pagada', fecha_vencimiento: '2024-06-01' },
              { estado_descripcion: 'Pendiente', fecha_vencimiento: '2024-06-05' }
            ]
          }
        }
      } as any;
    });

    it('should set tabActivo to pendientes', () => {
      component.setTabActivo('pendientes');

      expect(component.tabActivo).toBe('pendientes');
    });

    it('should set tabActivo to pagadas', () => {
      component.setTabActivo('pagadas');

      expect(component.tabActivo).toBe('pagadas');
    });

    it('should call aplicarFiltros when changing tab', () => {
      spyOn(component, 'aplicarFiltros');

      component.setTabActivo('pagadas');

      expect(component.aplicarFiltros).toHaveBeenCalled();
    });
  });

  describe('getFilterCount', () => {
    it('should return 0 when no filters are active', () => {
      component.filtroEstado = null;
      component.filtroPeriodo = null;

      const result = component.getFilterCount();

      expect(result).toBe(0);
    });

    it('should return 1 when only filtroEstado is active', () => {
      component.filtroEstado = 'Pagada';
      component.filtroPeriodo = null;

      const result = component.getFilterCount();

      expect(result).toBe(1);
    });

    it('should return 1 when only filtroPeriodo is active', () => {
      component.filtroEstado = null;
      component.filtroPeriodo = 7;

      const result = component.getFilterCount();

      expect(result).toBe(1);
    });

    it('should return 2 when both filters are active', () => {
      component.filtroEstado = 'Pagada';
      component.filtroPeriodo = 7;

      const result = component.getFilterCount();

      expect(result).toBe(2);
    });
  });

  describe('onMenuEstadoClose', () => {
    it('should be callable', () => {
      expect(() => component.onMenuEstadoClose()).not.toThrow();
    });
  });

  describe('onMenuPeriodoClose', () => {
    it('should call closeCalendar', () => {
      spyOn(component, 'closeCalendar');

      component.onMenuPeriodoClose();

      expect(component.closeCalendar).toHaveBeenCalled();
    });
  });

  describe('onMenuMobileClose', () => {
    it('should be callable', () => {
      expect(() => component.onMenuMobileClose()).not.toThrow();
    });
  });

  describe('cerrarMenuEstado', () => {
    it('should call menuEstado.menuService.close if menuService exists', () => {
      component.menuEstado = { menuService: { close: jasmine.createSpy('close') } };

      component.cerrarMenuEstado();

      expect(component.menuEstado.menuService.close).toHaveBeenCalled();
    });

    it('should not throw if menuEstado has no menuService', () => {
      component.menuEstado = {};

      expect(() => component.cerrarMenuEstado()).not.toThrow();
    });
  });

  describe('cerrarMenuPeriodo', () => {
    it('should call closeCalendar', () => {
      spyOn(component, 'closeCalendar');

      component.cerrarMenuPeriodo();

      expect(component.closeCalendar).toHaveBeenCalled();
    });

    it('should call menuPeriodo.menuService.close if menuService exists', () => {
      spyOn(component, 'closeCalendar');
      component.menuPeriodo = { menuService: { close: jasmine.createSpy('close') } };

      component.cerrarMenuPeriodo();

      expect(component.menuPeriodo.menuService.close).toHaveBeenCalled();
    });
  });

  describe('aplicarFiltrosYCerrar', () => {
    beforeEach(() => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: []
          }
        }
      } as any;
    });

    it('should call aplicarFiltros and cerrarMenuEstado when tipo is estado', () => {
      spyOn(component, 'cerrarMenuEstado');

      component.aplicarFiltrosYCerrar('estado');

      expect(component.cerrarMenuEstado).toHaveBeenCalled();
    });

    it('should call aplicarFiltros and cerrarMenuPeriodo when tipo is periodo', () => {
      spyOn(component, 'cerrarMenuPeriodo');

      component.aplicarFiltrosYCerrar('periodo');

      expect(component.cerrarMenuPeriodo).toHaveBeenCalled();
    });
  });

  describe('borrarFiltrosYCerrar', () => {
    beforeEach(() => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: []
          }
        }
      } as any;
    });

    it('should call borrarFiltros and cerrarMenuEstado when tipo is estado', () => {
      spyOn(component, 'cerrarMenuEstado');

      component.borrarFiltrosYCerrar('estado');

      expect(component.cerrarMenuEstado).toHaveBeenCalled();
    });

    it('should call borrarFiltros and cerrarMenuPeriodo when tipo is periodo', () => {
      spyOn(component, 'cerrarMenuPeriodo');

      component.borrarFiltrosYCerrar('periodo');

      expect(component.cerrarMenuPeriodo).toHaveBeenCalled();
    });
  });

  describe('cerrarMenuMobile', () => {
    it('should call menuMobile.menuService.close if menuService exists', () => {
      component.menuMobile = { menuService: { close: jasmine.createSpy('close') } };

      component.cerrarMenuMobile();

      expect(component.menuMobile.menuService.close).toHaveBeenCalled();
    });

    it('should not throw error if menuMobile has no menuService', () => {
      component.menuMobile = {};

      expect(() => component.cerrarMenuMobile()).not.toThrow();
    });

    it('should not throw error if menuMobile is undefined', fakeAsync(() => {
      component.menuMobile = undefined;

      expect(() => {
        component.cerrarMenuMobile();
        tick();
      }).not.toThrow();
    }));
  });

  describe('aplicarFiltrosYCerrarMobile', () => {
    beforeEach(() => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: []
          }
        }
      } as any;
    });

    it('should call aplicarFiltros and cerrarMenuMobile', () => {
      spyOn(component, 'cerrarMenuMobile');

      component.aplicarFiltrosYCerrarMobile();

      expect(component.cerrarMenuMobile).toHaveBeenCalled();
    });
  });

  describe('borrarFiltrosYCerrarMobile', () => {
    beforeEach(() => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: []
          }
        }
      } as any;
    });

    it('should call borrarFiltros and cerrarMenuMobile', () => {
      spyOn(component, 'cerrarMenuMobile');

      component.borrarFiltrosYCerrarMobile();

      expect(component.cerrarMenuMobile).toHaveBeenCalled();
    });
  });

  describe('onChange - additional cases', () => {
    it('should not set filtroPeriodo when endDate is not present', () => {
      component.filtroPeriodo = null;
      const mockEvent = { value: [new Date('2024-01-01'), null] } as any;
      
      component.onChange(mockEvent);
      
      expect(component.filtroPeriodo).toBeNull();
    });

    it('should update selectedRange with both dates', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const mockEvent = { value: [startDate, endDate] } as any;
      
      component.onChange(mockEvent);
      
      expect(component.selectedRange).toEqual([startDate, endDate]);
      expect(component.filtroPeriodo).toBe(1);
    });

    it('should handle event with empty array value', () => {
      const mockEvent = { value: [] } as any;
      
      component.onChange(mockEvent);
      
      expect(component.selectedRange).toEqual([]);
      expect(component.filtroPeriodo).toBeNull();
    });
  });

  describe('aplicarFiltros - combined filters', () => {
    beforeEach(() => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: [
              { estado_descripcion: 'Pagada', fecha_vencimiento: '2024-06-01' },
              { estado_descripcion: 'Vencida', fecha_vencimiento: '2024-06-05' },
              { estado_descripcion: 'Pendiente', fecha_vencimiento: '2024-06-10' },
              { estado_descripcion: 'Pagada', fecha_vencimiento: '2024-06-15' }
            ]
          }
        }
      } as any;
    });

    it('should filter by both estado and periodo', () => {
      component.tabActivo = 'pagadas';
      component.filtroEstado = 'Pagada';
      component.filtroPeriodo = null;
      
      component.aplicarFiltros();
      
      expect(component.cuotasPrestamoFiltradas.length).toBe(2);
    });

    it('should return all pendientes when no filters applied', () => {
      component.tabActivo = 'pendientes';
      component.filtroEstado = null;
      component.filtroPeriodo = null;
      
      component.aplicarFiltros();
      
      expect(component.cuotasPrestamoFiltradas.length).toBe(2); // Vencida y Pendiente
    });

    it('should filter Vencida from pendientes tab with estado filter', () => {
      component.tabActivo = 'pendientes';
      component.filtroEstado = 'Vencida';
      component.filtroPeriodo = null;
      
      component.aplicarFiltros();
      
      expect(component.cuotasPrestamoFiltradas.length).toBe(1);
      expect(component.cuotasPrestamoFiltradas[0].estado_descripcion).toBe('Vencida');
    });
  });

  describe('ngOnInit integration', () => {
    it('should set fechaActual to current date', () => {
      const before = new Date();
      
      component.ngOnInit();
      
      const after = new Date();
      expect(component.fechaActual.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(component.fechaActual.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should call obtenerPrestamo', () => {
      spyOn(component, 'obtenerPrestamo');
      
      component.ngOnInit();
      
      expect(component.obtenerPrestamo).toHaveBeenCalled();
    });

    it('should set isMobile based on authService', () => {
      mockAuthService.getAuthMethod.and.returnValue('mobile');
      
      component.ngOnInit();
      
      expect(component.isMobile).toBe(true);
    });

    it('should set isMobile to false when auth method is not mobile', () => {
      mockAuthService.getAuthMethod.and.returnValue('web');
      
      component.ngOnInit();
      
      expect(component.isMobile).toBe(false);
    });

    it('should dispatch customizeHeaderEvent with correct detail', (done) => {
      const dispatchSpy = spyOn(window, 'dispatchEvent').and.callThrough();
      
      component.ngOnInit();
      
      // Wait for setTimeout
      setTimeout(() => {
        const customEvent = dispatchSpy.calls.all().find(call => {
          const event = call.args[0] as CustomEvent;
          return event.type === 'customizeHeaderEvent';
        });
        
        expect(customEvent).toBeTruthy();
        if (customEvent) {
          const event = customEvent.args[0] as CustomEvent;
          expect(event.detail.title).toBe('Detalle Préstamo');
          expect(event.detail.showBackButton).toBe(true);
          expect(event.detail.showCloseButton).toBe(false);
          expect(event.detail.hideLogo).toBe(true);
          expect(typeof event.detail.actionBackButton).toBe('function');
          expect(typeof event.detail.actionCloseButton).toBe('function');
        }
        done();
      }, 10);
    });

    it('should navigate to solicitudes when actionBackButton is called', (done) => {
      spyOn(window, 'dispatchEvent').and.callFake((event: Event) => {
        if (event instanceof CustomEvent && event.type === 'customizeHeaderEvent') {
          event.detail.actionBackButton();
        }
        return true;
      });
      
      component.ngOnInit();
      
      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/solicitudes']);
        done();
      }, 10);
    });

    it('should navigate to solicitudes when actionCloseButton is called', (done) => {
      spyOn(window, 'dispatchEvent').and.callFake((event: Event) => {
        if (event instanceof CustomEvent && event.type === 'customizeHeaderEvent') {
          event.detail.actionCloseButton();
        }
        return true;
      });
      
      component.ngOnInit();
      
      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/solicitudes']);
        done();
      }, 10);
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch customizeHeaderEvent with reset values', () => {
      const dispatchSpy = spyOn(window, 'dispatchEvent');
      
      component.ngOnDestroy();
      
      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.calls.mostRecent().args[0] as CustomEvent;
      expect(event.type).toBe('customizeHeaderEvent');
      expect(event.detail.title).toBe('');
      expect(event.detail.showBackButton).toBe(false);
      expect(event.detail.showCloseButton).toBe(false);
      expect(event.detail.hideLogo).toBe(false);
    });
  });

  describe('filtrarPorPeriodo - edge cases', () => {
    it('should handle date at start of day boundary in custom range', () => {
      component.filtroPeriodo = 1;
      component.selectedRange = [new Date('2024-06-01'), new Date('2024-06-10')];
      
      const result = component.filtrarPorPeriodo('2024-06-01');
      
      expect(result).toBe(true);
    });

    it('should handle date within custom range', () => {
      component.filtroPeriodo = 1;
      component.selectedRange = [new Date('2024-06-01'), new Date('2024-06-10')];
      
      const result = component.filtrarPorPeriodo('2024-06-05');
      
      expect(result).toBe(true);
    });

    it('should return false for date clearly before custom range', () => {
      component.filtroPeriodo = 1;
      component.selectedRange = [new Date('2024-06-05'), new Date('2024-06-15')];
      
      const result = component.filtrarPorPeriodo('2024-06-01');
      
      expect(result).toBe(false);
    });

    it('should return false for date clearly after custom range', () => {
      component.filtroPeriodo = 1;
      component.selectedRange = [new Date('2024-06-01'), new Date('2024-06-10')];
      
      const result = component.filtrarPorPeriodo('2024-06-20');
      
      expect(result).toBe(false);
    });

    it('should filter correctly by days when filtroPeriodo is larger number', () => {
      component.filtroPeriodo = 30;
      component.fechaActual = new Date('2024-06-30');
      
      // Date within 30 days
      expect(component.filtrarPorPeriodo('2024-06-15')).toBe(true);
      
      // Date before 30 days ago
      expect(component.filtrarPorPeriodo('2024-05-01')).toBe(false);
    });

    it('should handle date exactly at limit boundary', () => {
      component.filtroPeriodo = 7;
      component.fechaActual = new Date('2024-06-15');
      
      // Date exactly 7 days ago should be at the boundary
      const result = component.filtrarPorPeriodo('2024-06-08');
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('borrarFiltrosYCerrar - additional cases', () => {
    beforeEach(() => {
      component.prestamo = {
        detallePrestamo: {
          cuotas: {
            listado: []
          }
        }
      } as any;
    });

    it('should reset all filters when no tipo is provided', () => {
      component.filtroEstado = 'Pagada';
      component.filtroPeriodo = 7;
      component.selectedRange = [new Date(), new Date()];
      
      component.borrarFiltrosYCerrar();
      
      expect(component.filtroPeriodo).toBeNull();
      expect(component.filtroEstado).toBeNull();
      expect(component.selectedRange).toEqual([null, null]);
    });
  });

  describe('cerrarMenuEstado - edge cases', () => {
    it('should not throw when menuEstado is undefined', () => {
      component.menuEstado = undefined;
      
      expect(() => component.cerrarMenuEstado()).not.toThrow();
    });

    it('should not throw when menuEstado has no menuService', () => {
      component.menuEstado = {};
      
      expect(() => component.cerrarMenuEstado()).not.toThrow();
    });

    it('should call menuService.close when menuEstado has menuService', () => {
      const closeSpy = jasmine.createSpy('close');
      component.menuEstado = { menuService: { close: closeSpy } };
      
      component.cerrarMenuEstado();
      
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('cerrarMenuPeriodo - edge cases', () => {
    it('should not throw when menuPeriodo is undefined', () => {
      component.menuPeriodo = undefined;
      spyOn(component, 'closeCalendar');
      
      expect(() => component.cerrarMenuPeriodo()).not.toThrow();
      expect(component.closeCalendar).toHaveBeenCalled();
    });

    it('should not throw when menuPeriodo has no menuService', () => {
      component.menuPeriodo = {};
      spyOn(component, 'closeCalendar');
      
      expect(() => component.cerrarMenuPeriodo()).not.toThrow();
      expect(component.closeCalendar).toHaveBeenCalled();
    });

    it('should call menuService.close when menuPeriodo has menuService', () => {
      const closeSpy = jasmine.createSpy('close');
      component.menuPeriodo = { menuService: { close: closeSpy } };
      spyOn(component, 'closeCalendar');
      
      component.cerrarMenuPeriodo();
      
      expect(closeSpy).toHaveBeenCalled();
      expect(component.closeCalendar).toHaveBeenCalled();
    });
  });
});
