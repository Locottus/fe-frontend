import { IOfertaSimulada } from '../../../modules/prestamos/interfaces/oferta-simulada';

export class OfertaSeleccionadaServiceMock {
    private ofertaSeleccionadaMock: IOfertaSimulada;

    ofertaSeleccionadaSetter(value) {
        this.ofertaSeleccionadaMock = value;
    }

    ofertaSeleccionadaGet() {
        return this.ofertaSeleccionadaMock;
    }
}
