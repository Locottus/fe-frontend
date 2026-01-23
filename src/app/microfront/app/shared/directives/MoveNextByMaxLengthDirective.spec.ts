import { MoveNextByMaxLengthDirective } from './MoveNextByMaxLengthDirective';
import { ElementRef } from '@angular/core';

describe('MoveNextByMaxLengthDirective', () => {
  let directive: MoveNextByMaxLengthDirective;
  let elementRef: ElementRef;
  let mockElement: HTMLInputElement;

  beforeEach(() => {
    // Create a mock input element
    mockElement = document.createElement('input');
    mockElement.type = 'text';
    mockElement.maxLength = 5;
    
    elementRef = new ElementRef(mockElement);
    directive = new MoveNextByMaxLengthDirective(elementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should move focus to next sibling element when max length is reached', () => {
    // Setup DOM structure with siblings
    const container = document.createElement('div');
    const firstInput = document.createElement('input');
    firstInput.type = 'text';
    firstInput.maxLength = 3;
    firstInput.value = 'abc';
    
    const secondInput = document.createElement('input');
    secondInput.type = 'text';
    secondInput.maxLength = 3;
    
    container.appendChild(firstInput);
    container.appendChild(secondInput);
    
    // Mock focus method
    spyOn(secondInput, 'focus');
    
    // Create event
    const event = {
      srcElement: firstInput,
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    directive.onKeyDown(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(secondInput.focus).toHaveBeenCalled();
  });

  it('should skip non-input siblings and find next matching input type', () => {
    // Setup DOM structure with mixed elements
    const container = document.createElement('div');
    const firstInput = document.createElement('input');
    firstInput.type = 'text';
    firstInput.maxLength = 3;
    firstInput.value = 'abc';
    
    const divElement = document.createElement('div');
    const spanElement = document.createElement('span');
    
    const secondInput = document.createElement('input');
    secondInput.type = 'text';
    secondInput.maxLength = 3;
    
    container.appendChild(firstInput);
    container.appendChild(divElement);
    container.appendChild(spanElement);
    container.appendChild(secondInput);
    
    spyOn(secondInput, 'focus');
    
    const event = {
      srcElement: firstInput,
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    directive.onKeyDown(event);
    
    expect(secondInput.focus).toHaveBeenCalled();
  });

  it('should only focus on elements with same type', () => {
    // Setup DOM with different input types
    const container = document.createElement('div');
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.maxLength = 3;
    textInput.value = 'abc';
    
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'text';
    
    container.appendChild(textInput);
    container.appendChild(emailInput);
    container.appendChild(passwordInput);
    
    spyOn(passwordInput, 'focus');
    spyOn(emailInput, 'focus');
    
    const event = {
      srcElement: textInput,
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    directive.onKeyDown(event);
    
    expect(emailInput.focus).not.toHaveBeenCalled();
    expect(passwordInput.focus).toHaveBeenCalled();
  });

  it('should not move focus when value length is less than maxLength', () => {
    const container = document.createElement('div');
    const firstInput = document.createElement('input');
    firstInput.type = 'text';
    firstInput.maxLength = 5;
    firstInput.value = 'abc'; // less than maxLength
    
    const secondInput = document.createElement('input');
    secondInput.type = 'text';
    
    container.appendChild(firstInput);
    container.appendChild(secondInput);
    
    spyOn(secondInput, 'focus');
    
    const event = {
      srcElement: firstInput,
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    directive.onKeyDown(event);
    
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(secondInput.focus).not.toHaveBeenCalled();
  });

  it('should handle case when no next sibling exists', () => {
    const container = document.createElement('div');
    const onlyInput = document.createElement('input');
    onlyInput.type = 'text';
    onlyInput.maxLength = 3;
    onlyInput.value = 'abc';
    
    container.appendChild(onlyInput);
    
    const event = {
      srcElement: onlyInput,
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    // Should not throw error
    expect(() => directive.onKeyDown(event)).not.toThrow();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle case when no matching type sibling exists', () => {
    const container = document.createElement('div');
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.maxLength = 3;
    textInput.value = 'abc';
    
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    
    const button = document.createElement('button');
    
    container.appendChild(textInput);
    container.appendChild(emailInput);
    container.appendChild(button);
    
    spyOn(emailInput, 'focus');
    
    const event = {
      srcElement: textInput,
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    directive.onKeyDown(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(emailInput.focus).not.toHaveBeenCalled();
  });

  it('should handle null nextElementSibling gracefully', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 3;
    input.value = 'abc';
    
    // Ensure no siblings
    expect(input.nextElementSibling).toBeNull();
    
    const event = {
      srcElement: input,
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    expect(() => directive.onKeyDown(event)).not.toThrow();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should work with number input types', () => {
    const container = document.createElement('div');
    const firstNumber = document.createElement('input');
    firstNumber.type = 'number';
    firstNumber.maxLength = 2;
    firstNumber.value = '12';
    
    const secondNumber = document.createElement('input');
    secondNumber.type = 'number';
    
    container.appendChild(firstNumber);
    container.appendChild(secondNumber);
    
    spyOn(secondNumber, 'focus');
    
    const event = {
      srcElement: firstNumber,
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    directive.onKeyDown(event);
    
    expect(secondNumber.focus).toHaveBeenCalled();
  });
});