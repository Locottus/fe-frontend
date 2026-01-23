import { Observable } from 'rxjs';

export class PufsServiceMock {
    getPufs() {
        return new Observable((observer) => {
            setInterval(() => {
                observer.next({
                    resumenId: '57b82a3e-4a40-4cf5-b31f-040403419234',
                    content: 'content'
                });
            }, 1000);
        });
    }
    acceptPufs() {
        return new Observable((observer) => {
            setInterval(() => {
                observer.next({
                    idTerimnosCondiciones: '57b82a3e-4a40-4cf5-b31f-040403419234',
                    fechaAceptacion: '2021-08-03T15:51:29.3088371'
                });
            }, 1000);
        });
    }
}
