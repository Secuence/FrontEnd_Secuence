import type { MedicoDesempeno } from '@/models/external/Medico';

// TODO(contrato pendiente): reemplazar el arreglo de abajo por una llamada
// real, ej. `(await externalApiClient.get<MedicoDesempeno[]>('/medicos/desempeno')).data`,
// cuando exista el contrato de la plataforma externa. Por ahora devuelve los
// mismos datos de ejemplo que ya mostraba Indicadores (objeto DESEMPENO en
// app.js), para no cambiar nada visualmente todavía.
const MOCK_DESEMPENO: MedicoDesempeno[] = [
  { nombre: 'Camila Rojas', titulo: 'Dra.', especialidad: 'Cardiología', pacientesAtendidos: 128, alertasPorAtender: 3, seguimientosEnCurso: 42, adherenciaTratamiento: 94, estudiosRealizados: 88, nps: 72 },
  { nombre: 'Andrés Beltrán', titulo: 'Dr.', especialidad: 'Medicina interna', pacientesAtendidos: 96, alertasPorAtender: 5, seguimientosEnCurso: 37, adherenciaTratamiento: 88, estudiosRealizados: 81, nps: 65 },
  { nombre: 'Lucía Naranjo', titulo: 'Dra.', especialidad: 'Endocrinología', pacientesAtendidos: 74, alertasPorAtender: 2, seguimientosEnCurso: 29, adherenciaTratamiento: 91, estudiosRealizados: 90, nps: 78 },
  { nombre: 'Tomás Quiroga', titulo: 'Dr.', especialidad: 'Neumología', pacientesAtendidos: 58, alertasPorAtender: 7, seguimientosEnCurso: 21, adherenciaTratamiento: 85, estudiosRealizados: 76, nps: 61 },
  { nombre: 'Mateo Salazar', titulo: 'Dr.', especialidad: 'Nefrología', pacientesAtendidos: 112, alertasPorAtender: 4, seguimientosEnCurso: 33, adherenciaTratamiento: 92, estudiosRealizados: 85, nps: 70 },
];

export const MedicoService = {
  getDesempeno: async (): Promise<MedicoDesempeno[]> => {
    return MOCK_DESEMPENO;
  },
};
