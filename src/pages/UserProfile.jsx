import React from 'react';
import AuthService from '../services/auth.service';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center font-sans">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <p className="text-lg text-gray-600 mb-4">Veuillez vous connecter pour voir votre profil.</p>
                    <Link to="/login" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                        Se connecter
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Profil de l'Utilisateur</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                        <strong className="text-gray-700">Nom d'utilisateur :</strong>
                        <span className="text-indigo-600 font-semibold">{currentUser.username}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                        <strong className="text-gray-700">Email :</strong>
                        <span className="text-indigo-600 font-semibold">{currentUser.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                        <strong className="text-gray-700">Rôles :</strong>
                        <span className="text-indigo-600 font-semibold">{currentUser.roles.join(', ')}</span>
                    </div>
                </div>
                <p className="profile-info text-center text-gray-500 mt-6 text-sm">
                    Pour modifier vos informations, veuillez contacter un administrateur.
                </p>
            </div>
        </div>
    );
};

export default UserProfile;
