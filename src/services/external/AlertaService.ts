import type { AlertaClinica, SeveridadAlerta } from '@/models/external/Alerta';

// TODO(contrato pendiente): reemplazar la generación de abajo por una
// llamada real, ej. `(await externalApiClient.get<AlertaClinica[]>('/alertas')).data`,
// cuando exista el contrato de la plataforma externa. La lógica determinista
// de abajo reproduce exactamente los datos de ejemplo que ya mostraba la
// vista Alertas (ver alertas.js), para no cambiar nada visualmente todavía.

const NAMES = [
  'María Fernanda Gómez', 'Carlos Andrés Beltrán', 'Valentina Ríos Mejía',
  'Jorge Esteban Niño', 'Lucía Naranjo Soto', 'Tomás Quiroga Páez',
  'Daniela Ospina Vargas', 'Mateo Salazar Cano', 'Camila Rojas Duarte',
  'Andrés Felipe Mora', 'Paula Restrepo Lara', 'Santiago Cárdenas Ruiz',
  'Isabella Torres León', 'Sebastián Pérez Díaz', 'Mariana Castro Gil',
  'Nicolás Herrera Pino', 'Sara Gutiérrez Vélez', 'Emilio Vargas Acosta',
  'Antonia Mejía Cuervo', 'Felipe Arango Suárez', 'Gabriela Pardo Nieto',
  'Juan David Lozano', 'Valeria Ramírez Cano', 'Esteban Molina Rey',
];

const SEV_SEQ: SeveridadAlerta[] = [
  'high', 'high', 'medium', 'high', 'medium', 'high', 'low', 'medium', 'medium', 'low', 'info', 'low',
];

const MSG: Record<SeveridadAlerta, string[]> = {
  high: [
    'Disnea en aumento; omitió 3 dosis de inhalador esta semana. SpO₂ descendió a 91%.',
    'Refiere dolor torácico al esfuerzo; solicita valoración prioritaria.',
    'Fiebre persistente (38.5 °C) por más de 48 horas.',
    'Presión arterial sistólica superior a 180 mmHg en la última lectura.',
  ],
  medium: [
    'Presión arterial elevada en las últimas 2 mediciones domiciliarias.',
    'Glucemia en ayunas por encima del rango objetivo durante 4 días.',
    'Adherencia parcial al tratamiento; refiere dudas sobre la dosis.',
    'Persisten síntomas leves sin clara mejoría; requiere vigilancia.',
  ],
  low: [
    'Adherencia estable; síntomas en mejoría progresiva.',
    'Completó el seguimiento sin novedades; continúa el plan indicado.',
    'Evolución favorable; signos vitales dentro de rango.',
    'Buena tolerancia al tratamiento; sin efectos secundarios.',
  ],
  info: [
    'Nuevos resultados de laboratorio disponibles para revisión.',
    'El paciente respondió todas las preguntas del seguimiento.',
    'Recordatorio: próxima cita de control programada.',
    'Documentos clínicos actualizados en la historia.',
  ],
};

const MESES = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'];

function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const BASE = new Date(2026, 8, 13);

function buildMockAlertas(): AlertaClinica[] {
  return NAMES.map((name, i) => {
    const s = seed(name);
    const sev: SeveridadAlerta = SEV_SEQ[i] || (['high', 'medium', 'low', 'info'] as const)[s % 4];
    const msgs = MSG[sev];
    const msg = msgs[s % msgs.length];
    const dt = new Date(BASE.getTime());
    dt.setDate(dt.getDate() - i);
    const fecha = `${dt.getDate()} ${MESES[dt.getMonth()]} ${dt.getFullYear()}`;
    return {
      paciente: name,
      severidad: sev,
      mensaje: msg,
      fecha,
      tratamientoIniciado: ((s >> 2) % 10) > 3,
      estudioRealizado: ((s >> 5) % 10) > 4,
    };
  });
}

export const AlertaService = {
  getAlertas: async (): Promise<AlertaClinica[]> => {
    return buildMockAlertas();
  },
};
