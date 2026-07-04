# ui/

Aquí van los componentes y páginas exportados de Claude Design (Figma), tal cual
salen del diseño: solo HTML/JSX + Tailwind, sin llamadas a la API ni lógica de
negocio adentro.

Regla clave: cuando actualices un diseño desde Claude Design, **el archivo que
reemplazas es el de aquí**, nunca uno de `src/features/`, `src/services/`,
`src/hooks/` o `src/models/`. Así una actualización visual nunca borra la
integración con el backend ya construida.

- `components/` — piezas reutilizables (botones, cards, inputs, tablas...).
- `pages/` — pantallas completas tal como las exporta el diseño.

Si un componente exportado por el diseño necesita datos reales o manejar un
evento (ej. un formulario de login), no le agregues la lógica aquí: créalo en
`src/features/` importando el componente visual desde `ui/` y conectándolo ahí.
Mira `src/features/auth/LoginPage.tsx` como ejemplo.
