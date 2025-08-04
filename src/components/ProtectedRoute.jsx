// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Importe ton hook d'authentification

const ProtectedRoute = ({ allowedRoles, allowedPermissions }) => {
    const { currentUser, hasRole, hasPermission } = useAuth(); // Récupère l'utilisateur et les fonctions de vérification

    if (!currentUser) {
        // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
        console.log("Accès refusé: Utilisateur non connecté. Redirection vers /login");
        return <Navigate to="/login" replace />;
    }

    // Vérification des rôles
    if (allowedRoles && allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.some(role => hasRole(role));
        if (!hasRequiredRole) {
            // Si l'utilisateur n'a pas les rôles requis, redirige vers une page d'accès refusé ou la page d'accueil
            console.log("Accès refusé: Rôle non suffisant. Redirection vers /");
            return <Navigate to="/" replace />; // Tu peux créer une page /unauthorized si tu veux
        }
    }

    // Vérification des permissions
    // Cette partie n'est pertinente que si ton `currentUser` du backend inclut explicitement les permissions
    // et que ta fonction `hasPermission` utilise bien cette liste.
    if (allowedPermissions && allowedPermissions.length > 0) {
        const hasRequiredPermission = allowedPermissions.some(permission => hasPermission(permission));
        if (!hasRequiredPermission) {
            console.log("Accès refusé: Permission non suffisante. Redirection vers /");
            return <Navigate to="/" replace />;
        }
    }

    // Si l'utilisateur est connecté et a les rôles/permissions requis,
    // rend les composants enfants de la route
    return <Outlet />;
};

export default ProtectedRoute;