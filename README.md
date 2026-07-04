# Secuence — Frontend Dashboard

Frontend de Secuence. **No es una SPA de React**: es el sitio HTML/CSS/JS tal
como lo exporta Claude Design (`index.html` + `auth-flow.html` + un archivo
JS/CSS por vista), servido y empaquetado con Vite. Se eligió así después de
intentar portar el export a React vista por vista — el export ya funciona,
tiene su propia navegación (hash routing) e interactividad (tablas, filtros,
diálogos); reescribirlo a mano solo agregaba riesgo sin necesidad real.

## Cómo correrlo

```bash
npm install
npm run dev
```

Antes de correrlo por primera vez, copia `.env.example` a `.env` y ajusta
`VITE_API_BASE_URL` con la URL del backend (Dev/QA/Prod tienen URLs distintas).
El repo ya trae un `.env` local apuntando a `https://localhost:5001` — nunca
se sube a git (ver `.gitignore`).

## Estructura — qué es diseño y qué es integración

```
index.html          → Vista principal (Indicadores, Alertas, Seguimientos,
                       Historias, Roles y permisos, Mi perfil...), hash router.
auth-flow.html       → Login / onboarding, autocontenido.
*.css, *.js          → Un archivo por vista, tal como lo exporta Claude Design.
assets/, bienvenida-assets/, fonts/ → Recursos estáticos del export.

src/
  services/          → Backend propio de Secuence: apiClient.ts centralizado +
                       un archivo por entidad (ej. UserService.ts). Cubre
                       Login y Roles y permisos.
  services/external/ → Plataforma externa (pacientes/historias + médicos,
                       ver sección de abajo). Cubre Indicadores/Alertas y
                       Seguimientos.
  models/            → Interfaces TypeScript de ambos backends, con TODOs
                       explícitos donde el contrato real aún no existe.
  state/             → authStore.ts: token JWT en memoria (sin localStorage).
  config/            → Lectura de variables de entorno (.env).
```

Los `.js` de cada vista importan desde `src/services/` o `src/services/external/`
según corresponda — nunca hacen `fetch`/`axios` sueltos.

**Regla al traer una nueva versión de Claude Design:** los archivos que se
reemplazan son `index.html`/`auth-flow.html`/`*.css`/`*.js` en la raíz y sus
carpetas de assets. Antes de sobrescribir un `.js` de vista, revisa si ya
tiene una llamada real a `src/services/` integrada (ver Roles y permisos) —
si la tiene, vuelve a aplicar esa integración sobre el archivo nuevo en vez
de perderla.

## Reglas de seguridad (no negociables)

- El token JWT nunca se guarda en `localStorage` sin protección — vive en
  memoria (`src/state/authStore.ts`). Se pierde al refrescar la página; es
  el trade-off de seguridad aceptado para datos clínicos.
- Ninguna llamada HTTP se hace fuera de `src/services/apiClient.ts`.
- La URL del backend y cualquier dato sensible van en `.env`, nunca
  hardcodeados ni commiteados.
- Todos los endpoints requieren `Authorization: Bearer <token>`, excepto
  `POST /api/User/Login`.

## Backend

C# / .NET, REST, PostgreSQL, JWT Bearer. Endpoints documentados hasta ahora
(módulo de usuarios):

| Método | Endpoint | Auth |
|---|---|---|
| POST | `/api/User/Login` | No |
| POST | `/api/User/CreateUser` | Sí |
| GET | `/api/User/GetAllUsers` | Sí |
| PUT | `/api/User/UpdateUser/{id}` | Sí |
| DELETE | `/api/User/DeleteUser/{id}` | Sí |

Pendiente por confirmar con el developer de backend: estructura exacta de
response de cada endpoint, códigos HTTP específicos, ERD actualizado.

## Plataforma externa (Indicadores / Alertas / Seguimientos)

La primera versión del producto se integra con una plataforma externa ya
existente, a través de una API que todavía no nos han entregado (sin
contrato ni documentación aún, al 2026-07-04). Esa API cubrirá datos de
pacientes/historias clínicas y de médicos, y alimentará las vistas
**Indicadores/Alertas** y **Seguimientos**.

Como no existe el contrato real, se dejó una capa "intercambiable" en
`src/services/external/` (`MedicoService`, `SeguimientoService`,
`AlertaService` + sus modelos en `src/models/external/`): hoy devuelven los
mismos datos de ejemplo que ya traía el diseño, pero las vistas ya las
consumen a través de esta capa. Cuando llegue el contrato real, solo hay que
cambiar la implementación de estos 3 servicios (y `VITE_EXTERNAL_API_BASE_URL`
en `.env`) — no hay que tocar `index.html` ni las vistas.

"Historias y evoluciones" y "Mi perfil" no están definidas todavía — siguen
con datos de ejemplo hasta que se aclare su fuente.

## Control de versiones — flujo Dev → QA → Prod

El repo usa tres ramas ambiente: `Dev` → `QA` → `Prod`. Ningún cambio pasa
directo de `Dev` a `Prod`; siempre recorre `QA` primero. Trabaja tus cambios
en `Dev` (o en una rama corta desde `Dev`), y promueve con PR/merge hacia
`QA` y luego `Prod` cuando esté validado.

## Roadmap técnico ya contemplado en la arquitectura del backend

IA médica (alertas/indicadores clínicos), gestión documental, almacenamiento
en la nube, integración con WhatsApp, WebSockets para notificaciones en
tiempo real. No hace falta construir nada de esto ahora — la capa de
`src/services/` está pensada para poder sumarlo sin reescribir el sitio.
