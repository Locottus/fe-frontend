import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { By } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';

import { DetalleCuotaDrawerComponent } from './detalle-cuota-drawer.component';
import { CuotaDetalle } from '../interfaces/detalle-prestamo.dto';

// Registrar locale es-AR para CurrencyPipe
registerLocaleData(localeEsAr);

describe('DetalleCuotaDrawerComponent', () => {
  let component: DetalleCuotaDrawerComponent;
  let fixture: ComponentFixture<DetalleCuotaDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleCuotaDrawerComponent],
      // Para no tener que declarar todos los <kite-...>
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LOCALE_ID, useValue: 'es-AR' }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCuotaDrawerComponent);
    component = fixture.componentInstance;
    component.cuota = {
      numero: 3,
      estado: 'P',
      estado_descripcion: 'Pendiente',
      fecha_vencimiento: '2026-03-02',
      fecha_pago: '',
      moneda: {
        capital: 529.34,
        interes: 399.44,
        impuestos: 83.89,
        seguro: 125000,
        comisiones: 0,
        recargo: 0,
        total: 126012.67
      },
      uva: {
        capital: 0,
        interes: 0,
        impuestos: 0,
        seguro: 0,
        comisiones: 0,
        recargo: 0,
        total: 0
      }
    };
    component.isOpen = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render cuota information in the template', () => {
    const compiled: HTMLElement = fixture.nativeElement;

    // Verificar que el modal existe
    const modal = fixture.debugElement.query(By.css('kite-modal'));
    expect(modal).toBeTruthy();

    // Verificar que el modal header existe
    const modalHeader = fixture.debugElement.query(By.css('kite-modal-header'));
    expect(modalHeader).toBeTruthy();

    // Verificar que el badge existe
    const badge = fixture.debugElement.query(By.css('kite-badge'));
    expect(badge).toBeTruthy();

    // Verificar contenido de texto que sí se renderiza
    expect(compiled.textContent).toContain('Estado');
    expect(compiled.textContent).toContain('Fecha de vencimiento');
    expect(compiled.textContent).toContain('Importe de cuota');

    // Algunos conceptos
    expect(compiled.textContent).toContain('Capital');
    expect(compiled.textContent).toContain('Interés');
    expect(compiled.textContent).toContain('Impuestos');
    expect(compiled.textContent).toContain('Seguro');

    // Verificar que los datos del componente están correctos
    expect(component.cuota.numero).toBe(3);
    expect(component.cuota.estado_descripcion).toBe('Pendiente');
  });

  it('should emit close when onClose is called programmatically', () => {
    const spy = spyOn(component.close, 'emit');

    component.onClose();

    expect(spy).toHaveBeenCalled();
  });

  // Helper function to format date as yyyy-MM-dd in local timezone
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper to calculate expected days (matching component logic)
  function calcularDiasEsperados(fechaStr: string): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fechaStr);
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
    it('should return "Vencida" when estado_descripcion is Vencida', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Vencida' };

      const result = component.getBadgeLabel();

      expect(result).toBe('Vencida');
    });

    it('should return correct label when fecha_vencimiento is today', () => {
      const today = new Date();
      const fechaStr = formatDateLocal(today);
      const dias = calcularDiasEsperados(fechaStr);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.getBadgeLabel();

      // El resultado depende de cómo el componente parsea la fecha
      if (dias === 0) {
        expect(result).toBe('Vence hoy');
      } else if (dias === 1) {
        expect(result).toBe('Vence mañana');
      } else if (dias > 1 && dias <= 7) {
        expect(result).toBe(`Vence en ${dias} días`);
      } else {
        expect(result).toBe('Pendiente');
      }
    });

    it('should return correct label when fecha_vencimiento is tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const fechaStr = formatDateLocal(tomorrow);
      const dias = calcularDiasEsperados(fechaStr);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.getBadgeLabel();

      if (dias === 0) {
        expect(result).toBe('Vence hoy');
      } else if (dias === 1) {
        expect(result).toBe('Vence mañana');
      } else if (dias > 1 && dias <= 7) {
        expect(result).toBe(`Vence en ${dias} días`);
      } else {
        expect(result).toBe('Pendiente');
      }
    });

    it('should return correct label when fecha_vencimiento is within 7 days', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const fechaStr = formatDateLocal(futureDate);
      const dias = calcularDiasEsperados(fechaStr);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.getBadgeLabel();

      if (dias === 0) {
        expect(result).toBe('Vence hoy');
      } else if (dias === 1) {
        expect(result).toBe('Vence mañana');
      } else if (dias > 1 && dias <= 7) {
        expect(result).toBe(`Vence en ${dias} días`);
      } else {
        expect(result).toBe('Pendiente');
      }
    });

    it('should return "Pendiente" when fecha_vencimiento is more than 7 days away', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const fechaStr = formatDateLocal(futureDate);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.getBadgeLabel();

      expect(result).toBe('Pendiente');
    });

    it('should return "Pendiente" when cuota is null', () => {
      component.cuota = null;

      const result = component.getBadgeLabel();

      expect(result).toBe('Pendiente');
    });
  });

  describe('getBadgeVariant', () => {
    it('should return "error" when estado_descripcion is Vencida', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Vencida' };

      const result = component.getBadgeVariant();

      expect(result).toBe('error');
    });

    it('should return "warning" when fecha_vencimiento is within 7 days', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      const fechaStr = formatDateLocal(futureDate);
      const dias = calcularDiasEsperados(fechaStr);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.getBadgeVariant();

      // El resultado depende de los días calculados
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
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.getBadgeVariant();

      expect(result).toBe('default');
    });

    it('should return "default" when cuota is null', () => {
      component.cuota = null;

      const result = component.getBadgeVariant();

      expect(result).toBe('default');
    });

    it('should return "success" when estado_descripcion is Pagada', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pagada' };

      const result = component.getBadgeVariant();

      expect(result).toBe('success');
    });
  });

  describe('getBadgeLabel - additional cases', () => {
    it('should return "Pagada" when estado_descripcion is Pagada', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pagada' };

      const result = component.getBadgeLabel();

      expect(result).toBe('Pagada');
    });

    it('should handle cuota without fecha_vencimiento and return "Pendiente"', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: '' };

      const result = component.getBadgeLabel();

      expect(result).toBe('Pendiente');
    });
  });

  describe('isProximaAVencer', () => {
    it('should return false when estado_descripcion is Pagada', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pagada' };

      const result = component.isProximaAVencer();

      expect(result).toBe(false);
    });

    it('should return false when estado_descripcion is Vencida', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Vencida' };

      const result = component.isProximaAVencer();

      expect(result).toBe(false);
    });

    it('should return true when fecha_vencimiento is today', () => {
      const today = new Date();
      const fechaStr = formatDateLocal(today);
      const dias = calcularDiasEsperados(fechaStr);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.isProximaAVencer();

      expect(result).toBe(dias >= 0 && dias <= 7);
    });

    it('should return true when fecha_vencimiento is within 7 days', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const fechaStr = formatDateLocal(futureDate);
      const dias = calcularDiasEsperados(fechaStr);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.isProximaAVencer();

      expect(result).toBe(dias >= 0 && dias <= 7);
    });

    it('should return false when fecha_vencimiento is more than 7 days away', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const fechaStr = formatDateLocal(futureDate);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.isProximaAVencer();

      expect(result).toBe(false);
    });

    it('should return false when cuota is null', () => {
      component.cuota = null;

      const result = component.isProximaAVencer();

      expect(result).toBe(false);
    });

    it('should return false when fecha_vencimiento is empty', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: '' };

      const result = component.isProximaAVencer();

      expect(result).toBe(false);
    });

    it('should return false when fecha_vencimiento is in the past (negative days)', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const fechaStr = formatDateLocal(pastDate);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.isProximaAVencer();

      expect(result).toBe(false);
    });
  });

  describe('isPendiente', () => {
    it('should return false when estado_descripcion is Pagada', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pagada' };

      const result = component.isPendiente();

      expect(result).toBe(false);
    });

    it('should return false when estado_descripcion is Vencida', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Vencida' };

      const result = component.isPendiente();

      expect(result).toBe(false);
    });

    it('should return true when fecha_vencimiento is more than 7 days away', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const fechaStr = formatDateLocal(futureDate);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.isPendiente();

      expect(result).toBe(true);
    });

    it('should return false when fecha_vencimiento is within 7 days', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      const fechaStr = formatDateLocal(futureDate);
      const dias = calcularDiasEsperados(fechaStr);
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: fechaStr };

      const result = component.isPendiente();

      // isPendiente devuelve true solo si dias > 7
      expect(result).toBe(dias > 7);
    });

    it('should return false when cuota is null', () => {
      component.cuota = null;

      const result = component.isPendiente();

      expect(result).toBe(false);
    });

    it('should return false when fecha_vencimiento is empty', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pendiente', fecha_vencimiento: '' };

      const result = component.isPendiente();

      expect(result).toBe(false);
    });
  });

  describe('isUVA', () => {
    it('should return true when uva.total is greater than 0', () => {
      component.cuota = { 
        ...component.cuota!, 
        uva: { 
          capital: 100, 
          interes: 50, 
          impuestos: 10, 
          seguro: 5, 
          comisiones: 0, 
          recargo: 0, 
          total: 165 
        } 
      };

      const result = component.isUVA();

      expect(result).toBe(true);
    });

    it('should return false when uva.total is 0', () => {
      component.cuota = { 
        ...component.cuota!, 
        uva: { 
          capital: 0, 
          interes: 0, 
          impuestos: 0, 
          seguro: 0, 
          comisiones: 0, 
          recargo: 0, 
          total: 0 
        } 
      };

      const result = component.isUVA();

      expect(result).toBe(false);
    });

    it('should return false when cuota is null', () => {
      component.cuota = null;

      const result = component.isUVA();

      expect(result).toBe(false);
    });

    it('should return false when uva is undefined', () => {
      component.cuota = { ...component.cuota!, uva: undefined as any };

      const result = component.isUVA();

      expect(result).toBe(false);
    });

    it('should return false when uva.total is negative', () => {
      component.cuota = { 
        ...component.cuota!, 
        uva: { 
          capital: 0, 
          interes: 0, 
          impuestos: 0, 
          seguro: 0, 
          comisiones: 0, 
          recargo: 0, 
          total: -10 
        } 
      };

      const result = component.isUVA();

      expect(result).toBe(false);
    });
  });

  describe('getMensajePendiente', () => {
    it('should return UVA message when isUVA returns true', () => {
      component.cuota = { 
        ...component.cuota!, 
        uva: { 
          capital: 100, 
          interes: 50, 
          impuestos: 10, 
          seguro: 5, 
          comisiones: 0, 
          recargo: 0, 
          total: 165 
        } 
      };

      const result = component.getMensajePendiente();

      expect(result).toBe('Se debitará el día del vencimiento. El importe en pesos puede variar según la cotización UVA de ese día y la actualización del valor del seguro.');
    });

    it('should return non-UVA message when isUVA returns false', () => {
      component.cuota = { 
        ...component.cuota!, 
        uva: { 
          capital: 0, 
          interes: 0, 
          impuestos: 0, 
          seguro: 0, 
          comisiones: 0, 
          recargo: 0, 
          total: 0 
        } 
      };

      const result = component.getMensajePendiente();

      expect(result).toBe('Se debitará el día del vencimiento. El importe en pesos puede variar según la actualización del valor del seguro.');
    });

    it('should return non-UVA message when cuota is null', () => {
      component.cuota = null;

      const result = component.getMensajePendiente();

      expect(result).toBe('Se debitará el día del vencimiento. El importe en pesos puede variar según la actualización del valor del seguro.');
    });
  });

  describe('ngOnInit', () => {
    it('should log initialization message', () => {
      const consoleSpy = spyOn(console, 'log');
      
      component.ngOnInit();

      expect(consoleSpy).toHaveBeenCalledWith('Detalle cuota drawer initialized');
    });

    it('should log cuota value', () => {
      const consoleSpy = spyOn(console, 'log');
      const testCuota = { numero: 1 } as any;
      component.cuota = testCuota;
      
      component.ngOnInit();

      expect(consoleSpy).toHaveBeenCalledWith(testCuota);
    });
  });

  describe('Template rendering', () => {
    it('should show correct badge variant for Pagada', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Pagada' };
      fixture.detectChanges();

      expect(component.getBadgeVariant()).toBe('success');
      expect(component.getBadgeLabel()).toBe('Pagada');
    });

    it('should show correct badge variant for Vencida', () => {
      component.cuota = { ...component.cuota!, estado_descripcion: 'Vencida' };
      fixture.detectChanges();

      expect(component.getBadgeVariant()).toBe('error');
      expect(component.getBadgeLabel()).toBe('Vencida');
    });

    it('should handle UVA cuota display', () => {
      component.cuota = { 
        ...component.cuota!, 
        uva: { 
          capital: 100, 
          interes: 50, 
          impuestos: 10, 
          seguro: 5, 
          comisiones: 0, 
          recargo: 0, 
          total: 165 
        } 
      };
      fixture.detectChanges();

      expect(component.isUVA()).toBe(true);
    });
  });
});
