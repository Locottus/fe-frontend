export interface Alert {
  titulo: string;
  contenido: string;
  tipo?: AlertTipo;
  link?: {
    texto: string;
    href: string;
    esRouterLink?: boolean;
  };
}

export enum AlertTipo {
  accionable = 'accionable',
  advertencia = 'advertencia',
  info = 'info',
}
