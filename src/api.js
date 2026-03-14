const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;

  
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:3000";
  }

  
  return `http://${window.location.hostname}:3000`;
};

const BASE_URL = getBaseUrl();

let _token = null;

export function setToken(t) { _token = t; }
export function clearToken() { _token = null; }
export function getToken() { return _token; }

async function request(method, path, body, params) {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }

  const headers = { "Content-Type": "application/json" };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;

  const opts = { method, headers };
  if (body !== undefined && body !== null) opts.body = JSON.stringify(body);

  const res = await fetch(url.toString(), opts);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const get = (path, params) => request("GET", path, null, params);
export const post = (path, body) => request("POST", path, body);
export const put = (path, body) => request("PUT", path, body);
export const patch = (path, body) => request("PATCH", path, body);
export const del = (path) => request("DELETE", path);

export default { setToken, clearToken, getToken, get, post, put, patch, del };