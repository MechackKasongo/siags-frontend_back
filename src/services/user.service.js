//import axios from 'axios';

import api from './http-common.js';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/admin/';

class UserService {
    getUsers() {
        // Cet endpoint nécessite un rôle ADMIN
        return api.get(API_URL + 'users', { headers: authHeader() });
    }

    // Nouvelle méthode pour mettre à jour un utilisateur
    updateUser(id, userData) {
        return api.put(API_URL + `users/${id}`, userData, { headers: authHeader() });
    }

    // Nouvelle méthode pour supprimer un utilisateur
    deleteUser(id) {
        return api.delete(API_URL + `users/${id}`, { headers: authHeader() });
    }

    // Vous pouvez ajouter d'autres méthodes pour la gestion des utilisateurs (création, mise à jour, suppression)
    // createUser(userData) { ... }
    // deleteUser(userId) { ... }
}

export default new UserService();