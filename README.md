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
El repo ya trae un `.env` local apuntando al backend real en Railway — nunca
se sube a git (ver `.gitignore`).

⚠ **El backend real todavía no tiene CORS configurado** (confirmado
2026-07-05: `OPTIONS /api/User/Login` responde `405` sin cabeceras
`Access-Control-*`). Esto bloquea cualquier llamada desde el navegador, no
solo en local. Mientras el developer de backend no lo arregle:
- En `npm run dev` no hace falta hacer nada — `vite.config.ts` ya tiene un
  proxy que esquiva el problema (las peticiones pasan por el propio dev
  server, no directo desde el navegador).
- Un build de producción (`npm run build` / desplegado) **sí** necesitará
  que el backend permita el origen real del frontend por CORS antes de
  funcionar.

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

- El token JWT nunca se guarda en `localStorage` — vive en `sessionStorage`
  (`src/state/authStore.ts`). Se decidió así el 2026-07-05: login (`auth-flow.html`)
  y dashboard (`index.html`) son páginas separadas, así que una variable en
  memoria pura se perdía al saltar de una a otra. `sessionStorage` sobrevive
  ese salto pero se borra al cerrar la pestaña — no persiste entre sesiones
  del navegador como sí haría `localStorage`.
- `index.html` redirige a `auth-flow.html#/auth/login` si no hay sesión
  activa, y `auth-flow.html` redirige de vuelta al dashboard si ya la hay.
  El nombre mostrado en el drawer (`.nav-user .name`) sale del claim `name`
  del JWT (`getUserName()` en `authStore.ts`), no de un valor fijo.
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
| GET | `/api/User/GetAllUsers?pagNumber&pagSize&...` | Sí |
| PUT | `/api/User/UpdateUser?id=` | Sí |
| DELETE | `/api/User/DeleteUser?id=` | Sí |

Contrato confirmado el 2026-07-05 contra el Swagger real
(`/swagger/v1/swagger.json` del backend) — difiere en varios puntos de la
doc escrita original: `GetAllUsers` usa `pagNumber`/`pagSize` (no
`pageNumber`/`pageSize`), `UpdateUser`/`DeleteUser` reciben `id` por query
param (no como `/UpdateUser/{id}`), y `UserUpdate.status` /
`UserCreate.policesAccepted` son `number`, no string/boolean.

Toda respuesta viene envuelta en `{ ok, data, message, id }` — **incluso los
errores de negocio llegan con status HTTP no estándar** (ej. login inválido
devuelve 404, no 401). Usa siempre el campo `ok` para decidir éxito/error,
nunca el status HTTP. La forma de `data` en un login exitoso todavía no está
confirmada (sin credenciales válidas para probarla) — `UserService.login`
la maneja de forma defensiva.

Pendiente por confirmar con el developer de backend: forma real de `data`
en cada respuesta exitosa, ERD actualizado, y sobre todo — **arreglar CORS**.

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

## Fuera del MVP (2026-07-05)

"Historias y evoluciones", "Roles y permisos" (+ "Nuevo usuario"/"Detalle de
usuario") y "Mi perfil" no salen en esta primera versión del producto. Se
quitaron del drawer y de las rutas (`app.js`, `var ROUTES`) — cualquier
acceso directo por URL a esas pantallas redirige a Indicadores.

El HTML/CSS/JS de esas vistas **no se borró**, sigue en el proyecto (en
`index.html`, comentado el bloque del drawer correspondiente) por si vuelven
después del MVP: alcanza con descomentar el nav en `index.html` y las
entradas correspondientes en `var ROUTES` de `app.js`.

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
