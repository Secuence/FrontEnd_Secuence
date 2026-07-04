# features/

Aquí vive la lógica de negocio: conecta los componentes visuales de `src/ui/`
con `src/services/` (llamadas API) y `src/hooks/` (estado como auth). Este
código **no se toca** cuando actualizas un diseño desde Claude Design.

Cada carpeta es un dominio (ej. `auth/`, `users/`, `seguimientos/`). Patrón a
seguir: ver `auth/LoginPage.tsx`.
