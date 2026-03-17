import { Component } from '@angular/core';

@Component({
  selector: 'app-kite-headers',
  standalone: false,
  templateUrl: './kite-headers.component.html',
  styleUrls: ['./kite-headers.component.scss'],
})
export class KiteHeadersComponent {
  // ── Logs de eventos ──
  eventLogs: string[] = [];

  // ── Header Options config ──
  headerOptions = [
    {
      title: 'Mi cuenta',
      action: () => this.logEvent('Header Options: Mi cuenta'),
    },
    {
      title: 'Configuración',
      action: () => this.logEvent('Header Options: Configuración'),
    },
    { title: 'Ayuda', action: () => this.logEvent('Header Options: Ayuda') },
    {
      title: 'Cerrar sesión',
      action: () => this.logEvent('Header Options: Cerrar sesión'),
    },
  ];

  // ── Header Notif-Profile config ──
  hasNotifications = true;
  username = 'Juan Pérez';
  userImage: string | null = null;
  notificationsList = [
    {
      title: 'Tu transferencia fue acreditada',
      description: 'Hace 5 minutos',
      action: () => this.logEvent('Notif: Transferencia'),
    },
    {
      title: 'Nuevo resumen disponible',
      description: 'Hace 1 hora',
      action: () => this.logEvent('Notif: Resumen'),
    },
    {
      title: 'Pago de servicio confirmado',
      description: 'Hace 2 horas',
      action: () => this.logEvent('Notif: Pago'),
    },
  ];

  // ── Helpers ──
  logEvent(event: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLogs.unshift(`[${timestamp}] ${event}`);
    if (this.eventLogs.length > 20) {
      this.eventLogs.pop();
    }
  }

  clearLogs(): void {
    this.eventLogs = [];
  }

  // ── Drawer ──
  showDrawer = false;

  toggleDrawer(): void {
    this.showDrawer = !this.showDrawer;
    this.logEvent(`Drawer → ${this.showDrawer ? 'abierto' : 'cerrado'}`);
  }

  showDrawerCover = false;

  toggleDrawerCover(): void {
    this.showDrawerCover = !this.showDrawerCover;
    this.logEvent(
      `Drawer cover → ${this.showDrawerCover ? 'abierto' : 'cerrado'}`,
    );
  }

  showDrawerRight = false;

  toggleDrawerRight(): void {
    this.showDrawerRight = !this.showDrawerRight;
    this.logEvent(
      `Drawer derecho → ${this.showDrawerRight ? 'abierto' : 'cerrado'}`,
    );
  }

  onBackAction(context: string): void {
    this.logEvent(`${context} → backAction`);
  }

  onMenuAction(context: string): void {
    this.logEvent(`${context} → menuAction`);
  }

  onCloseAction(context: string): void {
    this.logEvent(`${context} → closeAction`);
  }

  onExtraIconAction(context: string): void {
    this.logEvent(`${context} → extraIconAction`);
  }

  onPhoneAction(context: string): void {
    this.logEvent(`${context} → phoneAction`);
  }

  onLocationAction(context: string): void {
    this.logEvent(`${context} → locationAction`);
  }

  onSearchAction(context: string): void {
    this.logEvent(`${context} → searchAction`);
  }

  onMainButtonAction(context: string): void {
    this.logEvent(`${context} → mainButtonAction`);
  }

  onExtraButtonAction(context: string): void {
    this.logEvent(`${context} → extraButtonAction`);
  }

  onMoreNotifications(): void {
    this.logEvent('Header Notif-Profile → moreNotificationsAction');
  }

  onPerfilAction(): void {
    this.logEvent('Header Notif-Profile → perfilAction');
  }

  onSettingsAction(): void {
    this.logEvent('Header Notif-Profile → settingsAction');
  }

  onSecurityAction(): void {
    this.logEvent('Header Notif-Profile → securityAction');
  }
}
