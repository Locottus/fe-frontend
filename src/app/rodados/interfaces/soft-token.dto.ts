/**
 * Interface para el response del endpoint de estado de Soft Token
 * Endpoint: GET /v2.0/totp/tokens/{identifier}
 */
export interface SoftTokenEstadoDTO {
  identifier?: string;
  estado?: string;
  fechaCreacion?: string;
  fechaExpiracion?: string;
  intentosRestantes?: number;
  bloqueado?: boolean;
  activo?: boolean;
  [key: string]: any; // Para campos adicionales del response
}

/**
 * Interface para el request de generación de token
 */
export interface SoftTokenGenerarRequest {
  idPersona: number;
}

/**
 * Interface para el request de validación de token
 */
export interface SoftTokenValidarRequest {
  token: string;
  idPersona: number;
}

/**
 * Interface para el request de reenvío de token
 */
export interface SoftTokenReenviarRequest {
  idPersona: number;
  medio: 'email' | 'sms';
}
