// src/components/Login.jsx
import React, { useState } from 'react';
// import AuthService from '../services/auth.service'; // Plus besoin d'importer AuthService directement ici
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Importe le hook useAuth

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // Utilise la fonction login du contexte

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const user = await login(username, password); // Appelle la fonction login du contexte
            setMessage('Connexion réussie ! Redirection...');
            // Retire ou commente la ligne suivante:
            // window.location.reload();
            navigate('/profile'); // Redirection vers le profil
        } catch (error) {
            // ...
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-sendwe-gray-light"> {/* Utilisation d'un gris très clair pour le fond */}
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-bold text-center mb-6 text-sendwe-blue">Connexion</h2> {/* Titre en sendwe-blue */}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sendwe-blue focus:border-sendwe-blue" // Accent avec sendwe-blue
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sendwe-blue focus:border-sendwe-blue"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-sendwe-green text-white py-2 px-4 rounded-md hover:bg-sendwe-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sendwe-green" // Bouton en sendwe-green
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                    {message && (
                        <p className={`mt-4 text-center ${message.includes('réussie') ? 'text-sendwe-green' : 'text-sendwe-red'}`}> {/* Messages en vert ou rouge */}
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;