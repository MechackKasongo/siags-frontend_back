//import axios from 'axios';
import api from './http-common.js';
import authHeader from './auth-header';

// MODIFICATION: Enlevez le slash final de l'URL de base.
const API_BASE_URL = 'http://localhost:8080/api/v1/admin/users';

class UserService {
    /**
     * Récupère la liste des utilisateurs, avec gestion de la pagination et de la recherche.
     * @param {number} page Le numéro de la page (commence à 0).
     * @param {number} size Le nombre d'éléments par page.
     * @param {string} searchTerm Le terme de recherche pour filtrer les utilisateurs.
     * @returns {Promise<any>} La réponse de l'API contenant les utilisateurs.
     */
    getUsers(page, size, searchTerm) {
        // La requête GET va maintenant vers l'URL exacte sans slash à la fin.
        // Les paramètres de pagination et de recherche sont ajoutés ici.
        return api.get(API_BASE_URL, {
            headers: authHeader(),
            params: {
                page,
                size,
                searchTerm
            }
        });
    }

    /**
     * Récupère un utilisateur par son ID.
     * @param {string} id L'ID de l'utilisateur.
     * @returns {Promise<any>} La réponse de l'API contenant les détails de l'utilisateur.
     */
    getUserById(id) {
        return api.get(`${API_BASE_URL}/${id}`, { headers: authHeader() });
    }

    /**
     * Met à jour un utilisateur existant.
     * @param {string} id L'ID de l'utilisateur à mettre à jour.
     * @param {object} userData Les données de l'utilisateur à mettre à jour.
     * @returns {Promise<any>} La réponse de l'API.
     */
    updateUser(id, userData) {
        return api.put(`${API_BASE_URL}/${id}`, userData, { headers: authHeader() });
    }

    /**
     * Crée un nouvel utilisateur.
     * @param {object} userData Les données du nouvel utilisateur.
     * @returns {Promise<any>} La réponse de l'API.
     */
    createUser(userData) {
        return api.post(API_BASE_URL, userData, { headers: authHeader() });
    }

    /**
     * Supprime un utilisateur par son ID.
     * @param {string} id L'ID de l'utilisateur à supprimer.
     * @returns {Promise<any>} La réponse de l'API.
     */
    deleteUser(id) {
        return api.delete(`${API_BASE_URL}/${id}`, { headers: authHeader() });
    }
}

export default new UserService();
