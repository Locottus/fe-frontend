import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionarCuentaDrawerComponent, Cuenta } from './seleccionar-cuenta-drawer.component';
import { KiteModule } from '../../../core/kite/kite.module';
import { CommonModule } from '@angular/common';

describe('SeleccionarCuentaDrawerComponent', () => {
  let component: SeleccionarCuentaDrawerComponent;
  let fixture: ComponentFixture<SeleccionarCuentaDrawerComponent>;

  const mockCuentas: Cuenta[] = [
    { id: '1', descripcion: 'CA ARS 100-584473-1', saldo: 0 },
    { id: '2', descripcion: 'CA ARS 100-584473-2', saldo: 1899 },
    { id: '3', descripcion: 'CA ARS 100-584473-3', saldo: 90229.66 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeleccionarCuentaDrawerComponent],
      imports: [CommonModule, KiteModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionarCuentaDrawerComponent);
    component = fixture.componentInstance;
    component.cuentas = mockCuentas;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when onClose is called', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should select account temporarily', () => {
    component.seleccionarCuenta(mockCuentas[1]);
    expect(component.cuentaSeleccionadaTemp).toBe('2');
  });

  it('should return true for selected account', () => {
    component.cuentaSeleccionadaTemp = '2';
    expect(component.esCuentaSeleccionada(mockCuentas[1])).toBeTrue();
    expect(component.esCuentaSeleccionada(mockCuentas[0])).toBeFalse();
  });

  it('should allow modification when different account is selected', () => {
    component.cuentaSeleccionadaId = '1';
    component.cuentaSeleccionadaTemp = '2';
    expect(component.puedeModificar()).toBeTrue();
  });

  it('should not allow modification when same account is selected', () => {
    component.cuentaSeleccionadaId = '1';
    component.cuentaSeleccionadaTemp = '1';
    component.seleccionAutomatica = false;
    expect(component.puedeModificar()).toBeFalse();
  });

  it('should emit cuentaModificada when confirmarModificacion is called', () => {
    spyOn(component.cuentaModificada, 'emit');
    spyOn(component.close, 'emit');
    
    component.cuentaSeleccionadaId = '1';
    component.cuentaSeleccionadaTemp = '2';
    component.confirmarModificacion();
    
    expect(component.cuentaModificada.emit).toHaveBeenCalledWith({ ...mockCuentas[1], preferida: true });
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should format saldo correctly', () => {
    const formatted = component.formatearSaldo(1234.56);
    expect(formatted).toContain('1.234,56');
  });

  describe('ngOnInit', () => {
    it('should initialize cuentaSeleccionadaTemp with cuentaSeleccionadaId', () => {
      component.cuentaSeleccionadaId = '3';
      component.ngOnInit();
      expect(component.cuentaSeleccionadaTemp).toBe('3');
    });

    it('should select first cuenta with positive saldo when cuentaSeleccionadaId is null', () => {
      component.cuentaSeleccionadaId = null;
      component.ngOnInit();
      // Primera cuenta con saldo > 0 es id '2' (saldo: 1899)
      expect(component.cuentaSeleccionadaTemp).toBe('2');
      expect(component.seleccionAutomatica).toBeTrue();
    });

    it('should select first cuenta when no cuenta has positive saldo and cuentaSeleccionadaId is null', () => {
      component.cuentas = [
        { id: '1', descripcion: 'Cuenta 1', saldo: 0 },
        { id: '2', descripcion: 'Cuenta 2', saldo: 0 }
      ];
      component.cuentaSeleccionadaId = null;
      component.ngOnInit();
      expect(component.cuentaSeleccionadaTemp).toBe('1');
      expect(component.seleccionAutomatica).toBeTrue();
    });

    it('should set cuentaSeleccionadaTemp as null when cuentas list is empty', () => {
      component.cuentas = [];
      component.cuentaSeleccionadaId = null;
      component.ngOnInit();
      expect(component.cuentaSeleccionadaTemp).toBeNull();
      expect(component.seleccionAutomatica).toBeFalse();
    });
  });

  describe('mapMonedaDescripcion', () => {
    it('should map "Pesos Argentinos" to "ARS"', () => {
      expect(component.mapMonedaDescripcion('Pesos Argentinos')).toBe('ARS');
    });
    it('should return the same value for other currencies', () => {
      expect(component.mapMonedaDescripcion('USD')).toBe('USD');
      expect(component.mapMonedaDescripcion('ARS')).toBe('ARS');
    });
    it('should return empty string for undefined or empty', () => {
      expect(component.mapMonedaDescripcion(undefined)).toBe('');
      expect(component.mapMonedaDescripcion('')).toBe('');
    });
  });
    
  describe('ngOnChanges', () => {
    it('should sync cuentaSeleccionadaTemp when cuentaSeleccionadaId changes (not first change)', () => {
      component.cuentaSeleccionadaId = '2';
      component.ngOnChanges({
        cuentaSeleccionadaId: {
          currentValue: '2',
          previousValue: '1',
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(component.cuentaSeleccionadaTemp).toBe('2');
    });

    it('should NOT sync cuentaSeleccionadaTemp on first change of cuentaSeleccionadaId', () => {
      component.cuentaSeleccionadaTemp = '1';
      component.cuentaSeleccionadaId = '2';
      component.ngOnChanges({
        cuentaSeleccionadaId: {
          currentValue: '2',
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });
      expect(component.cuentaSeleccionadaTemp).toBe('1');
    });

    it('should reset cuentaSeleccionadaTemp when isOpen changes to true', () => {
      component.cuentaSeleccionadaId = '3';
      component.cuentaSeleccionadaTemp = '1';
      component.ngOnChanges({
        isOpen: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(component.cuentaSeleccionadaTemp).toBe('3');
    });

    it('should NOT reset cuentaSeleccionadaTemp when isOpen changes to false', () => {
      component.cuentaSeleccionadaId = '3';
      component.cuentaSeleccionadaTemp = '1';
      component.ngOnChanges({
        isOpen: {
          currentValue: false,
          previousValue: true,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(component.cuentaSeleccionadaTemp).toBe('1');
    });

    it('should handle empty changes object', () => {
      component.cuentaSeleccionadaTemp = '1';
      component.ngOnChanges({});
      expect(component.cuentaSeleccionadaTemp).toBe('1');
    });
  });

  describe('onClose', () => {
    it('should reset cuentaSeleccionadaTemp to original value and emit close', () => {
      spyOn(component.close, 'emit');
      component.cuentaSeleccionadaId = '1';
      component.cuentaSeleccionadaTemp = '2';
      
      component.onClose();
      
      expect(component.cuentaSeleccionadaTemp).toBe('1');
      expect(component.close.emit).toHaveBeenCalled();
    });
  });

  describe('puedeModificar', () => {
    it('should return false when cuentaSeleccionadaTemp is null', () => {
      component.cuentaSeleccionadaTemp = null;
      component.cuentaSeleccionadaId = '1';
      component.seleccionAutomatica = false;
      expect(component.puedeModificar()).toBeFalse();
    });

    it('should return true when cuentaSeleccionadaTemp differs from cuentaSeleccionadaId', () => {
      component.cuentaSeleccionadaTemp = '2';
      component.cuentaSeleccionadaId = '1';
      expect(component.puedeModificar()).toBeTrue();
    });

    it('should return false when both are null', () => {
      component.cuentaSeleccionadaTemp = null;
      component.cuentaSeleccionadaId = null;
      component.seleccionAutomatica = false;
      expect(component.puedeModificar()).toBeFalse();
    });
  });

  describe('confirmarModificacion', () => {
    it('should NOT emit when puedeModificar returns false', () => {
      spyOn(component.cuentaModificada, 'emit');
      spyOn(component.close, 'emit');
      
      component.cuentaSeleccionadaId = '1';
      component.cuentaSeleccionadaTemp = '1'; // Same as original
      component.seleccionAutomatica = false;
      component.confirmarModificacion();
      
      expect(component.cuentaModificada.emit).not.toHaveBeenCalled();
      expect(component.close.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit when selected cuenta is not found', () => {
      spyOn(component.cuentaModificada, 'emit');
      spyOn(component.close, 'emit');
      
      component.cuentaSeleccionadaId = '1';
      component.cuentaSeleccionadaTemp = '999'; // Non-existent cuenta
      component.confirmarModificacion();
      
      expect(component.cuentaModificada.emit).not.toHaveBeenCalled();
      expect(component.close.emit).not.toHaveBeenCalled();
    });

    it('should emit cuentaModificada and close when valid cuenta is selected', () => {
      spyOn(component.cuentaModificada, 'emit');
      spyOn(component.close, 'emit');
      
      component.cuentaSeleccionadaId = '1';
      component.cuentaSeleccionadaTemp = '3';
      component.confirmarModificacion();
      
      expect(component.cuentaModificada.emit).toHaveBeenCalledWith({ ...mockCuentas[2], preferida: true });
      expect(component.close.emit).toHaveBeenCalled();
    });
  });

  describe('formatearSaldo', () => {
    it('should format zero saldo', () => {
      const formatted = component.formatearSaldo(0);
      expect(formatted).toContain('0,00');
    });

    it('should format negative saldo', () => {
      const formatted = component.formatearSaldo(-500.50);
      expect(formatted).toContain('500,50');
    });

    it('should format large saldo with thousand separators', () => {
      const formatted = component.formatearSaldo(1000000.99);
      expect(formatted).toContain('1.000.000,99');
    });
  });

  describe('seleccionarCuenta', () => {
    it('should update cuentaSeleccionadaTemp with cuenta id', () => {
      component.cuentaSeleccionadaTemp = null;
      component.seleccionarCuenta(mockCuentas[2]);
      expect(component.cuentaSeleccionadaTemp).toBe('3');
    });
  });

  describe('esCuentaSeleccionada', () => {
    it('should return false when cuentaSeleccionadaTemp is null', () => {
      component.cuentaSeleccionadaTemp = null;
      expect(component.esCuentaSeleccionada(mockCuentas[0])).toBeFalse();
    });
  });
});
