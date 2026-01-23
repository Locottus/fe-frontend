import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import { MonitorActividadService } from 'src/app/core/services/monitor-actividad.service';
import { Subscription } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'shared-inactividad-dialog',
  templateUrl: './inactividad-dialog.component.html',
  styleUrls: [
    './inactividad-dialog.component.scss',
  ]
})
export class InactividadDialogComponent implements OnInit, OnDestroy {
  countDown: number;
  subscription: Subscription;

  constructor(public dialogRef: MatDialogRef<InactividadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private monitorActividadService: MonitorActividadService,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.matIconRegistry.addSvgIcon(
      'flecha-derecha',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/flecha-derecha.svg')
    );

    this.subscription = this.monitorActividadService.getcountDown$().subscribe(
      item => {
        this.countDown = item;
      });
  }

  continuar(): void {
    this.dialogRef.close(true);
  }

  finalizarSesion(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
