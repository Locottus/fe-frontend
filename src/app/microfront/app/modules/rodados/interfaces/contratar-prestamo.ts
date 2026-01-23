import { CuentaAcreditacion } from './cuenta-acreditacion';

export interface ContratarPrestamo {
    CantidadCuotas: number;
    CuentaAcreditacion: CuentaAcreditacion;
    Importe: number;
    Moneda: number;
    Papel: number;
    TNA: number;
    DestinoEconomico: string;
}
