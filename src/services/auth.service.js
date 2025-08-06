// src/services/auth.service.js

import axios from 'axios'; // Importez axios directement pour la requête de connexion
import api from './http-common.js'; // Importez l'instance 'api' pour les requêtes post-connexion

// L'URL de base pour les endpoints d'authentification
// Ne pas inclure cette URL dans 'api' car 'api' a déjà une baseURL plus générique
const AUTH_API_URL = "http://localhost:8080/api/v1/auth/";

class AuthService {
    async login(username, password) {
        try {
            // Utilisez 'axios' directement pour la requête de connexion,
            // car elle ne nécessite pas encore de token d'authentification.
            // Construisez l'URL complète ici.
            const response = await axios
                .post(AUTH_API_URL + "signin", { // CORRECTION: Utilisation de AUTH_API_URL et "signin"
                    username,
                    password,
                });

            // Vérifiez la propriété 'token' (qui correspond au back-end)
            if (response.data.token) { // CORRECTION: Vérifier 'response.data.token' au lieu de 'jwt'
                // Enregistrement du token JWT et des informations de l'utilisateur dans le stockage local
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        } catch (error) {
            console.error("Erreur de connexion :", error.response ? error.response.data : error.message);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();