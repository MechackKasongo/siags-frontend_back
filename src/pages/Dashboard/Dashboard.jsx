import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    // Récupère les informations de l'utilisateur depuis le localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
                <h2 className="text-4xl font-bold mb-4 text-gray-800">Tableau de Bord</h2>
                {/* Affiche un message de bienvenue personnalisé si l'utilisateur est connecté */}
                {user && user.username ? (
                    <h3 className="text-xl text-gray-700 mb-6">Bienvenue, <span className="text-indigo-600 font-semibold">{user.username}</span> !</h3>
                ) : (
                    <h3 className="text-xl text-gray-700 mb-6">Bienvenue sur votre tableau de bord.</h3>
                )}
                <p className="mt-4 text-gray-600">
                    Ceci est une page protégée, accessible uniquement après une connexion réussie.
                </p>

                <div className="mt-8 space-y-4 md:space-y-0 md:flex md:justify-center md:space-x-4">
                    <Link
                        to="/patients"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Gérer les Patients
                    </Link>
                    <Link
                        to="/admissions"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Gérer les Admissions
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
