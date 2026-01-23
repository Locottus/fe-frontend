import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AutofocusDirective } from './AutofocusDirective';

@Component({
  template: `<input appAutofocus />`
})
class TestComponent {}

describe('AutofocusDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutofocusDirective, TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should create an instance', () => {
    const directive = new AutofocusDirective(inputEl);
    expect(directive).toBeTruthy();
  });

  it('should focus the element after view init', () => {
    spyOn(inputEl.nativeElement, 'focus');
    fixture.detectChanges();
    expect(inputEl.nativeElement.focus).toHaveBeenCalled();
  });
});
