
import { ElementRef } from '@angular/core';
import { AutofocusDirective } from './AutofocusDirective';

describe('AutofocusDirective', () => {
  let elementRef: ElementRef;

  beforeEach(() => {
    elementRef = new ElementRef(document.createElement('div'));
  });

  it('should create an instance', () => {
    const directive = new AutofocusDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});

