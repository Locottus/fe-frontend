import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'shared-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  constructor(private settingService: SettingsService) {}

  get ocultarComponente(): boolean {
    return !location.pathname.includes('root');
  }

  ngOnInit(): void {
  }

}
