// Los nombres reflejan el patrón de DTOs del backend ({Entidad}{Acción}Dto)
// para trazabilidad directa entre request y modelo.

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserCreateDto {
  fullName: string;
  email: string;
  password: string;
  country: string;
  photo: string;
  userType: string;
  policesAccepted: boolean;
}

export interface UserUpdateDto {
  fullName: string;
  email: string;
  password: string;
  country: string;
  photo: string;
  userType: string;
  status: string;
}

// NOTA (confirmado vía /swagger/v1/swagger.json del backend real, 2026-07-05):
// GetAllUsers usa `pagNumber`/`pagSize` (no pageNumber/pageSize como decía la
// doc escrita), UpdateUser/DeleteUser reciben `id` como query param (no como
// segmento de ruta /UpdateUser/{id}), y UserUpdateDto.status es number, no
// string. Pendiente actualizar UserService para estos 3 endpoints (fuera del
// alcance de la integración de Login).
export interface GetAllUsersParams {
  healthCenterFilter?: string;
  pageNumber: number;
  pageSize: number;
  emailFilter?: string;
  statusFilter?: string;
}

// Confirmado contra el backend real (2026-07-05): toda respuesta viene
// envuelta en este sobre genérico, incluso los errores (ej. login con
// credenciales inválidas devuelve HTTP 404 con ok:0 y el mensaje de error
// en `message` — no uses el status HTTP para decidir éxito/error, usa `ok`).
export interface ApiEnvelope<T = unknown> {
  ok: number;
  data: T;
  message: string;
  id: number;
}

// TODO(backend pendiente): la forma real de `data` en un login EXITOSO no
// está confirmada todavía (Swagger no la documenta y no hubo credenciales
// válidas para probarla). No asumir este tipo como definitivo — la
// integración en auth-flow.html busca el token de forma defensiva y avisa
// por consola si no lo encuentra en ninguna de las formas esperadas.
export interface UserLoginResponseDto {
  token: string;
  user?: {
    id: number;
    fullName: string;
    userType: string;
  };
}
