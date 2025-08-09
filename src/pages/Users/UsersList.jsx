import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';

const UsersList = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser && currentUser.roles.includes('ROLE_ADMIN');

    /**
     * @description Fetches the list of all users from the API.
     * @returns {Promise<Array<object>>} A promise that resolves to an array of user objects.
     */
    const fetchUsers = async () => {
        if (!isAdmin) {
            throw new Error('Unauthorized access');
        }
        const response = await UserService.getUsers();
        return response.data;
    };

    /**
     * @description Handles the click event for the delete button.
     * @param {object} user The user object to be deleted.
     */
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowModal(true);
    };

    /**
     * @description Performs the user deletion after confirmation.
     */
    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await UserService.deleteUser(userToDelete.id);
            toast.success('Utilisateur supprimé avec succès !');
            setRefreshTrigger(prev => prev + 1); // Trigger a re-fetch of the user list
            setShowModal(false);
        } catch (err) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', err);
            toast.error('Échec de la suppression de l\'utilisateur.');
        } finally {
            setIsDeleting(false);
        }
    };

    /**
     * @description Renders the user list table once the data is successfully loaded.
     * @param {Array<object>} users The array of user objects.
     * @returns {JSX.Element} The JSX for the user list table.
     */
    const renderUsersList = (users) => {
        return (
            <div className="p-8 bg-gray-50 min-h-screen font-sans">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-800 text-center">Liste des Utilisateurs</h2>
                        <Link to="/admin/users/new" className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                            Créer un utilisateur
                        </Link>
                    </div>
                    {users.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom d'utilisateur</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôles</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.roles.join(', ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link to={`/admin/users/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-900">Modifier</Link>
                                            <button onClick={() => handleDeleteClick(user)} className="text-red-600 hover:text-red-900">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-8">Aucun utilisateur trouvé.</p>
                    )}
                </div>

                <ConfirmationModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Confirmation de suppression"
                    message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete?.username}" ?`}
                    confirmButtonText={isDeleting ? 'Suppression...' : 'Supprimer'}
                    isConfirming={isDeleting}
                />
            </div>
        );
    };

    if (!isAdmin) return <Navigate to="/" />;

    return (
        <ApiStateHandler
            apiCall={fetchUsers}
            renderSuccess={renderUsersList}
            loadingMessage="Chargement de la liste des utilisateurs..."
            errorMessage="Accès refusé ou impossible de charger la liste des utilisateurs."
            refreshTrigger={refreshTrigger}
        />
    );
};

export default UsersList;
