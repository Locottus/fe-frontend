import { Injectable, ErrorHandler } from '@angular/core';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(private readonly errorService: ErrorService) {}

  handleError(error: Error) {
    console.error(this.errorService.getErrorMensajeCliente(error));
  }
}

