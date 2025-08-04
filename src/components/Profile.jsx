
import React, { useEffect, useState } from 'react';
import AuthService from '../services/auth.service';

const Profile = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Récupère les informations de l'utilisateur connecté
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        } else {
            // Gérer le cas où l'utilisateur n'est pas connecté (redirection ou message)
            // Par exemple, rediriger vers la page de connexion
            // navigate('/login');
        }
    }, []);

    if (!currentUser) {
        return <div className="p-8 text-center">Veuillez vous connecter.</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Profil de l'utilisateur</h1>
            <p className="mb-2"><strong>Nom d'utilisateur:</strong> {currentUser.username}</p>
            <p className="mb-2"><strong>Email:</strong> {currentUser.email}</p>
            <p className="mb-2"><strong>Rôles:</strong> {currentUser.roles.join(', ')}</p>
            {/* Affiche le token pour le débogage, mais ne le faites pas en production */}
            <p className="break-all mt-4 text-sm text-gray-600"><strong>Token JWT (pour débogage):</strong> {currentUser.token.substring(0, 20)}...</p>
        </div>
    );
};

export default Profile;