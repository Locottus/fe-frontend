import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InputComponent {

  @Input() value: string;
  @Input() type: string;
  @Input() disabled: boolean;
  @Input() placeholder: string;
  @Input() icon: string;
  @Input() maxlength: number;

  @Input() parentForm: FormGroup;
  @Input() control: FormControl;
  @Input() controlName: string;
  @Input() mensajeError: string;

  @Output() newValue = new EventEmitter<string>();

  onKeyUp(newValue) {
    this.newValue.emit(newValue);
  }

}
