// TODO(contrato pendiente): campos provisionales, tomados de los datos de
// ejemplo que ya mostraba la vista Seguimientos (ver seguimientos.js).
// Confirmar contra la documentación real de la plataforma externa.
export type NivelAlerta = 'alta' | 'media' | 'baja';

export interface SeguimientoResumen {
  paciente: string;
  ultimoSeguimiento: string;
  proximoSeguimiento: string;
  ultimaConsulta: string;
  alerta: NivelAlerta;
  nps: number;
}
