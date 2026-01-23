import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { ErrorHandlerService } from './services/error-handler.service';
import { TokenClientInterceptor } from './interceptors/tokenClient.interceptor';

@NgModule({
  imports: [CommonModule],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenClientInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'es-Ar' }
  ]
})
export class CoreModule {}
