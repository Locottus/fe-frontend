import { RecargaService } from './recargar.service';

describe('RecargaService', () => {
    let service: RecargaService;

    beforeEach(() => {
        service = new RecargaService();
    });

    it('debería crearse correctamente', () => {
        expect(service).toBeTruthy();
    });

    it('debería emitir "true" cuando se solicita una recarga', (done) => {
        let contador = 0;

        service.recargarPadre$.subscribe((valor) => {
            if (contador === 0) {
                // Esperamos que el primer valor sea false
                expect(valor).toBeFalse();
            } else if (contador === 1) {
                // Esperamos que el siguiente valor sea true
                expect(valor).toBeTrue();
                done();
            }
            contador++;
        });

        // Llamar a solicitarRecarga() después para emitir el siguiente valor
        service.solicitarRecarga();
    });
});
