import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalStyleService {
  private showGlobalSpinnerSubject = new BehaviorSubject<boolean>(false);

  setGlobalSpinnerState( shouldShow: boolean ) {
    this.showGlobalSpinnerSubject.next(shouldShow);
  }

  getGlobalSpinnerState$(): Observable<boolean> {
    return this.showGlobalSpinnerSubject.asObservable();
  }
}
