export interface CuentaVistaDTO {
  bloqueos: BloqueoDto;
  bonificaciones: BonificacionDto[];
  clase: CodigoDescripcionDto;
  compatibilidadBantotal: CompatibilidadBantotalDto;
  datosAdicionales: DatosAdicionalesDto;
  descripcion: string;
  estado: CodigoDescripcionDto;
  fechaAlta: string;
  fechaAltaCuentaOriginal: string;
  idCuentaVista: string;
  identificadorUnificado: string;
  informacionRemunerada: InformacionRemuneradaDto;
  migracion: MigracionDto;
  moneda: MonedaDto;
  operativoConBloqueo: string;
  permiteOperar: CodigoDescripcionDto;
  preferida: boolean;
  saldo: string;
  saldoAcuerdos: number;
  saldoInicial: number;
  saldoUnificado: number;
  sucursal: CodigoDescripcionDto;
  tipo: CodigoDescripcionDto;
}

export interface BloqueoDto {
  monto: number;
  tiene: boolean;
}

export interface BonificacionDto {
  fechaVencimiento: string;
  importe: number;
  maximo: number;
  minimo: number;
  monto: number;
  tasa: number;
}

export interface CodigoDescripcionDto {
  codigo: string;
  descripcion: string;
}

export interface CompatibilidadBantotalDto {
  cuenta: string;
  empresa: string;
  modulo: string;
  moneda: string;
  operacion: string;
  papel: string;
  rubro: string;
  subcuenta: string;
  sucursal: string;
  tipoOperacion: string;
}

export interface DatosAdicionalesDto {
  cbu: string;
  paquete: PaqueteDto;
  ultimoMovimiento: string;
}

export interface PaqueteDto {
  codigo: number;
  descripcion: string;
}

export interface InformacionRemuneradaDto {
  remunerada: boolean;
  tna: number;
  tea: number;
  ultimaRemuneracion: number;
  acumuladoMensual: number;
}

export interface MigracionDto {
  fecha: string;
  idCuentaVistaMigrada: string;
}

export interface MonedaDto {
  codigo: string;
  descripcion: string;
  simbolo: string;
}
