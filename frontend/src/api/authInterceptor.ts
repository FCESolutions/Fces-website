import api from './http'

function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true; // invalid token format
  }
}

export function setupAuthInterceptor() {
  api.interceptors.request.use(
    config => {
      const token = localStorage.getItem('admin_token');

      if (token) {
        if (isTokenExpired(token)) {
          console.warn('Token expired — logging out');
          localStorage.removeItem('admin_token');
          window.location.reload(); // Or redirect to login
          return Promise.reject(new Error('Token expired'));
        }

        if (config?.url?.includes('/admin')) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    error => Promise.reject(error)
  );

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        console.warn('Unauthorized – token may be invalid');
        localStorage.removeItem('admin_token');
        //window.location.reload();
      }
      return Promise.reject(error);
    }
  );
}
