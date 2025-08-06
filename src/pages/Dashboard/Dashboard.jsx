// src/pages/Dashboard/Dashboard.jsx
import React from 'react';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Tableau de Bord</h2>
            {user && user.username ? (
                <h3 className="text-xl text-gray-700">Bienvenue, {user.username} !</h3>
            ) : (
                <h3 className="text-xl text-gray-700">Bienvenue sur votre tableau de bord.</h3>
            )}
            <p className="mt-4 text-gray-600">
                Ceci est une page protégée, accessible uniquement après une connexion réussie.
            </p>

            {/* Vous pouvez ajouter d'autres éléments ici, comme : */}
            {/* <ul>
                <li><a href="/patients">Voir la liste des patients</a></li>
                <li><a href="/admissions">Gérer les admissions</a></li>
            </ul> */}
        </div>
    );
};

export default Dashboard;