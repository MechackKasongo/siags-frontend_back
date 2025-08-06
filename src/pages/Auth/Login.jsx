import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Le composant Login accepte maintenant une prop 'onLoginSuccess'
const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await AuthService.login(username, password);

            if (response.token) {
                toast.success("Connexion réussie !");
                // Appelle la fonction de rappel pour mettre à jour l'état dans App.jsx
                if (onLoginSuccess) {
                    onLoginSuccess(response); // <-- CORRECTION ICI
                    //onLoginSuccess(AuthService.getCurrentUser()); // Passe l'objet utilisateur complet
                }

                console.log("Redirection vers le tableau de bord...");
                navigate('/dashboard'); // Redirige l'utilisateur
            } else {
                toast.error("Échec de la connexion. Token manquant.");
            }
        } catch (error) {
            console.error("Erreur de connexion :", error.response);
            toast.error("Erreur de connexion. Veuillez vérifier votre nom d'utilisateur et votre mot de passe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Connexion</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button>
            </form>
        </div>
    );
};

export default Login;