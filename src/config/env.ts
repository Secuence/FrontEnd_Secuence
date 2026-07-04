const required = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${key}. Revisa tu archivo .env (copia .env.example si no existe).`,
    );
  }
  return value;
};

export const env = {
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
};
