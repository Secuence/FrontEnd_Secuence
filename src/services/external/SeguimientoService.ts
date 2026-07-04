import type { SeguimientoResumen } from '@/models/external/Seguimiento';

// TODO(contrato pendiente): reemplazar por una llamada real, ej.
// `(await externalApiClient.get<SeguimientoResumen[]>('/seguimientos')).data`,
// cuando exista el contrato de la plataforma externa. Datos de ejemplo
// idénticos a los que ya mostraba la vista Seguimientos.
const MOCK_SEGUIMIENTOS: SeguimientoResumen[] = [
  { paciente: 'María Fernanda Gómez', ultimoSeguimiento: '12 may. 2026', proximoSeguimiento: '19 may. 2026', ultimaConsulta: '05 may. 2026', alerta: 'alta', nps: 72 },
  { paciente: 'Carlos Andrés Beltrán', ultimoSeguimiento: '11 may. 2026', proximoSeguimiento: '18 may. 2026', ultimaConsulta: '04 may. 2026', alerta: 'media', nps: 64 },
  { paciente: 'Valentina Ríos Mejía', ultimoSeguimiento: '10 may. 2026', proximoSeguimiento: '17 may. 2026', ultimaConsulta: '03 may. 2026', alerta: 'media', nps: 80 },
  { paciente: 'Jorge Esteban Niño', ultimoSeguimiento: '09 may. 2026', proximoSeguimiento: '16 may. 2026', ultimaConsulta: '02 may. 2026', alerta: 'baja', nps: 91 },
  { paciente: 'Lucía Naranjo Soto', ultimoSeguimiento: '08 may. 2026', proximoSeguimiento: '15 may. 2026', ultimaConsulta: '01 may. 2026', alerta: 'baja', nps: 88 },
  { paciente: 'Tomás Quiroga Páez', ultimoSeguimiento: '07 may. 2026', proximoSeguimiento: '14 may. 2026', ultimaConsulta: '30 abr. 2026', alerta: 'baja', nps: 85 },
  { paciente: 'Daniela Ospina Vargas', ultimoSeguimiento: '06 may. 2026', proximoSeguimiento: '13 may. 2026', ultimaConsulta: '29 abr. 2026', alerta: 'media', nps: 69 },
  { paciente: 'Mateo Salazar Cano', ultimoSeguimiento: '05 may. 2026', proximoSeguimiento: '12 may. 2026', ultimaConsulta: '28 abr. 2026', alerta: 'baja', nps: 90 },
  { paciente: 'Camila Rojas Duarte', ultimoSeguimiento: '04 may. 2026', proximoSeguimiento: '11 may. 2026', ultimaConsulta: '27 abr. 2026', alerta: 'alta', nps: 58 },
  { paciente: 'Andrés Felipe Mora', ultimoSeguimiento: '03 may. 2026', proximoSeguimiento: '10 may. 2026', ultimaConsulta: '26 abr. 2026', alerta: 'baja', nps: 93 },
  { paciente: 'Paula Restrepo Lara', ultimoSeguimiento: '02 may. 2026', proximoSeguimiento: '09 may. 2026', ultimaConsulta: '25 abr. 2026', alerta: 'media', nps: 66 },
  { paciente: 'Santiago Cárdenas Ruiz', ultimoSeguimiento: '01 may. 2026', proximoSeguimiento: '08 may. 2026', ultimaConsulta: '24 abr. 2026', alerta: 'baja', nps: 87 },
  { paciente: 'Isabella Torres León', ultimoSeguimiento: '30 abr. 2026', proximoSeguimiento: '07 may. 2026', ultimaConsulta: '23 abr. 2026', alerta: 'alta', nps: 61 },
  { paciente: 'Sebastián Pérez Díaz', ultimoSeguimiento: '29 abr. 2026', proximoSeguimiento: '06 may. 2026', ultimaConsulta: '22 abr. 2026', alerta: 'baja', nps: 89 },
  { paciente: 'Mariana Castro Gil', ultimoSeguimiento: '28 abr. 2026', proximoSeguimiento: '05 may. 2026', ultimaConsulta: '21 abr. 2026', alerta: 'media', nps: 74 },
  { paciente: 'Nicolás Herrera Pino', ultimoSeguimiento: '27 abr. 2026', proximoSeguimiento: '04 may. 2026', ultimaConsulta: '20 abr. 2026', alerta: 'baja', nps: 92 },
  { paciente: 'Sara Gutiérrez Vélez', ultimoSeguimiento: '26 abr. 2026', proximoSeguimiento: '03 may. 2026', ultimaConsulta: '19 abr. 2026', alerta: 'baja', nps: 86 },
  { paciente: 'Emilio Vargas Acosta', ultimoSeguimiento: '25 abr. 2026', proximoSeguimiento: '02 may. 2026', ultimaConsulta: '18 abr. 2026', alerta: 'alta', nps: 60 },
  { paciente: 'Antonia Mejía Cuervo', ultimoSeguimiento: '24 abr. 2026', proximoSeguimiento: '01 may. 2026', ultimaConsulta: '17 abr. 2026', alerta: 'media', nps: 70 },
  { paciente: 'Felipe Arango Suárez', ultimoSeguimiento: '23 abr. 2026', proximoSeguimiento: '30 abr. 2026', ultimaConsulta: '16 abr. 2026', alerta: 'baja', nps: 94 },
  { paciente: 'Gabriela Pardo Nieto', ultimoSeguimiento: '22 abr. 2026', proximoSeguimiento: '29 abr. 2026', ultimaConsulta: '15 abr. 2026', alerta: 'baja', nps: 84 },
  { paciente: 'Juan David Lozano', ultimoSeguimiento: '21 abr. 2026', proximoSeguimiento: '28 abr. 2026', ultimaConsulta: '14 abr. 2026', alerta: 'media', nps: 67 },
  { paciente: 'Valeria Ramírez Cano', ultimoSeguimiento: '20 abr. 2026', proximoSeguimiento: '27 abr. 2026', ultimaConsulta: '13 abr. 2026', alerta: 'baja', nps: 90 },
  { paciente: 'Esteban Molina Rey', ultimoSeguimiento: '19 abr. 2026', proximoSeguimiento: '26 abr. 2026', ultimaConsulta: '12 abr. 2026', alerta: 'alta', nps: 59 },
];

export const SeguimientoService = {
  getResumen: async (): Promise<SeguimientoResumen[]> => {
    return MOCK_SEGUIMIENTOS;
  },
};
