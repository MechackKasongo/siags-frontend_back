import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserCreateForm = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        nomComplet: '',
        roles: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser && currentUser.roles.includes('ROLE_ADMIN');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleRoleChange = (e) => {
        const { options } = e.target;
        const selectedRoles = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedRoles.push(options[i].value);
            }
        }
        setUserData({ ...userData, roles: selectedRoles });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await UserService.createUser(userData);
            toast.success('Utilisateur créé avec succès !');
            setTimeout(() => navigate('/admin/users'), 2000);
        } catch (err) {
            console.error('Erreur lors de la création de l\'utilisateur:', err.response || err);
            toast.error('Échec de la création de l\'utilisateur.');
            setIsSubmitting(false);
        }
    };

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Créer un nouvel utilisateur</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur :</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="nomComplet" className="block text-sm font-medium text-gray-700">Nom Complet :</label>
                        <input
                            type="text"
                            id="nomComplet"
                            name="nomComplet"
                            value={userData.nomComplet}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email :</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="roles" className="block text-sm font-medium text-gray-700">Rôles :</label>
                        <select
                            id="roles"
                            name="roles"
                            multiple
                            value={userData.roles}
                            onChange={handleRoleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 h-24"
                        >
                            <option value="ROLE_ADMIN">ADMIN</option>
                            <option value="ROLE_INFIRMIER">INFIRMIER</option>
                            <option value="ROLE_MEDECIN">MEDECIN</option>
                            <option value="ROLE_PERSONNEL_ADMIN_SORTIE">PERSONNEL ADMIN SORTIE</option>
                            <option value="ROLE_RECEPTIONNISTE">RECEPTIONNISTE</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        {isSubmitting ? 'Création en cours...' : 'Créer l\'utilisateur'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserCreateForm;
