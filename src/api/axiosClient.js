import axios from 'axios'

// Determine baseURL: prefer explicit env var; during local dev use '' so Vite proxy forwards to remote backend.
const envBase = import.meta?.env?.VITE_API_BASE ?? window.__API_BASE__ ?? ''
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
// In development (served from localhost) prefer an empty baseURL so Vite dev server proxy handles CORS.
// This avoids accidental absolute base URLs (eg. http://localhost:3001) that bypass the proxy.
const baseURL = isLocalhost ? '' : (envBase || 'https://backend-observatory.onrender.com')

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Debug: show resolved baseURL in browser console to help diagnose proxy/CORS issues
try {
  // eslint-disable-next-line no-console
  console.debug('axiosClient baseURL resolved to:', baseURL, 'isLocalhost:', isLocalhost)
} catch (e) {
  // ignore
}

// Interceptor para agregar token y manejar Content-Type dinámicamente
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Detecta si el cuerpo de la solicitud es FormData
    if (config.data instanceof FormData) {
      // No seteamos Content-Type, Axios lo manejará
      delete config.headers['Content-Type']
    } else {
      // Establece JSON por defecto si no es FormData
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor de respuesta para manejar errores 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('authToken')
      } catch (e) {
        // ignore
      }
      try {
        // Use hash-based redirect consistent with the app router
        window.location.hash = '#/login'
        window.location.reload()
      } catch (e) {
        // fallback to href if hash not supported
        try {
          window.location.href = '/login'
        } catch (e2) {
          // ignore
        }
      }
    }
    return Promise.reject(error)
  },
)

export default axiosClient