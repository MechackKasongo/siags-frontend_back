// src/pages/Users/UsersList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import { Navigate } from 'react-router-dom';


const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser && currentUser.roles.includes('ROLE_ADMIN');

    const fetchUsers = async () => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }
        try {
            const response = await UserService.getUsers();
            setUsers(response.data);
        } catch (err) {
            console.error('Erreur lors de la récupération des utilisateurs:', err);
            setError('Accès refusé ou impossible de charger la liste des utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [isAdmin]);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await UserService.deleteUser(id);
                alert('Utilisateur supprimé avec succès !');
                fetchUsers(); // Recharger la liste
            } catch (err) {
                console.error('Erreur lors de la suppression de l\'utilisateur:', err);
                alert('Échec de la suppression de l\'utilisateur.');
            }
        }
    };

    if (!isAdmin) return <Navigate to="/" />;
    if (loading) return <div>Chargement de la liste des utilisateurs...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="users-container">
            <h2>Liste des Utilisateurs</h2>
            {users.length > 0 ? (
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom d'utilisateur</th>
                        <th>Email</th>
                        <th>Rôles</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.roles.map(role => role.name).join(', ')}</td>
                            <td>
                                <Link to={`/admin/users/edit/${user.id}`} className="action-button edit">Modifier</Link>
                                <button onClick={() => handleDelete(user.id)} className="action-button delete">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun utilisateur trouvé.</p>
            )}
        </div>
    );
};

export default UsersList;