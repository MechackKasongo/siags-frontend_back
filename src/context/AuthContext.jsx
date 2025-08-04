// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth.service';

// Crée le Contexte d'Authentification
export const AuthContext = createContext(null);

// Fournisseur du Contexte d'Authentification
export const AuthProvider = ({ children }) => {
    // État pour stocker l'utilisateur courant, initialisé à partir du localStorage
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

    // Fonction de connexion
    const login = async (username, password) => {
        try {
            const user = await AuthService.login(username, password);
            setCurrentUser(user); // Met à jour l'état de l'utilisateur courant
            return user;
        } catch (error) {
            setCurrentUser(null); // En cas d'échec, assure-toi que l'utilisateur n'est pas défini
            throw error;
        }
    };

    // Fonction de déconnexion
    const logout = () => {
        AuthService.logout(); // Appelle la déconnexion du service
        setCurrentUser(null); // Réinitialise l'état de l'utilisateur
    };

    // Fonction utilitaire pour vérifier si l'utilisateur a un rôle spécifique
    const hasRole = (roleName) => {
        if (!currentUser || !currentUser.roles) {
            return false;
        }
        return currentUser.roles.includes(roleName);
    };

    // Fonction utilitaire pour vérifier si l'utilisateur a une permission spécifique
    // Cette fonction sera plus précise si ton backend renvoie explicitement les permissions.
    const hasPermission = (permissionName) => {
        if (!currentUser) {
            return false;
        }

        // Première approche: Si ton backend envoie une liste de "permissions" explicites.
        // C'est la méthode la plus propre et la plus sûre à long terme.
        if (currentUser.permissions && Array.isArray(currentUser.permissions)) {
            return currentUser.permissions.includes(permissionName);
        }

        // Deuxième approche (Fallback): Si le backend n'envoie que les rôles,
        // et que tes noms de rôles dans Spring Boot sont directement tes permissions
        // (ex: ROLE_ADMIN, USER_READ, PATIENT_WRITE). C'est ce que nous avons vu jusqu'à présent.
        if (currentUser.roles && Array.isArray(currentUser.roles)) {
            return currentUser.roles.includes(permissionName);
        }

        return false;
    };


    // Le "value" du contexte contiendra l'utilisateur courant, et les fonctions login/logout
    const authContextValue = {
        currentUser,
        login,
        logout,
        hasRole,
        hasPermission
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour faciliter l'utilisation du contexte
export const useAuth = () => {
    return useContext(AuthContext);
};