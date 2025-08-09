// src/services/auth.service.js

import axios from 'axios';
import api from './http-common.js'; // Utilise l'instance 'api' pour les requêtes authentifiées

// L'URL de base pour l'API d'authentification.
const AUTH_API_URL = "http://localhost:8080/api/v1/auth/";

class AuthService {
    /**
     * @description Envoie une requête de connexion à l'API. Utilise axios directement car le token n'est pas encore disponible.
     * @param {string} username Le nom d'utilisateur.
     * @param {string} password Le mot de passe.
     * @returns {Promise<object>} Les données de l'utilisateur et le token en cas de succès.
     * @throws {Error} Une erreur si la connexion échoue (mauvais identifiants, erreur réseau, etc.).
     */
    async login(username, password) {
        try {
            // Requête POST vers l'endpoint de connexion.
            const response = await axios
                .post(AUTH_API_URL + "signin", {
                    username,
                    password,
                });

            // Vérifie la présence du token dans la réponse. C'est un point de défaillance courant.
            if (response.data.token) {
                // Stocke l'objet utilisateur complet (y compris le token) dans le localStorage.
                // Cela est essentiel pour les requêtes futures.
                localStorage.setItem("user", JSON.stringify(response.data));
            } else {
                // Si la requête réussit mais qu'il n'y a pas de token, lance une erreur.
                throw new Error("Login successful, but token is missing from the response.");
            }

            return response.data;
        } catch (error) {
            // Améliore la gestion des erreurs pour fournir plus de détails.
            // On peut attraper les erreurs d'Axios pour des messages plus précis.
            if (error.response) {
                // Erreur de réponse du serveur (ex: 400, 401, 500).
                console.error("Erreur du serveur lors de la connexion:", error.response.data);
                throw new Error(error.response.data.message || "Erreur de connexion.");
            } else if (error.request) {
                // La requête a été faite, mais aucune réponse n'a été reçue (ex: problème réseau).
                console.error("Aucune réponse du serveur:", error.request);
                throw new Error("Problème de connexion. Le serveur est peut-être indisponible.");
            } else {
                // Autres types d'erreurs (problème de code, etc.).
                console.error("Erreur de configuration de la requête:", error.message);
                throw new Error("Erreur de connexion inattendue.");
            }
        }
    }

    /**
     * @description Supprime le token de l'utilisateur du localStorage pour la déconnexion.
     */
    logout() {
        localStorage.removeItem("user");
    }

    /**
     * @description Récupère l'objet utilisateur actuellement connecté depuis le localStorage.
     * @returns {object | null} L'objet utilisateur si présent, sinon null.
     */
    getCurrentUser() {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            return user;
        } catch (e) {
            console.error("Erreur lors de la lecture du localStorage:", e);
            return null;
        }
    }
}

export default new AuthService();



// // src/services/auth.service.js
//
// import axios from 'axios'; // Use axios directly for the login request
// import api from './http-common.js'; // Use the 'api' instance for all other authenticated requests
//
// // The base URL for authentication endpoints
// const AUTH_API_URL = "http://localhost:8080/api/v1/auth/";
//
// class AuthService {
//     async login(username, password) {
//         try {
//             // The login request uses axios directly because it doesn't have an authentication token yet.
//             const response = await axios
//                 .post(AUTH_API_URL + "signin", {
//                     username,
//                     password,
//                 });
//
//             // CRITICAL FIX: Check for the 'token' property, which matches your back-end DTO.
//             if (response.data.token) {
//                 // Store the entire user object, including the token, in local storage.
//                 localStorage.setItem("user", JSON.stringify(response.data));
//             }
//
//             return response.data;
//         } catch (error) {
//             console.error("Erreur de connexion :", error.response ? error.response.data : error.message);
//             throw error;
//         }
//     }
//
//     logout() {
//         localStorage.removeItem("user");
//     }
//
//     getCurrentUser() {
//         return JSON.parse(localStorage.getItem("user"));
//     }
// }
//
// export default new AuthService();