import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const UserEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        roles: [],
        enabled: true,
    });
    const [loading, setLoading] = useState(true);

    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser && currentUser.roles.includes('ROLE_ADMIN');

    useEffect(() => {
        if (!isAdmin) return;
        const fetchUser = async () => {
            try {
                const response = await UserService.getUserById(id);
                const user = response.data;

                setUserData({
                    username: user.username,
                    email: user.email,
                    roles: user.roles, // Les rôles sont déjà un tableau de chaînes
                    enabled: user.enabled,
                });
            } catch (err) {
                console.error('Erreur lors du chargement de l\'utilisateur:', err);
                toast.error('Impossible de charger les données de l\'utilisateur.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, isAdmin]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            [name]: type === 'checkbox' ? checked : value,
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
        setLoading(true);
        try {
            await UserService.updateUser(id, userData);
            toast.success('Utilisateur mis à jour avec succès !');
            setTimeout(() => navigate('/admin/users'), 2000);
        } catch (err) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', err.response || err);
            toast.error('Échec de la mise à jour de l\'utilisateur.');
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    if (loading) return <div>Chargement du formulaire de modification...</div>;

    return (
        <div className="user-form-container">
            <h2>Modifier l'utilisateur : {userData.username}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Nom d'utilisateur :</label>
                    <input type="text" id="username" name="username" value={userData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email :</label>
                    <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="roles">Rôles :</label>
                    <select id="roles" name="roles" multiple value={userData.roles} onChange={handleRoleChange}>
                        <option value="ROLE_USER">USER</option>
                        <option value="ROLE_ADMIN">ADMIN</option>
                        {/* Ajoutez d'autres rôles comme MEDECIN, RECEPTIONNISTE si nécessaire */}
                    </select>
                </div>
                <div>
                    <label htmlFor="enabled">Activé :</label>
                    <input type="checkbox" id="enabled" name="enabled" checked={userData.enabled} onChange={handleChange} />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Mise à jour en cours...' : 'Mettre à jour l\'utilisateur'}
                </button>
            </form>
        </div>
    );
};

export default UserEditForm;