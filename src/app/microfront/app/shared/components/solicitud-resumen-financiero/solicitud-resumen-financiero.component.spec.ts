import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudResumenFinancieroComponent } from './solicitud-resumen-financiero.component';
import { Pipe, PipeTransform, SimpleChange, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetalleSolicitudService } from 'src/app/modules/rodados/services/detalle-solicitud.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { of } from 'rxjs';
import { Cuenta } from '../seleccionar-cuenta-drawer/seleccionar-cuenta-drawer.component';

@Pipe({ name: 'numberFormat' })
class MockNumberFormatPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('SolicitudResumenFinancieroComponent', () => {
  let component: SolicitudResumenFinancieroComponent;
  let fixture: ComponentFixture<SolicitudResumenFinancieroComponent>;
  let mockDetalleSolicitudService: jasmine.SpyObj<DetalleSolicitudService>;

  const mockCuentasFromSolicitud = [
    {
      cuenta: '123456789',
      tipo: { descripcion: 'Caja de Ahorro', codigo: 'CA' },
      saldo: '50000.50',
      moneda: { descripcion: 'Pesos', simbolo: '$', codigo: 'ARS' },
      idCuentaVista: '12345678-1234-1234-1234-123456789012'
    },
    {
      cuenta: '987654321',
      tipo: { descripcion: 'Cuenta Corriente', codigo: 'CC' },
      saldo: '100000',
      moneda: { simbolo: 'USD', codigo: 'USD' },
      idCuentaVista: '87654321-4321-4321-4321-210987654321'
    }
  ];

  const mockSolicitudConCuentas = {
    id: 'OBI-12345',
    monto: 100000,
    cuentas: mockCuentasFromSolicitud
  };

  beforeEach(async () => {
    mockDetalleSolicitudService = jasmine.createSpyObj('DetalleSolicitudService', ['asignarCuentaAcreditacion']);
    mockDetalleSolicitudService.asignarCuentaAcreditacion.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SolicitudResumenFinancieroComponent, MockNumberFormatPipe],
      providers: [
        { provide: DetalleSolicitudService, useValue: mockDetalleSolicitudService },
        SettingsService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudResumenFinancieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
  
  describe('ngOnInit', () => {
    it('should call cargarCuentasDeSolicitud on init', () => {
      component.solicitud = mockSolicitudConCuentas;
      component.ngOnInit();
      expect(component['cuentasDeSolicitud'].length).toBe(2);
    });

    it('should not fail when solicitud is null', () => {
      component.solicitud = null;
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('ngOnChanges', () => {
    it('should reload cuentas when solicitud changes (not first change)', () => {
      component.solicitud = mockSolicitudConCuentas;
      const changes = {
        solicitud: new SimpleChange(null, mockSolicitudConCuentas, false)
      };
      component.ngOnChanges(changes);
      expect(component['cuentasDeSolicitud'].length).toBe(2);
    });

    it('should not reload cuentas on first change', () => {
      const spy = spyOn<any>(component, 'cargarCuentasDeSolicitud');
      const changes = {
        solicitud: new SimpleChange(null, mockSolicitudConCuentas, true)
      };
      component.ngOnChanges(changes);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should handle changes without solicitud property', () => {
      const changes = {};
      expect(() => component.ngOnChanges(changes)).not.toThrow();
    });
  });

  describe('cargarCuentasDeSolicitud', () => {
    it('should map cuentas from solicitud correctly', () => {
      component.solicitud = mockSolicitudConCuentas;
      component['cargarCuentasDeSolicitud']();
      
      expect(component['cuentasDeSolicitud'].length).toBe(2);
      expect(component['cuentasDeSolicitud'][0].id).toBe('123456789');
      expect(component['cuentasDeSolicitud'][0].descripcion).toBe('CA ARS');
    });

    it('should select first cuenta when no cuenta is selected', () => {
      component.cuentaSeleccionadaActual = null;
      component.solicitud = mockSolicitudConCuentas;
      component['cargarCuentasDeSolicitud']();
      
      expect(component.cuentaSeleccionadaActual).not.toBeNull();
    });

    it('should select cuenta preferida if exists', () => {
      const solicitudConPreferida = {
        ...mockSolicitudConCuentas,
        cuentas: [
          { cuenta: 'normal-123', tipo: { descripcion: 'Normal', codigo: 'NOR' }, saldo: '100', moneda: { descripcion: 'ARS', codigo: 'ARS' }, preferida: false },
          { cuenta: 'preferida-456', tipo: { descripcion: 'Preferida', codigo: 'PREF' }, saldo: '200', moneda: { descripcion: 'ARS', codigo: 'ARS' }, preferida: true }
        ]
      };
      component.cuentaSeleccionadaActual = null;
      component.solicitud = solicitudConPreferida;
      component['cargarCuentasDeSolicitud']();
      
      expect(component.cuentaSeleccionadaActual?.id).toBe('preferida-456');
    });

    it('should not change cuenta if already selected', () => {
      const existingCuenta: Cuenta = { id: 'existing-123', descripcion: 'Existing', saldo: 1000, moneda: 'ARS' };
      component.cuentaSeleccionadaActual = existingCuenta;
      component.solicitud = mockSolicitudConCuentas;
      component['cargarCuentasDeSolicitud']();
      
      expect(component.cuentaSeleccionadaActual).toEqual(existingCuenta);
    });

    it('should handle solicitud without cuentas array', () => {
      component.solicitud = { id: 1 };
      expect(() => component['cargarCuentasDeSolicitud']()).not.toThrow();
    });

    it('should handle solicitud with null cuentas', () => {
      component.solicitud = { id: 1, cuentas: null };
      expect(() => component['cargarCuentasDeSolicitud']()).not.toThrow();
    });

    it('should handle empty cuentas array', () => {
      component.solicitud = { id: 1, cuentas: [] };
      component['cargarCuentasDeSolicitud']();
      expect(component['cuentasDeSolicitud'].length).toBe(0);
    });
  });

  describe('mapCuentasFromSolicitud', () => {
    it('should map cuenta with all fields correctly', () => {
      const cuentas = [mockCuentasFromSolicitud[0]];
      const result = component['mapCuentasFromSolicitud'](cuentas as any);
      expect(result[0].id).toBe('123456789');
      expect(result[0].descripcion).toBe('CA ARS');
      expect(result[0].saldo).toBe(50000.50);
      // El campo moneda es el objeto completo, no el string 'ARS'
      expect(result[0].moneda).toEqual({ descripcion: 'Pesos', simbolo: '$', codigo: 'ARS' });
    });

    // Eliminado test 'should use codigo from moneda object' por instrucción del usuario

    it('should handle cuenta without tipo', () => {
      const cuentas = [{ cuenta: '111', saldo: '100', moneda: { descripcion: 'ARS', codigo: 'ARS' } }];
      const result = component['mapCuentasFromSolicitud'](cuentas as any);
      
      expect(result[0].descripcion).toBe('ARS');
    });

    it('should handle cuenta without saldo', () => {
      const cuentas = [{ cuenta: '111', tipo: { descripcion: 'Test' }, moneda: { descripcion: 'ARS' } }];
      const result = component['mapCuentasFromSolicitud'](cuentas as any);
      
      expect(result[0].saldo).toBe(0);
    });

    it('should handle cuenta without moneda', () => {
      const cuentas = [{ cuenta: '111', tipo: { descripcion: 'Test' }, saldo: '100' }];
      const result = component['mapCuentasFromSolicitud'](cuentas as any);
      // El campo moneda será undefined si no existe en la cuenta
      expect(result[0].moneda).toBeUndefined();
    });

    it('should generate fallback id when cuenta is missing', () => {
      const cuentas = [{ tipo: { descripcion: 'Test' }, saldo: '100', moneda: { descripcion: 'ARS' } }];
      const result = component['mapCuentasFromSolicitud'](cuentas as any);
      
      expect(result[0].id).toBe('cuenta-0');
    });
  });

  describe('cuentaSeleccionadaId getter', () => {
    it('should return id of selected cuenta', () => {
      component.cuentaSeleccionadaActual = { id: 'test-123', descripcion: 'Test', saldo: 100, moneda: 'ARS' };
      expect(component.cuentaSeleccionadaId).toBe('test-123');
    });

    it('should return first cuenta id when no cuenta selected', () => {
      component.cuentaSeleccionadaActual = null;
      component.cuentasDisponibles = [{ id: 'first-123', descripcion: 'First', saldo: 100, moneda: 'ARS' }];
      expect(component.cuentaSeleccionadaId).toBe('first-123');
    });

    it('should return null when no cuentas available', () => {
      component.cuentaSeleccionadaActual = null;
      component.cuentasDisponibles = [];
      component['cuentasDeSolicitud'] = [];
      expect(component.cuentaSeleccionadaId).toBeNull();
    });
  });

  describe('cuentasParaMostrar getter', () => {
    it('should return cuentasDisponibles when provided', () => {
      const cuentasInput: Cuenta[] = [{ id: 'input-1', descripcion: 'Input', saldo: 100, moneda: 'ARS' }];
      component.cuentasDisponibles = cuentasInput;
      expect(component.cuentasParaMostrar).toEqual(cuentasInput);
    });

    it('should return cuentasDeSolicitud when cuentasDisponibles is empty', () => {
      component.cuentasDisponibles = [];
      component.solicitud = mockSolicitudConCuentas;
      component['cargarCuentasDeSolicitud']();
      
      expect(component.cuentasParaMostrar.length).toBe(2);
      expect(component.cuentasParaMostrar[0].id).toBe('123456789');
    });
  });

  describe('cuentaSeleccionadaDescripcion getter', () => {
    it('should return description of selected cuenta', () => {
      component.cuentaSeleccionadaActual = { id: 'test', descripcion: 'Mi Cuenta Test', saldo: 100, moneda: 'ARS' };
      expect(component.cuentaSeleccionadaDescripcion).toBe('Mi Cuenta Test');
    });

    it('should return first cuenta description when no cuenta selected', () => {
      component.cuentaSeleccionadaActual = null;
      component.cuentasDisponibles = [{ id: 'first', descripcion: 'Primera Cuenta', saldo: 100, moneda: 'ARS' }];
      expect(component.cuentaSeleccionadaDescripcion).toBe('Primera Cuenta');
    });

    it('should return default message when no cuentas available', () => {
      component.cuentaSeleccionadaActual = null;
      component.cuentasDisponibles = [];
      component['cuentasDeSolicitud'] = [];
      expect(component.cuentaSeleccionadaDescripcion).toBe('Sin cuenta asignada');
    });

    it('should return fallback string when descripcion is falsy', () => {
      // descripcion es undefined
      component.cuentaSeleccionadaActual = {
        id: 'id-1',
        descripcion: undefined,
        saldo: 100,
        moneda: 'USD',
        idCuentaVista: 'vista-1',
        tipo: { codigo: 'CA' }
      } as any;
      expect(component.cuentaSeleccionadaDescripcion).toBe('CA USD vista-1');

      // descripcion es null
      component.cuentaSeleccionadaActual = {
        id: 'id-2',
        descripcion: null,
        saldo: 100,
        moneda: 'ARS',
        idCuentaVista: 'vista-2',
        tipo: { codigo: 'CA' }
      } as any;
      expect(component.cuentaSeleccionadaDescripcion).toBe('CA ARS vista-2');

      // descripcion es string vacío
      component.cuentaSeleccionadaActual = {
        id: 'id-3',
        descripcion: '',
        saldo: 100,
        moneda: 'ARS',
        idCuentaVista: undefined,
        tipo: { codigo: 'CA' }
      } as any;
      expect(component.cuentaSeleccionadaDescripcion).toBe('CA ARS id-3');
    });

    it('should use DTO original when cuentaSeleccionada has insufficient data', () => {
      // La cuenta seleccionada no tiene tipo, moneda ni idCuentaVista
      component.cuentaSeleccionadaActual = {
        id: 'dto-1',
        descripcion: '',
        saldo: 100
      } as any;
      component.solicitud = {
        cuentas: [
          {
            cuenta: 'dto-1',
            tipo: { codigo: 'TIPO-DTO' },
            moneda: { codigo: 'MONEDA-DTO' },
            idCuentaVista: 'vista-dto-1'
          }
        ]
      };
      expect(component.cuentaSeleccionadaDescripcion).toBe('TIPO-DTO MONEDA-DTO vista-dto-1');
    });
  });

  describe('onModificarCuenta', () => {
    it('should open drawer', () => {
      component.isDrawerOpen = false;
      component.onModificarCuenta();
      expect(component.isDrawerOpen).toBeTrue();
    });
  });

  describe('onDrawerClose', () => {
    it('should close drawer', () => {
      component.isDrawerOpen = true;
      component.onDrawerClose();
      expect(component.isDrawerOpen).toBeFalse();
    });
  });

  describe('onCuentaModificada', () => {
    beforeEach(() => {
      component.solicitud = { id: 1 };
    });

    it('should update selected cuenta', () => {
      const nuevaCuenta: Cuenta = { id: 'nueva-123', descripcion: 'Nueva Cuenta', saldo: 5000, moneda: 'USD', idCuentaVista: 'vista-123' };
      component.onCuentaModificada(nuevaCuenta);
      expect(component.cuentaSeleccionadaActual).toEqual(nuevaCuenta);
    });

    it('should emit cuentaCambiada event', () => {
      const nuevaCuenta: Cuenta = { id: 'nueva-123', descripcion: 'Nueva Cuenta', saldo: 5000, moneda: 'USD', idCuentaVista: 'vista-123' };
      spyOn(component.cuentaCambiada, 'emit');
      component.onCuentaModificada(nuevaCuenta);
      expect(component.cuentaCambiada.emit).toHaveBeenCalledWith(nuevaCuenta);
    });

    it('should close drawer after selecting cuenta', () => {
      component.isDrawerOpen = true;
      const nuevaCuenta: Cuenta = { id: 'nueva-123', descripcion: 'Nueva Cuenta', saldo: 5000, moneda: 'USD', idCuentaVista: 'vista-123' };
      component.onCuentaModificada(nuevaCuenta);
      expect(component.isDrawerOpen).toBeFalse();
    });
  });

  describe('displayDate', () => {
    it('should return empty string for null value', () => {
      expect(component.displayDate(null)).toBe('');
    });

    it('should return empty string for undefined value', () => {
      expect(component.displayDate(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(component.displayDate('')).toBe('');
    });

    it('should format ISO datetime string (with T) correctly', () => {
      const isoDate = '2024-12-25T10:30:00';
      expect(component.displayDate(isoDate)).toBe('25/12/2024');
    });

    it('should format ISO datetime with timezone correctly', () => {
      const isoDate = '2024-01-15T14:30:00.000Z';
      expect(component.displayDate(isoDate)).toBe('15/01/2024');
    });

    it('should format ISO date string (YYYY-MM-DD) correctly', () => {
      const isoDate = '2024-12-25';
      expect(component.displayDate(isoDate)).toBe('25/12/2024');
    });

    it('should return value as-is if already formatted', () => {
      const formattedDate = '25/12/2024';
      expect(component.displayDate(formattedDate)).toBe('25/12/2024');
    });

    it('should return value as-is for unexpected format', () => {
      const unexpectedFormat = 'Dec 25, 2024';
      expect(component.displayDate(unexpectedFormat)).toBe('Dec 25, 2024');
    });
  });

  describe('Input/Output bindings', () => {
    it('should accept solicitud input', () => {
      const mockSolicitud = { id: 1, monto: 100000 };
      component.solicitud = mockSolicitud;
      expect(component.solicitud).toEqual(mockSolicitud);
    });

    it('should accept cuentasDisponibles input', () => {
      const cuentas: Cuenta[] = [{ id: '1', descripcion: 'Test', saldo: 100, moneda: 'ARS' }];
      component.cuentasDisponibles = cuentas;
      expect(component.cuentasDisponibles).toEqual(cuentas);
    });

    it('should have default empty array for cuentasDisponibles', () => {
      const newComponent = new SolicitudResumenFinancieroComponent(mockDetalleSolicitudService);
      expect(newComponent.cuentasDisponibles).toEqual([]);
    });

    it('should have cuentaCambiada output emitter', () => {
      expect(component.cuentaCambiada).toBeDefined();
    });
  });

  describe('Initial state', () => {
    it('should have isDrawerOpen as false initially', () => {
      expect(component.isDrawerOpen).toBeFalse();
    });

    it('should have cuentaSeleccionadaActual as null initially', () => {
      const newFixture = TestBed.createComponent(SolicitudResumenFinancieroComponent);
      const newComponent = newFixture.componentInstance;
      expect(newComponent.cuentaSeleccionadaActual).toBeNull();
    });

    it('should have isUpdatingCuenta as false initially', () => {
      expect(component.isUpdatingCuenta).toBeFalse();
    });

    it('should have errorActualizarCuenta as null initially', () => {
      expect(component.errorActualizarCuenta).toBeNull();
    });
  });
});
