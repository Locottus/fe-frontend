import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenClientInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token =
      sessionStorage.getItem('auth') != null && request.url.includes('rodados')
        ? JSON.parse(sessionStorage.getItem('auth'))?.access_token
        : localStorage.getItem('token');

    if (token !== null && token !== undefined) {
      const newRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(newRequest);
    } else {
      return next.handle(request);
    }
  }
}
