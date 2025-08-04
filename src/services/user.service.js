// src/services/user.service.js
import api from './api.service';

class UserService {
    // Méthode pour obtenir tous les utilisateurs (nécessite ROLE_ADMIN ou USER_READ)
    getAllUsers() {
        return api.get('/users');
    }

    // Exemple d'obtention d'un utilisateur par ID
    getUserById(id) {
        return api.get(`/users/${id}`);
    }

    // Méthode pour créer un nouvel utilisateur (admin seulement)
    createUser(userData) {
        return api.post('/users', userData);
    }

    // Méthode pour mettre à jour un utilisateur
    updateUser(id, userData) {
        return api.put(`/users/${id}`, userData);
    }

    // Méthode pour supprimer un utilisateur
    deleteUser(id) {
        return api.delete(`/users/${id}`);
    }

    // Méthode pour assigner un rôle à un utilisateur
    assignRoleToUser(userId, roleName) {
        return api.put(`/users/${userId}/role/${roleName}`);
    }
}

export default new UserService();