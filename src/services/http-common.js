// src/services/http-common.js

import axios from "axios";
import AuthService from "./auth.service";

// Crée une instance d'Axios avec une URL de base
// Cette URL de base sera préfixée à toutes les requêtes faites avec cette instance 'instance'
const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1/", // CORRECTION: Assurez-vous que c'est l'URL de base de TOUTES vos APIs (ex: /api/v1/patients, /api/v1/admissions)
    headers: {
        "Content-Type": "application/json",
    },
});

// Configure un intercepteur pour les requêtes
// Cet intercepteur est exécuté avant chaque requête HTTP
instance.interceptors.request.use(
    (config) => {
        // Récupère l'utilisateur et le token depuis le stockage local
        const user = AuthService.getCurrentUser();

        // Si un utilisateur est connecté et a un token
        // Note: 'user.token' est maintenant correct car 'AuthService.login' stocke 'response.data.token'
        if (user && user.token) { // CORRECTION: Vérifier 'user.token'
            // Ajoute le token à l'en-tête 'Authorization'
            // Le format standard est "Bearer [token]"
            config.headers["Authorization"] = 'Bearer ' + user.token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;