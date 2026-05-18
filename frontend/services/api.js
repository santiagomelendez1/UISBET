/* URL base del backend. */
const API_URL = 'http://localhost:4000/api';
const BASE_URL = 'http://localhost:4000';

/* Construye headers comunes. */
function buildHeaders(token, isFormData = false) {
  const headers = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/* Hace peticiones al backend. */
export async function apiRequest(endpoint, options = {}, token = '') {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...buildHeaders(token, isFormData),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición.');
  }

  return data;
}

export { API_URL, BASE_URL };