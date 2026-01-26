export interface DetallePrestamoDTO {
  detallePrestamo: {
    prestamo: PrestamoDetalle;
    cuotas: CuotasDetalle;
  };
  vehiculo: VehiculoDetallePrestamo;
}

export interface PrestamoDetalle {
  cantidad_cuotas_impagas: number;
  cantidad_cuotas_pagas: number;
  cantidad_de_cuotas: number;
  capital: number;
  cotizacion_papel: string;
  dias_de_mora: number;
  dias_de_reparto: number;
  estado_descripcion: string;
  fecha_alta: string;
  fecha_cancelacion: string;
  fecha_vencimiento: string;
  plazo: number;
  plazo_cuota: number;
  rubro: number;
  saldo_capital: number;
  signo_redondeo: string;
  moneda_origen: {
    capital: number;
    saldo: number;
  };
  operacion: {
    codigo: number;
    sub_operacion: number;
    tipo: number;
  };
  sioc: {
    cliente: string;
    sucursal: number;
    tipo_prestamo: string;
    tipo_prestamo_descripcion: string;
  };
  identificador: {
    cuenta: number;
    canal: string;
    fuente: string;
    modulo: number;
    moneda: number;
    papel: number;
    sucursal: number;
  };
}

export interface VehiculoDetallePrestamo {
  modelo: string;
  uso: string;
  anio: number;
  ceroKm: boolean;
}

export interface CuotasDetalle {
  listado: CuotaDetalle[];
}

export interface CuotaDetalle {
  numero: number;
  fecha_vencimiento: string;
  estado: string;
  estado_descripcion: string;
  fecha_pago: string;
  moneda: {
    capital: number;
    interes: number;
    impuestos: number;
    seguro: number;
    comisiones: number;
    recargo: number;
    total: number;
  };
  uva: {
    capital: number;
    interes: number;
    impuestos: number;
    seguro: number;
    comisiones: number;
    recargo: number;
    total: number;
  };
}
