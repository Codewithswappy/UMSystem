import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// For direct file/resource URLs (without /api prefix)
export const getServerUrl = () => {
  return API_BASE_URL.replace(/\/api$/, '');
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Admin API calls
export const adminAPI = {
    getProfile: async (adminId) => {
        try {
            const response = await api.get(`/admin/${adminId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateProfile: async (adminId, data) => {
        try {
            const response = await api.put(`/admin/${adminId}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    changePassword: async (adminId, passwordData) => {
        try {
            const response = await api.put(`/admin/${adminId}/password`, passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteAccount: async (adminId) => {
        try {
            const response = await api.delete(`/admin/${adminId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getAllAdmins: async () => {
        try {
            const response = await api.get('/admin');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    createAdmin: async (data) => {
        try {
            const response = await api.post('/admin', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

// Student API calls
export const studentAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/students');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/students/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/students', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    update: async (id, data) => {
        try {
            const isFormData = data instanceof FormData;
            const config = isFormData ? {
                headers: { 'Content-Type': 'multipart/form-data' }
            } : {};

            const response = await api.put(`/students/${id}`, data, config);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/students/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getStats: async () => {
        try {
            const response = await api.get('/students/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

// Faculty API calls
export const facultyAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/faculty');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/faculty/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/faculty', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.put(`/faculty/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/faculty/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getStats: async () => {
        try {
            const response = await api.get('/faculty/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

// Application API calls
export const applicationAPI = {
    getAll: async (status) => {
        try {
            const url = status ? `/applications?status=${status}` : '/applications';
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/applications/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/applications', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    approve: async (id, adminId, department, course) => {
        try {
            const response = await api.put(`/applications/${id}/approve`, { adminId, department, course });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    reject: async (id, adminId, reason) => {
        try {
            const response = await api.put(`/applications/${id}/reject`, { adminId, reason });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/applications/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getStats: async () => {
        try {
            const response = await api.get('/applications/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

// Announcement API calls
export const announcementAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/announcements');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/announcements', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/announcements/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default api;
