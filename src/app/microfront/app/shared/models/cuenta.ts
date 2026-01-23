import { Moneda } from './moneda';

export interface Cuenta {
  identificador: string;
  tipo_cuenta: string;
  saldo: number;
  numero: string;
  moneda: Moneda;
  estado: CuentaEstado;
}

export enum CuentaEstado {
  bloqueado = 'bloqueado',
  normal = 'normal',
}
