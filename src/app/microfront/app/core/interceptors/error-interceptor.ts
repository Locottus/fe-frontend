import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';

@Injectable({
    providedIn: 'root'
})

export class ErrorInterceptor implements HttpInterceptor {
  constructor(private readonly errorService: ErrorService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          const message = this.errorService.getErrorMensajeServidor(error);
          this.errorService.loguearAlServidor(message, error);
          throw error;
        })
      );
  }
}
