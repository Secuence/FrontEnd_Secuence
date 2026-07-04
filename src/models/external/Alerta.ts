// TODO(contrato pendiente): campos provisionales, tomados de los datos de
// ejemplo que ya mostraba la vista Alertas (ver alertas.js). Confirmar
// contra la documentación real de la plataforma externa.
export type SeveridadAlerta = 'high' | 'medium' | 'low' | 'info';

export interface AlertaClinica {
  paciente: string;
  severidad: SeveridadAlerta;
  mensaje: string;
  fecha: string;
  tratamientoIniciado: boolean;
  estudioRealizado: boolean;
}
