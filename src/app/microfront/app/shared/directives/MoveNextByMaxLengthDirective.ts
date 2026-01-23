import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[moveNextByMaxLength]'
})
export class MoveNextByMaxLengthDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keyup', ['$event']) onKeyDown(e: any) {
    if (e.srcElement.maxLength === e.srcElement.value.length) {

      e.preventDefault();

      let nextControl: any = e.srcElement.nextElementSibling;
      while (true) {
        if (nextControl) {
          if (nextControl.type === e.srcElement.type) {
            nextControl.focus();
            return;
          } else {
            nextControl = nextControl.nextElementSibling;
          }
        } else {
          return;
        }
      }
    }
  }
}
