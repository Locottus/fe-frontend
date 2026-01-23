import { ElementRef } from '@angular/core';
import { MoveNextByMaxLengthDirective } from '../directives/MoveNextByMaxLengthDirective';

describe('MoveNextByMaxLengthDirective', () => {
  let elementRef: ElementRef;

  beforeEach(() => {
    elementRef = new ElementRef(document.createElement('div'));
  });

  it('should create an instance', () => {
    const directive = new MoveNextByMaxLengthDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});

