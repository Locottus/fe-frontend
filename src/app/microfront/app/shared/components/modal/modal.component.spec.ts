import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('deberia agregar sv-modal-open al body del documento', () => {
    component.isOpenDialog = true;
    component.toggleDialog();
    fixture.detectChanges();
    expect(document.body.classList.contains('sv-modal-open')).toBeFalsy();
    expect(component.isOpenDialog).toBeFalsy();
  });

  it('deberia remover sv-modal-open al body del documento', () => {
    component.isOpenDialog = false;
    component.toggleDialog();
    fixture.detectChanges();
    expect(document.body.classList.contains('sv-modal-open')).toBeTruthy();
    expect(component.isOpenDialog).toBeTruthy();
  });

  it('debe validar que se haga click en el botón X de cerrar', () => {
    component.isOpenDialog = true;
    component.isGeneric = false;

    fixture.detectChanges();
    spyOn(component, 'cerrar').and.callThrough();
    spyOn(component, 'toggleDialog');

    const componentCompiled = fixture.debugElement.query(By.css('.btn-pf')).nativeElement;
    componentCompiled.click();

    expect(component.cerrar).toHaveBeenCalledTimes(1);
    expect(component.toggleDialog).toHaveBeenCalled();
  });
});
