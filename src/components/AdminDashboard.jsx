import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import UserService from '../services/user.service.js';
import AuthService from '../services/auth.service.js';
import PatientService from '../services/patient.service.js'; // Importez le service Patient
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importez ToastContainer et toast
import 'react-toastify/dist/ReactToastify.css'; // Styles de Toastify

// Importez les nouveaux composants
import PatientList from './PatientList.jsx';
import PatientForm from './PatientForm.jsx';

const AdminDashboard = () => {
    const { currentUser, hasRole } = useAuth();
    const navigate = useNavigate();

    // États pour le chargement et les messages généraux du dashboard
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // État pour la navigation entre les sections (Users, Patients)
    const [currentView, setCurrentView] = useState('users'); // 'users' ou 'patients'

    // --- États pour la gestion des utilisateurs ---
    const [users, setUsers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRoles, setNewRoles] = useState([]);
    const [creationMessage, setCreationMessage] = useState('');
    const [creationLoading, setCreationLoading] = useState(false);

    const [editingUser, setEditingUser] = useState(null);
    const [editId, setEditId] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editNomComplet, setEditNomComplet] = useState('');
    const [editPassword, setEditPassword] = useState(''); // FIX: Correction ici
    const [editRoles, setEditRoles] = useState([]);
    const [editMessage, setEditMessage] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    // --- NOUVEAUX États pour la gestion des patients ---
    const [editingPatient, setEditingPatient] = useState(null); // Patient sélectionné pour édition
    const [isAddingPatient, setIsAddingPatient] = useState(false); // Mode ajout patient

    useEffect(() => {
        if (!currentUser || !hasRole("ROLE_ADMIN")) {
            setMessage("Accès refusé. Vous devez être connecté en tant qu'administrateur.");
            setLoading(false);
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        const fetchData = async () => {
            try {
                // Récupération des utilisateurs
                const usersResponse = await UserService.getAllUsers();
                setUsers(usersResponse.data);

                // Récupération des rôles disponibles
                const rolesResponse = await AuthService.getAvailableRoles();
                setAvailableRoles(rolesResponse.data.map(role => typeof role === 'object' && role !== null && role.name ? role.name : role));

                setMessage('');
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error.response || error);
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        (error.response.data.message || error.response.data.error)) || // Ajoutez error.response.data.error
                    error.message ||
                    error.toString();
                setMessage("Erreur lors du chargement des données: " + resMessage);
                toast.error("Erreur lors du chargement initial des données."); // Notification d'erreur
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser, hasRole, navigate]);

    // --- Fonctions de gestion des utilisateurs (inchangées, sauf suppression 'response' inutile) ---

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreationMessage('');
        setCreationLoading(true);

        try {
            const userData = {
                username: newUsername,
                email: newEmail,
                password: newPassword,
                roles: newRoles
            };

            await AuthService.register(userData); // Supprimé 'const response ='
            setCreationMessage('Utilisateur créé avec succès !');
            toast.success("Utilisateur créé avec succès !"); // Notification de succès

            setNewUsername('');
            setNewEmail('');
            setNewPassword('');
            setNewRoles([]);

            const updatedUsersResponse = await UserService.getAllUsers();
            setUsers(updatedUsersResponse.data);

        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error.response || error);
            const resMessage =
                (error.response &&
                    error.response.data &&
                    (error.response.data.message || error.response.data.error)) ||
                error.message ||
                error.toString();
            setCreationMessage("Erreur: " + resMessage);
            toast.error("Échec de la création de l'utilisateur: " + resMessage); // Notification d'erreur
        } finally {
            setCreationLoading(false);
        }
    };

    const handleNewRoleChange = (roleName) => {
        setNewRoles(prevRoles =>
            prevRoles.includes(roleName)
                ? prevRoles.filter(role => role !== roleName)
                : [...prevRoles, roleName]
        );
    };

    const startEditing = async (user) => {
        setEditingUser(user);
        setEditId(user.id);
        setEditEmail(user.email || '');
        setEditNomComplet(user.nomComplet || '');
        setEditPassword(''); // Doit être vide pour ne pas envoyer l'ancien hash
        setEditRoles(user.roles || []);
        setEditMessage('');
    };

    const cancelEditing = () => {
        setEditingUser(null);
        setEditId('');
        setEditEmail('');
        setEditNomComplet('');
        setEditPassword('');
        setEditRoles([]);
        setEditMessage('');
    };

    const handleEditRoleChange = (roleName) => {
        setEditRoles(prevRoles =>
            prevRoles.includes(roleName)
                ? prevRoles.filter(role => role !== roleName)
                : [...prevRoles, roleName]
        );
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setEditMessage('');
        setEditLoading(true);

        try {
            const updateData = {
                email: editEmail,
                nomComplet: editNomComplet,
                // Inclure le mot de passe seulement s'il est non vide
                password: editPassword || undefined,
                roles: editRoles
            };

            await UserService.updateUser(editId, updateData); // Supprimé 'const response ='
            setEditMessage('Utilisateur mis à jour avec succès !');
            toast.success("Utilisateur mis à jour avec succès !"); // Notification de succès

            const updatedUsersResponse = await UserService.getAllUsers();
            setUsers(updatedUsersResponse.data);

            cancelEditing();

        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error.response || error);
            const resMessage =
                (error.response &&
                    error.response.data &&
                    (error.response.data.message || error.response.data.error)) ||
                error.message ||
                error.toString();
            setEditMessage("Erreur: " + resMessage);
            toast.error("Échec de la mise à jour de l'utilisateur: " + resMessage); // Notification d'erreur
        } finally {
            setEditLoading(false);
        }
    };

    // --- NOUVELLES Fonctions de gestion des patients ---

    const handlePatientSaveSuccess = () => {
        setEditingPatient(null); // Quitter le mode édition
        setIsAddingPatient(false); // Quitter le mode ajout
        // PatientList gère déjà son propre rechargement, mais on peut le déclencher depuis ici si nécessaire
        // Pour s'assurer que PatientList recharge bien, on peut passer une prop 'refreshKey' ou utiliser un callback
        // Pour l'instant, on suppose que PatientList le fait via son `useEffect` de montage.
        // Si vous avez un problème de rafraîchissement de la liste après une édition/ajout,
        // il faudra affiner la logique de rafraîchissement.
    };

    const handleCancelPatientForm = () => {
        setEditingPatient(null);
        setIsAddingPatient(false);
    };

    const handleEditPatient = (patient) => {
        setEditingPatient(patient);
        setIsAddingPatient(false); // Assurez-vous de ne pas être en mode ajout
    };

    const handleAddPatientClick = () => {
        setIsAddingPatient(true);
        setEditingPatient(null); // Assurez-vous de ne pas être en mode édition
    };

    if (loading) {
        return <div className="p-8 text-center">Chargement du tableau de bord admin...</div>;
    }

    if (message) {
        return <div className="p-8 text-center text-red-500">{message}</div>;
    }

    return (
        <div className="p-8">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <h1 className="text-3xl font-bold mb-6 text-center">Tableau de Bord Administrateur</h1>

            {/* Barre de navigation / Onglets pour basculer entre les sections */}
            <div className="mb-8 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setCurrentView('users')}
                        className={`
                            ${currentView === 'users'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200
                        `}
                    >
                        Gestion des Utilisateurs
                    </button>
                    <button
                        onClick={() => setCurrentView('patients')}
                        className={`
                            ${currentView === 'patients'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200
                        `}
                    >
                        Gestion des Patients
                    </button>
                </nav>
            </div>

            {/* Contenu conditionnel basé sur `currentView` */}
            {currentView === 'users' && (
                <>
                    {/* Section de gestion des utilisateurs existants */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Utilisateurs Existants</h2>
                        {users.length > 0 ? (
                            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom d'utilisateur</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Complet</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôles</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-100">
                                            <td className="py-4 px-4 whitespace-nowrap">{user.id}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">{user.username}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">{user.email}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">{user.nomComplet || 'N/A'}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">{user.roles ? user.roles.map(role => role.name).join(', ') : 'Aucun'}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => startEditing(user)}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                                >
                                                    Éditer
                                                </button>
                                                {/* <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Supprimer</button> */}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">Aucun utilisateur trouvé ou accès refusé.</p>
                        )}
                    </div>

                    {/* Section de création de nouvel utilisateur */}
                    {!editingUser && (
                        <div className="mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-100">
                            <h2 className="text-xl font-medium mb-6 text-gray-800 border-b pb-4">Créer un Nouvel Utilisateur</h2>
                            <form onSubmit={handleCreateUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                                    <div>
                                        <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                                        <input
                                            type="text"
                                            id="newUsername"
                                            name="newUsername" // Ajoutez le nom pour une meilleure gestion
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="newEmail"
                                            name="newEmail" // Ajoutez le nom
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword" // Ajoutez le nom
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rôles:</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {availableRoles.map((role) => (
                                            <div key={role} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`new-role-${role}`}
                                                    value={role}
                                                    checked={newRoles.includes(role)}
                                                    onChange={() => handleNewRoleChange(role)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`new-role-${role}`} className="ml-2 text-sm text-gray-900">{role}</label>
                                            </div>
                                        ))}
                                    </div>
                                    {availableRoles.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-2">Aucun rôle disponible. Assurez-vous que l'endpoint `/api/v1/auth/roles` est configuré dans le backend et renvoie les noms de rôles corrects (ex: ROLE_ADMIN, ROLE_RECEPTIONNISTE).</p>
                                    )}
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={creationLoading}
                                    >
                                        {creationLoading ? 'Création en cours...' : 'Créer l\'utilisateur'}
                                    </button>
                                </div>

                                {creationMessage && (
                                    <p className={`mt-4 text-center ${creationMessage.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
                                        {creationMessage}
                                    </p>
                                )}
                            </form>
                        </div>
                    )}


                    {/* Formulaire d'édition d'utilisateur */}
                    {editingUser && (
                        <div className="mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-100">
                            <h2 className="text-xl font-medium mb-6 text-gray-800 border-b pb-4">Éditer l'Utilisateur: {editingUser.username}</h2>
                            <form onSubmit={handleUpdateUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                                    <div>
                                        <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="editEmail"
                                            name="editEmail" // Ajoutez le nom
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="editNomComplet" className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                                        <input
                                            type="text"
                                            id="editNomComplet"
                                            name="editNomComplet" // Ajoutez le nom
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={editNomComplet}
                                            onChange={(e) => setEditNomComplet(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="editPassword" className="block text-sm font-medium text-gray-700 mb-1">Nouveau Mot de passe (laisser vide pour ne pas changer)</label>
                                    <input
                                        type="password"
                                        id="editPassword"
                                        name="editPassword" // Ajoutez le nom
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={editPassword}
                                        onChange={(e) => setEditPassword(e.target.value)}
                                        placeholder="Laisser vide pour ne pas changer"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rôles:</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {availableRoles.map((role) => (
                                            <div key={role} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`edit-role-${role}`}
                                                    value={role}
                                                    checked={editRoles.includes(role)}
                                                    onChange={() => handleEditRoleChange(role)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`edit-role-${role}`} className="ml-2 text-sm text-gray-900">{role}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        className="inline-flex items-center px-6 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={editLoading}
                                    >
                                        {editLoading ? 'Mise à jour en cours...' : 'Mettre à jour l\'utilisateur'}
                                    </button>
                                </div>

                                {editMessage && (
                                    <p className={`mt-4 text-center ${editMessage.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
                                        {editMessage}
                                    </p>
                                )}
                            </form>
                        </div>
                    )}
                </>
            )}

            {currentView === 'patients' && (
                <>
                    {/* Contenu de la gestion des patients */}
                    {isAddingPatient || editingPatient ? (
                        <PatientForm
                            patientToEdit={editingPatient}
                            onSaveSuccess={handlePatientSaveSuccess}
                            onCancel={handleCancelPatientForm}
                        />
                    ) : (
                        <PatientList
                            onEditPatient={handleEditPatient}
                            onAddPatient={handleAddPatientClick}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;