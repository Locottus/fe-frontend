import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';
import { TestingModule } from '../../../../test/utils/utils';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let debugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ TestingModule ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debería emitir el nuevo valor al ingresar un caracter en el input', () => {
    const dispatchKeyUp = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      shiftKey: true
    });

    spyOn(component.newValue, 'emit');

    const input = debugElement.query(By.css('.input'));
    component.value = 'For';

    input.nativeElement.dispatchEvent(dispatchKeyUp);

    fixture.detectChanges();

    expect(component.newValue.emit).toHaveBeenCalledWith('For');
  });
});
