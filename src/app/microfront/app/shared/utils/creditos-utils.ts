import { EstadosCreditos } from 'src/app/shared/models/estados-creditos';

export function formatDate(date: string | undefined | null): string {
  if (!date) return '';
  if (typeof date !== 'string') {
    console.warn('Fecha no es string:');
    return '';
  }
  const datePart = date.split('T')[0];
  const parts = datePart.split('-');
  if (parts.length !== 3 || parts.some((p) => !p)) {
    console.warn('Formato de fecha inesperado:');
    return datePart;
  }
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function formatDetalleSolicitud(detalle: any): any {
  if (!detalle || !detalle.solicitud) return detalle;
  return {
    ...detalle,
    solicitud: {
      ...detalle.solicitud,
      primerVencimiento: formatDate(detalle.solicitud?.primerVencimiento),
      ultimoVencimiento: formatDate(detalle.solicitud?.ultimoVencimiento),
      fechaAlta: formatDate(detalle.solicitud.fechaAlta)
    },
    documentos: null
  };
}

export function getVariant(estado: string): 'error' | 'info' | 'success' | 'warning' | 'default' {
  switch (estado) {
    case EstadosCreditos.Vencida: return 'error';
    case EstadosCreditos.Pendiente:
    case EstadosCreditos.EnProceso: return 'warning';
    case EstadosCreditos.Vigente: return 'success';
    case EstadosCreditos.Finalizado: return 'default';
    default: return 'default';
  }
}

export function getRutaPorEstado(estado: string): string {
  switch (estado) {
    case EstadosCreditos.Pendiente: return 'rodados/pendientes-tyc';
    case EstadosCreditos.Finalizado: return 'rodados/prestamo-en-curso';
    case EstadosCreditos.EnProceso: return 'rodados/procesando-solicitud';
    case EstadosCreditos.Vigente: return 'rodados/prestamo-en-curso';
    default: return '/';
  }
}
