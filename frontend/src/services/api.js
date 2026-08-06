import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agentflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle 429 Too Many Requests & format retry errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers ? (error.response.headers['retry-after'] || error.response.headers.get?.('retry-after')) : null;
      const waitSeconds = retryAfter ? parseInt(retryAfter, 10) : 95;
      const rateLimitMsg = `Too many requests. Please wait ${waitSeconds} seconds before trying again.`;
      
      if (!error.response.data || typeof error.response.data !== 'object') {
        error.response.data = {};
      }
      error.response.data.message = error.response.data.message || rateLimitMsg;
      error.message = rateLimitMsg;
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// Requests Service
export const requestService = {
  createRequest: async (data) => {
    const res = await api.post('/requests', data);
    return res.data;
  },
  getAllRequests: async () => {
    const res = await api.get('/requests');
    return res.data;
  },
  getRequestById: async (id) => {
    const res = await api.get(`/requests/${id}`);
    return res.data;
  },
  getRequestLogs: async (id) => {
    const res = await api.get(`/requests/${id}/logs`);
    return res.data;
  },
};

// Reports Service
export const reportService = {
  getAllReports: async () => {
    const res = await api.get('/reports');
    return res.data;
  },
  getReportByRequestId: async (requestId) => {
    const res = await api.get(`/reports/${requestId}`);
    return res.data;
  },
};

// Analytics Service
export const analyticsService = {
  getOverview: async () => {
    const res = await api.get('/analytics');
    return res.data;
  },
};

export default api;
