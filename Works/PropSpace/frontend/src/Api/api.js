import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api'
});

api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor for responses to handle global error codes
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                // Clear state and force redirect to login only on 401
                localStorage.removeItem('userInfo');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            // If status === 403, we intentionally do NOT logout the user according to spec.
            // The frontend catch blocks will handle displaying the forbidden error message.
        }
        return Promise.reject(error);
    }
);

export default api;
