/* URL base de las rutas API del backend. */
const API_URL = 'http://localhost:4000/api';

/* URL base general del backend. */
const BASE_URL = 'http://localhost:4000';

/* Construye los headers comunes de la petición. */
function buildHeaders(token, isFormData = false) {
  const headers = {};

  /* Si no es FormData, envía el body como JSON. */
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  /* Si existe token, lo agrega en el header Authorization. */
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  /* Devuelve el objeto final de headers. */
  return headers;
}

/* Hace peticiones al backend. */
export async function apiRequest(endpoint, options = {}, token = '') {
  /* Verifica si el body enviado es de tipo FormData. */
  const isFormData = options.body instanceof FormData;

  /* Envía la petición al backend usando fetch. */
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...buildHeaders(token, isFormData),
      ...(options.headers || {}),
    },
  });

  /* Intenta convertir la respuesta a JSON. */
  const data = await response.json().catch(() => ({}));

  /* Si la respuesta no fue exitosa, lanza un error. */
  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición.');
  }

  /* Devuelve los datos recibidos del backend. */
  return data;
}

/* Exporta las URLs para usarlas en otros archivos. */
export { API_URL, BASE_URL };