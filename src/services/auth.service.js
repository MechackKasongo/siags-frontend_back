// src/services/auth.service.js

import axios from 'axios';
import api from './api.service'; // Assurez-vous que api.service est correctement configuré si utilisé ailleurs

const API_URL = 'http://localhost:8080/api/v1/auth/';

class AuthService {
    async register(userData) {
        return axios.post(API_URL + "signup", {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            roles: userData.roles,
        });
    }

    async login(username, password) {
        const response = await axios.post(API_URL + "signin", {
            username,
            password,
        });
        // **** MODIFICATION ICI : Assurez-vous que c'est bien 'token' ****
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    }

    async getAvailableRoles() {
        return api.get('/auth/roles');
    }
}

export default new AuthService();