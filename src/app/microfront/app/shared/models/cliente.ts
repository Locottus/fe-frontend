export enum ClienteClubBeneficioId {
  sinClubBeneficio = 0,
  clubSupervielle = 35,
  _123Chances = 34,
}

export interface Cliente {
  nombre: string;
  apellido: string;
  ultimo_login: Date;
  fecha_expiracion_clave: Date;
  preferencias: Preferencias;
  club_beneficio_id?: ClienteClubBeneficioId;
  celular?: string;
  email?: string;
  core?: string;
  persona_id?: string;
}

export interface ClienteRoda {
  nombre: string;
  apellido: string;
  imagen: string;
  ultimo_login: Date;
  fecha_expiracion_clave: Date;
  celular?: string;
  email?: string;
  core?: string;
  persona_id?: string;
}

export interface Preferencias {
  vio_menu?: boolean;
  clave_por_vencer?: boolean;
  vio_notificacion_clave?: boolean;
}
