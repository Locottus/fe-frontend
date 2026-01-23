export interface Aviso {
  tipo: TipoAviso;
  leyenda: string;
  leyenda_importante?: string;
  link?: {
    texto: string;
    href: string;
    esRouterLink?: boolean;
  };
}

export enum TipoAviso {
  Notificacion = 'Notificacion',
  Advertencia = 'Advertencia',
  Alerta = 'Alerta',
}

export interface AvisoRespuestaAcoustic {
  elements: Elements;
}

export interface Elements {
  legend: Legend;
  legendImportant: LegendImportant;
  link: Link;
  type: Type;
}

export interface Legend {
  elementType: string;
  value: string;
}

export interface LegendImportant {
  elementType: string;
  value: string;
}

export interface Link {
  elementType: string;
  linkText: string;
  linkURL: string;
}

export interface Type {
  elementType: string;
  value: {
    selection: TipoAviso
  };
}


