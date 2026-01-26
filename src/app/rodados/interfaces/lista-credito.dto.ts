export interface ListaCreditoDTO {
  userId: string;
  prestamos: CreditoData[];
}

export interface CreditoData {
  nroOrden: number;
  estado: string;
  cantCuotas: number;
  idSolicitud: string;
  idSolicitudSinOrigen: string;
  tipoOperacion: string;
}
