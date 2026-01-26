export interface DetalleSolicitudDTO {
  id: string;
  vehiculo: VehiculoData;
  solicitud: SolicitudDetalle;
  seguro: SeguroData;
  concesionario: ConcesionarioData;
  documentos: DocumentosSolicitudResponse;
  cuentas?: CuentaSeleccionDto[];
}

export interface CuentaSeleccionDto {
  tipo?: TipoApiDto;
  preferida: boolean;
  moneda?: MonedaApiDto;
  cuenta: string;
  saldo?: string;
  idCuentaVista?: string;
  cbu?: string;
}

export interface TipoApiDto {
  codigo: string;
  descripcion: string;
}

export interface MonedaApiDto {
  codigo: string;
  descripcion: string;
  simbolo: string;
}

export interface VehiculoData {
  codia: number;
  anio: number;
  marca: string;
  modelo: string;
  numeroMotor: string;
  numeroChasis: string;
  numeroDominio: string;
  gnc: boolean;
  ceroKm: boolean;
  uso: string;
  valorVehiculo: number;
  tipoAutomotor: string;
  categoriaAutomovil: string;
}

export interface SolicitudDetalle {
  capital: number;
  capitalEnUvas: number;
  plazo: number;
  tna: number;
  cft: number;
  ltv: number;
  tea: number;
  cfta: number;
  cftea: number;
  precioTotalFinanciado: number;
  primerVencimiento: string;
  ultimoVencimiento: string;
  primeraCuota: number;
  primeraCuotaEnUvas: number;
  ultimaCuota: number;
  ultimaCuotaEnUvas: number;
  uvaAlDIa: number;
  montoInscripcionPrenda: number;
  moneda: string;
  monedaBantotal: number;
  periodicidad: string;
  cuotaPura: number;
  tipoTasa: string;
  sistemaAmortizacion: string;
  esUva: boolean;
  fechaAlta: string;
  diasRestantesVigenciaAprobado: number;
  fechaAutorizacionCredito: string;
}

export interface SeguroData {
  aseguradora: string;
  cobertura: string;
  costoMensual: number;
  opcionesSeguro: string[];
  idCotizacion: string;
  esUva: boolean;
  esPreprenda: boolean;
}

export interface ConcesionarioData {
  id: number;
  razonSocial: string;
  cuit: string;
  asesorComercial: string;
  codigoSucursalSupervielle: string;
  nombreSucursalSupervielle: string;  
  emails: string[];
  cbu: string;
}

export interface Documento {
  id: string;
  nombre: string;
  base64: string;
}

export interface DocumentosSolicitudResponse {
  documentos: Documento[];
  terminosYCondiciones: {
    id: string;
    texto: string;
  };
}
