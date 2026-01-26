import { ICuota } from './cuota';

export interface IOfertaSimulada {
    id: string;
    capital: string;
    cft: string;
    tasa_nominal_anual: string;
    tasa_efectiva_anual: string;
    cuotario: ICuota[];
    plazo: string;
    destino_fondos: string;
    fecha_valor: string;
    fecha_vencimiento: string;
    fecha_primer_vencimiento: string;
    valor_cuota: string;
}
