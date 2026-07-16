export const GENERIC_ERROR = 'Algo salió mal, por favor inténtalo de nuevo.';

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_TAKEN: 'Ese correo ya está registrado.',
  INVALID_CREDENTIALS: 'Correo o contraseña inválidos.',
  BLOG_NOT_FOUND: 'El blog que buscas no existe.',
  BLOG_FORBIDDEN: 'No tienes permiso para modificar este blog.',
  UNAUTHORIZED: 'Tu sesión expiró, por favor inicia sesión de nuevo.',
  CATEGORY_ALREADY_EXISTS: 'Esa categoría ya existe.',
};

export const getErrorMessage = (code?: string): string => {
  if (!code) return GENERIC_ERROR;

  return ERROR_MESSAGES[code] ?? GENERIC_ERROR;
};
