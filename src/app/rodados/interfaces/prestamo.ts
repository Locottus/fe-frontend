export interface IListaPrestamo{
    operacion: number;
    cant_cuotas: number;
    estado: string;
}

export interface ICuotasPrestamo{
    id: number;
    nro: number;
    vencimiento: string;
    estado: string;
    monto: number;
}

export interface IPrestamo{
    operacion: number;
    monto_total: number;
    vencimiento: string;
    cant_cuotas: number;
    cuotas_pendientes: number;
    cuotas: ICuotasPrestamo[];
}

export interface IDetallePrestamo{
    detalle_prestamo: IPrestamo;
    modelo: string;
    estado_vehiculo: string;
    anio_vehiculo: number;
}
