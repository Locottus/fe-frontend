import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {
  @Input() public width: string;
  @Input() public height: string;
  @Input() public isForm: boolean;
  @Input() public isComment: boolean;
  @Input() public list: boolean;
  @Input() public roundedClose?: boolean;
  @Input() formGroupMontos: AbstractControl;
  @Input() public title: string;
  @Input() public isGeneric: boolean;
  @Input() public haveIconclose = true;
  @Input() styleList: any;
  @Output() public isClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  isOpenDialog = false;
  showBody = false;
  constructor() {
    this.toggleDialog = this.toggleDialog.bind(this);
  }

  ngOnInit(): void { }

  public toggleDialog(): void {
    if (this.isOpenDialog) {
      document.body.classList.remove('sv-modal-open');
    } else {
      document.body.classList.add('sv-modal-open');
    }
    setTimeout(() => {
      this.showBody = !this.showBody;
    }, 1);
    this.isOpenDialog = !this.isOpenDialog;

    if (!this.isOpenDialog) { this.isClose.emit(true); }
  }

  public cerrar() {
    // if(!this.isGeneric){
    //   this.formGroupMontos.get('terminosCondiciones').setValue(1);
    //   this.simularService.isCheckTYC = true;
    // }
    this.toggleDialog();
  }

}
