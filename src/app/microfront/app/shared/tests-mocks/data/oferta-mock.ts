import { ICuota } from '../../../modules/prestamos/interfaces/cuota';
import { IOfertaSimulada } from '../../../modules/prestamos/interfaces/oferta-simulada';

export const montoMinimo = 3000;
export const montoMaximo = 10000;

export const primeraCuotaOfertaMock: ICuota = {
  id: 1,
  fecha_pago: '01/04/2021',
  importe: '300.000,00',
};
export const ofertaMock: IOfertaSimulada[] = [{
  id: '1',
  capital: '300.000,00',
  cft: '0,40',
  tasa_efectiva_anual: '0,40',
  tasa_nominal_anual: '0,5',
  cuotario: [primeraCuotaOfertaMock],
  plazo: '10',
  destino_fondos: 'xx',
  fecha_valor: 'xxxx',
  fecha_vencimiento: 'xxxx',
  fecha_primer_vencimiento: 'xxxx',
  valor_cuota: '300.000,00'
}];
