import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-prestamo-page-layout',
  templateUrl: './prestamo-page-layout.component.html',
  styleUrls: ['./prestamo-page-layout.component.scss']
})
export class PrestamoPageLayoutComponent {
  @Input() title: string;
  @Input() isMobile: boolean = false;
  @Input() containerCss: any = {};
  @Input() layoutCss: any = {};
  @Output() backAction = new EventEmitter<void>();

  onBack(): void {
    this.backAction.emit();
  }
}
