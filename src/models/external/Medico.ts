// TODO(contrato pendiente): campos provisionales, tomados de los datos de
// ejemplo que ya mostraba Indicadores (ver app.js, objeto DESEMPENO).
// `nombre` va sin título (ej. "Camila Rojas") porque debe calzar con el
// nombre usado en el store de usuarios (Roles y permisos) — `titulo` es el
// tratamiento por separado (ej. "Dra."). Confirmar nombres/tipos reales
// cuando la plataforma externa entregue su documentación.
export interface MedicoDesempeno {
  nombre: string;
  titulo: string;
  especialidad: string;
  pacientesAtendidos: number;
  alertasPorAtender: number;
  seguimientosEnCurso: number;
  adherenciaTratamiento: number;
  estudiosRealizados: number;
  nps: number;
}
