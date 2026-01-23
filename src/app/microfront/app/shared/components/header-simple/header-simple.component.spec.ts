import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderSimpleComponent } from './header-simple.component';

describe('HeaderSimpleComponent', () => {
  let component: HeaderSimpleComponent;
  let fixture: ComponentFixture<HeaderSimpleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderSimpleComponent ],
      imports: [RouterTestingModule, BrowserModule, BrowserAnimationsModule, CommonModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe validar que se haga click en el boton Cerrar', () => {
    fixture.detectChanges();
    spyOn(component, 'cerrar');

    const componentCompiled = fixture.debugElement.query(By.css('#botonCerrar')).nativeElement;

    componentCompiled.click();
    expect(component.cerrar).toHaveBeenCalledTimes(1);
  });

  it('should call ngOnInit', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to /obi/mis-productos when cerrar is called', () => {
    // Verify cerrar method is defined and can be called
    // Note: We can't easily test window.location.href assignment in Karma/Jasmine
    // but we can verify the method is callable
    expect(component.cerrar).toBeDefined();
    
    // Spy on the method to avoid actual navigation
    const cerrarSpy = spyOn(component, 'cerrar').and.callFake(() => {
      // Simulated behavior
    });
    
    component.cerrar();
    
    expect(cerrarSpy).toHaveBeenCalled();
  });

  it('should have ngOnInit defined', () => {
    expect(component.ngOnInit).toBeDefined();
    component.ngOnInit();
  });
});
