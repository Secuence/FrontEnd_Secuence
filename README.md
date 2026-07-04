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
  services/   → Única capa de llamadas HTTP (apiClient.ts centralizado +
               un archivo por entidad, ej. UserService.ts). Los .js de arriba
               importan desde aquí — nunca hacen fetch/axios sueltos.
  models/     → Interfaces TypeScript que reflejan los DTOs del backend
               ({Entidad}{Acción}Dto, ej. UserCreateDto).
  state/      → authStore.ts: token JWT en memoria (sin localStorage).
  config/     → Lectura de variables de entorno (.env).
```

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
response de cada endpoint, códigos HTTP específicos, ERD actualizado. Hasta
que no se documenten más endpoints, las vistas fuera de Login/Roles y
permisos siguen mostrando datos de ejemplo (los mismos que trae el export).

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
