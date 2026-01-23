import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';

import { InactividadDialogComponent } from './inactividad-dialog.component';
import { AngularMaterialModule } from '../../../angular-material.module';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InactividadDialogComponent', () => {
  let component: InactividadDialogComponent;
  let fixture: ComponentFixture<InactividadDialogComponent>;
  let dialog: MatDialog;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InactividadDialogComponent],
      imports: [AngularMaterialModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([MatDialog],
    (d: MatDialog) => {
      dialog = d;
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InactividadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cerrar el modal con parámetro en false', () => {
    component.finalizarSesion();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
