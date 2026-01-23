import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudInfoModalContentComponent } from './solicitud-info-modal-content.component';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberFormat' })
class MockNumberFormatPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('SolicitudInfoModalContentComponent', () => {
  let component: SolicitudInfoModalContentComponent;
  let fixture: ComponentFixture<SolicitudInfoModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudInfoModalContentComponent, MockNumberFormatPipe ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudInfoModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default montoInscripcionSource as vehiculo', () => {
    expect(component.montoInscripcionSource).toBe('vehiculo');
  });

  describe('getMontoInscripcion', () => {
    it('should return valorVehiculo when source is vehiculo', () => {
      component.montoInscripcionSource = 'vehiculo';
      component.solicitud = {
        vehiculo: {
          valorVehiculo: 5000000
        },
        solicitud: {
          montoInscripcionPrenda: 3000000
        }
      };
      expect(component.getMontoInscripcion()).toBe(5000000);
    });

    it('should return montoInscripcionPrenda when source is solicitud', () => {
      component.montoInscripcionSource = 'solicitud';
      component.solicitud = {
        vehiculo: {
          valorVehiculo: 5000000
        },
        solicitud: {
          montoInscripcionPrenda: 3000000
        }
      };
      expect(component.getMontoInscripcion()).toBe(3000000);
    });

    it('should return undefined when solicitud is null and source is vehiculo', () => {
      component.montoInscripcionSource = 'vehiculo';
      component.solicitud = null;
      expect(component.getMontoInscripcion()).toBeUndefined();
    });

    it('should return undefined when solicitud is null and source is solicitud', () => {
      component.montoInscripcionSource = 'solicitud';
      component.solicitud = null;
      expect(component.getMontoInscripcion()).toBeUndefined();
    });

    it('should return undefined when vehiculo is missing and source is vehiculo', () => {
      component.montoInscripcionSource = 'vehiculo';
      component.solicitud = {
        solicitud: {
          montoInscripcionPrenda: 3000000
        }
      };
      expect(component.getMontoInscripcion()).toBeUndefined();
    });

    it('should return undefined when solicitud.solicitud is missing and source is solicitud', () => {
      component.montoInscripcionSource = 'solicitud';
      component.solicitud = {
        vehiculo: {
          valorVehiculo: 5000000
        }
      };
      expect(component.getMontoInscripcion()).toBeUndefined();
    });

    it('should return undefined when valorVehiculo is missing', () => {
      component.montoInscripcionSource = 'vehiculo';
      component.solicitud = {
        vehiculo: {}
      };
      expect(component.getMontoInscripcion()).toBeUndefined();
    });

    it('should return undefined when montoInscripcionPrenda is missing', () => {
      component.montoInscripcionSource = 'solicitud';
      component.solicitud = {
        solicitud: {}
      };
      expect(component.getMontoInscripcion()).toBeUndefined();
    });
  });

  it('should accept solicitud input', () => {
    const mockSolicitud = { id: 123 };
    component.solicitud = mockSolicitud;
    expect(component.solicitud).toEqual(mockSolicitud);
  });

  it('should accept montoInscripcionSource input', () => {
    component.montoInscripcionSource = 'solicitud';
    expect(component.montoInscripcionSource).toBe('solicitud');
  });
});
