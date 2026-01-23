import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudResumenVehiculoComponent } from './solicitud-resumen-vehiculo.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudResumenVehiculoComponent', () => {
  let component: SolicitudResumenVehiculoComponent;
  let fixture: ComponentFixture<SolicitudResumenVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudResumenVehiculoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudResumenVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default showBusinessAvatar as true', () => {
    expect(component.showBusinessAvatar).toBe(true);
  });

  it('should accept solicitud input', () => {
    const mockSolicitud = { id: '123', vehiculo: 'Ford Focus' };
    component.solicitud = mockSolicitud;
    expect(component.solicitud).toEqual(mockSolicitud);
  });

  it('should accept showBusinessAvatar input', () => {
    component.showBusinessAvatar = false;
    expect(component.showBusinessAvatar).toBe(false);
  });
});
