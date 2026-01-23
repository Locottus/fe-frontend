import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Notificacion } from '../../models/notificacion';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificacionService } from 'src/app/core/services/notificacion.service';

@Component({
  selector: 'shared-notification-drawer',
  templateUrl: './notification-drawer.component.html',
  styleUrls: [
    './notification-drawer.component.scss',
  ]
})
export class NotificationDrawerComponent implements OnInit {
  public notificaciones: Notificacion[];
  isOpen = true;
  @Output() $changeNotificationDrawerState: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private notificacionService: NotificacionService
  ) {
    this.matIconRegistry.addSvgIcon(
      'check-green',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/icon-check-green.svg')
    );
  }

  ngOnInit(): void {
    this.notificaciones = this.notificacionService.notificacionesList;
  }

  closeNotificationDrawer() {
    this.$changeNotificationDrawerState.emit(false);
  }
}
