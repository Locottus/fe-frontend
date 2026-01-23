import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from '@auth0/angular-jwt';
import { NgIdleModule } from '@ng-idle/core';
import { LogoutModule } from './modules/logout/logout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { RoutingService } from './core/services/routing.service';
import { RodadosModule } from './modules/rodados/rodados.module';
import { SettingsService } from './core/services/settings.service';
import { initFirebase } from '../../firebase';
import { KiteModule } from 'src/app/core/kite/kite.module';
import { SettingsHttpService } from './core/services/settings-http.service';

export function tokenGetter() {
  return sessionStorage.getItem('token');
}

/**
 * Inicialización ordenada:
 * 1) Carga settings remotos (initializeApp)
 * 2) Inicializa Firebase con esos settings (initFirebase)
 */
export function appInitFactory(
  settingsHttpService: SettingsHttpService,
  settingsService: SettingsService
): () => Promise<void> {
  return async () => {
    await settingsHttpService.initializeApp();
    initFirebase(settingsService);
  };
}


export function getBaseHref() {
  if (location.pathname.includes('/root/')) {
    return '/obi/root/';
  } else {
    return '/obi/';
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    LogoutModule,
    AngularMaterialModule,
    RodadosModule,
    KiteModule,
    NgIdleModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:4200', 'localhost:5000', 'backend']
      }
    })
  ],
  providers: [
    HttpClient,
    RoutingService,
    SettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [SettingsHttpService, SettingsService],
      multi: true
    },
    { provide: APP_BASE_HREF, useValue: getBaseHref() }
  ],
  bootstrap: []
})

export class AppModule {
  ngDoBootstrap() {}
}
