import React from 'react';
import AuthService from '../services/auth.service';

const UserProfile = () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
        return <p>Veuillez vous connecter pour voir votre profil.</p>;
    }

    return (
        <div className="user-profile-container">
            <h2>Profil de l'Utilisateur</h2>
            <div className="user-details">
                <p><strong>Nom d'utilisateur :</strong> {currentUser.username}</p>
                <p><strong>Email :</strong> {currentUser.email}</p>
                <p><strong>Rôles :</strong> {currentUser.roles.join(', ')}</p>
                {/* Vous pouvez ajouter d'autres informations du profil ici si votre token ou votre service les contient */}
            </div>
            <p className="profile-info">
                Pour modifier vos informations, veuillez contacter un administrateur.
                {/* Un lien de modification pourrait être ajouté ici s'il existe une telle fonctionnalité */}
            </p>
        </div>
    );
};

export default UserProfile;