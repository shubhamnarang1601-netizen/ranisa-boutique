import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = 'roshni_admin_token_v1';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// ---- Public ----
export const fetchProducts = async (collection) => {
  const params = collection ? { collection } : {};
  const { data } = await axios.get(`${API}/products`, { params });
  return data;
};

export const fetchProduct = async (slug) => {
  const { data } = await axios.get(`${API}/products/${slug}`);
  return data;
};

// ---- Admin ----
export const adminLogin = async (username, password) => {
  const { data } = await axios.post(`${API}/admin/login`, { username, password });
  setToken(data.token);
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await axios.post(`${API}/products`, payload, { headers: authHeaders() });
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await axios.put(`${API}/products/${id}`, payload, { headers: authHeaders() });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`${API}/products/${id}`, { headers: authHeaders() });
  return data;
};

export const uploadImage = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await axios.post(`${API}/upload`, form, {
    headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
};
