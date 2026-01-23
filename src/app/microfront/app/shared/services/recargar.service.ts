import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecargaService {
    private recargarPadre = new BehaviorSubject<boolean>(false);
    recargarPadre$ = this.recargarPadre.asObservable();

    solicitarRecarga() {
        this.recargarPadre.next(true);
    }
}
