import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoadingEmitter = new BehaviorSubject<boolean>(false);
  requestsPendientes = 0;

  constructor() {}

  public aniadirRequest() {
    this.requestsPendientes += 1;
    this.checkLoading();
  }

  public quitarRequest() {
    this.requestsPendientes -= 1;
    this.checkLoading();
  }

  private checkLoading() {
    this.isLoadingEmitter.next(this.requestsPendientes > 0);
  }
}
