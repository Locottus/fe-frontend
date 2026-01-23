import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'shared-session-expirada-dialog',
  templateUrl: './session-expirada-dialog.component.html',
  styleUrls: ['./session-expirada-dialog.component.scss']
})
export class SessionExpiradaDialogComponent implements OnInit {

  logoffUrl: string;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.matIconRegistry.addSvgIcon(
      'flecha-derecha',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/flecha-derecha.svg')
    );

    this.logoffUrl = this.settingsService.settings.logoffUrl;
  }

  ingresar(): void {

  }

  finalizarSesion(): void {

  }
}
