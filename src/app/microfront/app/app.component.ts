import { Component, OnInit, HostListener } from '@angular/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AutoResume, DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InactividadDialogComponent } from './shared/components/inactividad-dialog/inactividad-dialog.component';
import { MonitorActividadService } from './core/services/monitor-actividad.service';
import { SettingsService } from './core/services/settings.service';
import { GlobalStyleService } from './core/services/global-style.service';
import { RoutingService } from './core/services/routing.service';
import { AnalyticsService } from './core/services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string;
  inactivityDialog: MatDialogRef<any> = null;
  showGlobalSpinner = false;
  constructor(
    private readonly idle: Idle,
    public dialog: MatDialog,
    private monitorActividadService: MonitorActividadService,
    private readonly settingsService: SettingsService,
    private readonly routingService: RoutingService,
    private globalStylesService: GlobalStyleService,
    private analyticsService: AnalyticsService,
  ) {}

  openDialog(): MatDialogRef<any> {
    const dialogRef = this.dialog.open(InactividadDialogComponent, {
      width: '335px',
      data: {},
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.inactivityDialog = null;
        this.idle.interrupt(true);
      } else if (result === false) {
        const redirigirAHBI = true;
        localStorage.removeItem('token');
      }
    });

    return dialogRef;
  }

  ngOnInit() {
    this.title = 'Obi';

    if (!this.estaDentroDeRoot) {
      this.inicializarControlDeSesionActiva();
    }

    this.analyticsService.googleAnalyticsClick(
      'quick access',
      'Préstamo prendario',
      'obi - home'
    );

  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.dialog.closeAll();
    }
  }

  private subscribeToGlobalSpinnerState() {
    this.globalStylesService.getGlobalSpinnerState$().subscribe((newState) => (this.showGlobalSpinner = newState));
  }

  private inicializarControlDeSesionActiva() {
    // Configuramos el tiempo (segundos) de inactividad del usuario en el browser para comenzar a mostrar el dialogo
    this.idle.setIdle(this.settingsService.settings.idleSeconds);
    // Configuramos el tiempo (segundos) mediante el cual se va mostrar el dialogo para continuar o cerrar sesion
    this.idle.setTimeout(this.settingsService.settings.idleTimeoutSeconds);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.setAutoResume(AutoResume.notIdle);

    this.idle.onTimeout.subscribe(() => {
      if (this.inactivityDialog) {
        this.inactivityDialog.close();
      }
      this.routingService.logout();
    });
    this.idle.onTimeoutWarning.subscribe((countdown) => {
      const expiryDate = parseInt(localStorage.getItem('ng2Idle.main.expiry'), 10);
      const isSessionExpired: boolean = expiryDate - Date.now() < 0;
      if (isSessionExpired) {
        this.idle.timeout();
        return;
      }
      this.monitorActividadService.decrementarCountDown(countdown);

      if (!this.inactivityDialog) {
        this.inactivityDialog = this.openDialog();
      }
    });

    this.idle.watch();

    this.subscribeToGlobalSpinnerState();
  }

  get estaDentroDeRoot() {
    return location.pathname.includes('/root');
  }
}
