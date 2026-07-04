# Secuence — Frontend Dashboard

Frontend de Secuence (React + TypeScript + Tailwind, sobre Vite). El diseño se
origina en Claude Design (Figma) y se integra aquí con Claude Code.

## Cómo correrlo

```bash
npm install
npm run dev
```

Antes de correrlo por primera vez, copia `.env.example` a `.env` y ajusta
`VITE_API_BASE_URL` con la URL del backend (Dev/QA/Prod tienen URLs distintas).
El repo ya trae un `.env` local apuntando a `https://localhost:5001` — nunca
se sube a git (ver `.gitignore`).

## Estructura de carpetas — por qué está así

El diseño en Figma cambia todo el tiempo; la integración con el backend
(login, tokens, llamadas API) no debería romperse cada vez que llega una
versión nueva del diseño. Por eso el código está partido en dos mundos:

```
src/
  ui/         → SOLO visual. Lo que exportas de Claude Design va aquí.
               Se puede reemplazar completo sin miedo.
  features/   → Lógica de negocio: conecta ui/ con services/ y hooks/.
               NUNCA se sobrescribe al actualizar un diseño.
  services/   → Única capa de llamadas HTTP (apiClient centralizado +
               un archivo por entidad, ej. UserService.ts). Ningún
               componente debe llamar a la API directo.
  models/     → Interfaces TypeScript que reflejan los DTOs del backend
               ({Entidad}{Acción}Dto, ej. UserCreateDto).
  hooks/      → Estado compartido (ej. useAuth: token JWT en memoria).
  router/     → Rutas de la app y protección de rutas privadas.
  config/     → Lectura de variables de entorno (.env).
```

**Regla de oro al integrar un nuevo diseño de Claude Design:** el archivo que
reemplazas vive en `ui/`. Si ese componente necesita datos reales o manejar
un evento, la conexión se hace en `features/`, importando el componente
visual — nunca metas `fetch`/`axios` ni tokens dentro de `ui/`.
Ejemplo completo del patrón: [`src/features/auth/LoginPage.tsx`](src/features/auth/LoginPage.tsx).

## Reglas de seguridad (no negociables)

- El token JWT nunca se guarda en `localStorage` sin protección — vive en
  memoria de estado (`useAuth`, Zustand). Se pierde al refrescar la página;
  es el trade-off de seguridad aceptado para datos clínicos.
- Ninguna llamada HTTP se hace fuera de `services/apiClient.ts`.
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
response de cada endpoint, códigos HTTP específicos, ERD actualizado. No
asumir — preguntar antes de construir sobre esos huecos.

## Control de versiones — flujo Dev → QA → Prod

El repo usa tres ramas ambiente: `Dev` → `QA` → `Prod`. Ningún cambio pasa
directo de `Dev` a `Prod`; siempre recorre `QA` primero. Trabaja tus cambios
en `Dev` (o en una rama corta desde `Dev`), y promueve con PR/merge hacia
`QA` y luego `Prod` cuando esté validado.

## Roadmap técnico ya contemplado en la arquitectura del backend

IA médica (alertas/indicadores clínicos), gestión documental, almacenamiento
en la nube, integración con WhatsApp, WebSockets para notificaciones en
tiempo real. No hace falta construir nada de esto ahora — la capa de
`services/` está pensada para poder sumarlo sin reescribir la app.
