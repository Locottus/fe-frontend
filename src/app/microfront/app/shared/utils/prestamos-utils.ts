import { IOfertaSimulada } from 'src/app/modules/rodados/interfaces/oferta-simulada';

export class PrestamosUtils {
    public static construirCuotasString(oferta: IOfertaSimulada) {
        if (oferta.cuotario.length > 1) {
            return `${oferta.cuotario.length} cuotas`;
        } else {
            return `${oferta.cuotario.length} cuota`;
        }
    }

    public static pasarANumeroNormal(numero: any) {
        return parseFloat(numero.replaceAll('.', '').replace(',', '.'));
    }
}
