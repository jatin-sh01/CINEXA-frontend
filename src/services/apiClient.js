


const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  return `http://${window.location.hostname}:3000`;
};

const BASE_URL = getBaseUrl();


const requestCache = new Map();


let authToken = null;


export function setAuthToken(token) {
  authToken = token;
}


export function clearAuthToken() {
  authToken = null;
}


export function getAuthToken() {
  return authToken;
}


class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}


async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      
      
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        throw err;
      }
      
      
      if (attempt === maxRetries) {
        break;
      }
      
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}


async function request(method, path, body = null, params = null) {
  const url = new URL(path, BASE_URL);
  
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (body !== undefined && body !== null) {
    options.body = JSON.stringify(body);
  }

  
  const debug = import.meta.env.VITE_API_DEBUG === 'true';
  
  if (debug) {
    console.log(`[API] ${method} ${url.toString()}`, body);
  }

  try {
    const response = await fetch(url.toString(), options);
    let data = null;

    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    }

    if (!response.ok) {
      const errorMessage = data?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    if (debug) {
      console.log(`[API] ${method} ${url.toString()} → Success`, data);
    }

    return data;
  } catch (error) {
    if (debug) {
      console.error(`[API] ${method} ${url.toString()} → Error`, error);
    }
    throw error;
  }
}


async function makeRequest(method, path, body = null, params = null) {
  const cacheKey = `${method}:${path}:${JSON.stringify(params)}`;

  
  if (method === 'GET' && requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  
  const promise = retryWithBackoff(() => request(method, path, body, params));

  
  if (method === 'GET') {
    requestCache.set(cacheKey, promise);
    
    
    promise
      .then(() => requestCache.delete(cacheKey))
      .catch(() => requestCache.delete(cacheKey));
  }

  return promise;
}


export const apiClient = {
  
  get: (path, params) => makeRequest('GET', path, null, params),

  
  post: (path, body) => makeRequest('POST', path, body),

  
  put: (path, body) => makeRequest('PUT', path, body),

  
  patch: (path, body) => makeRequest('PATCH', path, body),

  
  delete: (path) => makeRequest('DELETE', path),
};


export default {
  get: apiClient.get,
  post: apiClient.post,
  put: apiClient.put,
  patch: apiClient.patch,
  delete: apiClient.delete,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
};
