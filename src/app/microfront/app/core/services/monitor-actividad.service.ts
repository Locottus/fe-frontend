import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitorActividadService {

  private readonly countDown = new BehaviorSubject<number>(0);

  getcountDown$(): Observable<number> {
    return this.countDown.asObservable();
  }

  decrementarCountDown(item: number) {
      this.countDown.next(item);
  }
}
