// src/services/api.service.js
import axios from 'axios';
import AuthService from './auth.service'; // Importe ton AuthService pour obtenir le token

// URL de base de ton API (tu peux ajuster si nécessaire)
const API_BASE_URL = 'http://localhost:8080/api/v1/';

// Crée une instance Axios personnalisée
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur de requêtes :
// Avant chaque requête, cet intercepteur va vérifier si un utilisateur est connecté
// et ajouter le token JWT dans l'en-tête 'Authorization' si un token est disponible.
api.interceptors.request.use(
    (config) => {
        const user = AuthService.getCurrentUser(); // Récupère l'utilisateur depuis le localStorage

        if (user && user.token) {
            // Ajoute le token JWT au format "Bearer Token"
            config.headers.Authorization = 'Bearer ' + user.token;
        }
        return config;
    },
    (error) => {
        // Gérer les erreurs de requête (ex: problème de réseau)
        return Promise.reject(error);
    }
);

// Intercepteur de réponses (optionnel mais utile pour la gestion des erreurs) :
// Tu peux ajouter un intercepteur ici pour gérer globalement les erreurs 401 (non autorisé)
// par exemple en redirigeant l'utilisateur vers la page de connexion.
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Vérifie si error.response existe avant d'y accéder
        if (error.response) {
            const originalRequest = error.config;

            // Si l'erreur est 401 (Unauthorized) et que ce n'est pas une tentative de rafraîchissement
            // et que le chemin n'est pas le login (pour éviter une boucle)
            if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== 'auth/signin') {
                originalRequest._retry = true;
                console.log("401 Unauthorized, déconnexion de l'utilisateur.");
                AuthService.logout();
                window.location.href = '/login'; // Utilise window.location.href pour une redirection dure
                return Promise.reject(error);
            }
        } else {
            // Cas où error.response est undefined (ex: erreur réseau, CORS bloquée très tôt)
            console.error("Erreur de requête sans réponse du serveur (ex: réseau, CORS):", error);
            // Tu peux choisir de déconnecter ici aussi ou d'afficher un message générique.
            // AuthService.logout();
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;