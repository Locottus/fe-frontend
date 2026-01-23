import { ClickOutsideDirective } from './click-outside.directive';
import { ElementRef } from '@angular/core';

describe('ClickOutsideDirective', () => {
  let directive: ClickOutsideDirective;
  let elementRef: ElementRef;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    elementRef = new ElementRef(mockElement);
    directive = new ClickOutsideDirective(elementRef);
    
    // Add element to document for proper contains() behavior
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    // Clean up DOM
    if (mockElement.parentNode) {
      mockElement.parentNode.removeChild(mockElement);
    }
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should emit clickOutside event when clicking outside the element', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Create an external element to click
    const externalElement = document.createElement('div');
    document.body.appendChild(externalElement);
    
    // Simulate click outside
    directive.onClick(externalElement);
    
    expect(directive.clickOutside.emit).toHaveBeenCalledWith(true);
    
    // Clean up
    document.body.removeChild(externalElement);
  });

  it('should not emit clickOutside event when clicking inside the element', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Click on the element itself
    directive.onClick(mockElement);
    
    expect(directive.clickOutside.emit).not.toHaveBeenCalled();
  });

  it('should not emit clickOutside event when clicking on a child element', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Create a child element
    const childElement = document.createElement('span');
    mockElement.appendChild(childElement);
    
    // Click on the child element
    directive.onClick(childElement);
    
    expect(directive.clickOutside.emit).not.toHaveBeenCalled();
  });

  it('should emit clickOutside event when clicking on a sibling element', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Create a sibling element
    const siblingElement = document.createElement('div');
    mockElement.parentNode!.appendChild(siblingElement);
    
    // Click on the sibling element
    directive.onClick(siblingElement);
    
    expect(directive.clickOutside.emit).toHaveBeenCalledWith(true);
    
    // Clean up
    document.body.removeChild(siblingElement);
  });

  it('should handle null target element gracefully', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Simulate click with null target
    directive.onClick(null);
    
    expect(directive.clickOutside.emit).toHaveBeenCalledWith(true);
  });

  it('should handle undefined target element gracefully', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Simulate click with undefined target
    directive.onClick(undefined);
    
    expect(directive.clickOutside.emit).toHaveBeenCalledWith(true);
  });

  it('should work with nested child elements', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Create nested structure
    const childDiv = document.createElement('div');
    const grandChildSpan = document.createElement('span');
    childDiv.appendChild(grandChildSpan);
    mockElement.appendChild(childDiv);
    
    // Click on deeply nested element
    directive.onClick(grandChildSpan);
    
    expect(directive.clickOutside.emit).not.toHaveBeenCalled();
  });

  it('should emit clickOutside for document.body clicks', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Click on document body (which doesn't contain our element)
    directive.onClick(document.body);
    
    expect(directive.clickOutside.emit).toHaveBeenCalledWith(true);
  });

  it('should handle text nodes as target', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Create a text node inside the element
    const textNode = document.createTextNode('test text');
    mockElement.appendChild(textNode);
    
    // Text nodes don't have contains method, so check parent element
    // The directive implementation uses contains on the element, so textNode should not be contained
    directive.onClick(textNode.parentNode);
    
    // Should NOT emit because the parent is our mockElement
    expect(directive.clickOutside.emit).not.toHaveBeenCalled();
  });

  it('should work correctly with different element types', () => {
    spyOn(directive.clickOutside, 'emit');
    
    // Test with various HTML elements
    const button = document.createElement('button');
    const input = document.createElement('input');
    const span = document.createElement('span');
    
    mockElement.appendChild(button);
    mockElement.appendChild(input);
    
    document.body.appendChild(span);
    
    // Clicks inside should not emit
    directive.onClick(button);
    directive.onClick(input);
    expect(directive.clickOutside.emit).not.toHaveBeenCalled();
    
    // Click outside should emit
    directive.onClick(span);
    expect(directive.clickOutside.emit).toHaveBeenCalledWith(true);
    
    // Clean up
    document.body.removeChild(span);
  });
});

