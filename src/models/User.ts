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

export interface GetAllUsersParams {
  healthCenterFilter?: string;
  pageNumber: number;
  pageSize: number;
  emailFilter?: string;
  statusFilter?: string;
}

// TODO(backend pendiente): la estructura real de response de cada endpoint
// todavía no está documentada (ver 01_CONTEXTO, sección "Pendiente por parte
// de backend"). Los tipos de abajo son provisionales — confirmar contra el
// backend antes de asumirlos en producción.
export interface UserLoginResponseDto {
  token: string;
  user: {
    id: number;
    fullName: string;
    userType: string;
  };
}
