import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DepartmentService from '../../services/department.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx'; // Assurez-vous que le chemin est correct

const DepartmentsList = () => {
    // État pour forcer le rafraîchissement des données après une suppression
    const [refreshKey, setRefreshKey] = useState(0);
    // État pour afficher un message après une action de l'utilisateur
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    // La fonction qui sera passée à ApiStateHandler pour récupérer les données
    const fetchDepartments = async () => {
        const response = await DepartmentService.getDepartments();
        // Dans ce cas, la fonction retourne directement les données pour ApiStateHandler
        return response.data;
    };

    const handleDelete = async (id) => {
        // Remplacer window.confirm par une logique de confirmation personnalisée
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
            try {
                await DepartmentService.deleteDepartment(id);
                setStatusMessage({ type: 'success', message: 'Département supprimé avec succès !' });
                // Incrémenter refreshKey pour déclencher un rechargement de ApiStateHandler
                setRefreshKey(prevKey => prevKey + 1);
            } catch (err) {
                console.error('Erreur lors de la suppression du département:', err);
                setStatusMessage({ type: 'error', message: 'Échec de la suppression du département.' });
            }
        }
    };

    // La fonction qui rend la liste des départements en cas de succès
    const renderDepartments = (departments) => {
        return (
            <>
                {statusMessage.message && (
                    <div className={`p-4 mb-4 rounded-lg text-white ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {statusMessage.message}
                    </div>
                )}
                <div className="departments-header flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Liste des Départements</h2>
                    <Link to="/departments/new" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Ajouter un département
                    </Link>
                </div>
                {departments.length > 0 ? (
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Nom du Département</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                        {departments.map((department) => (
                            <tr key={department.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{department.id}</td>
                                <td className="py-3 px-6 text-left">{department.name}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        <Link to={`/departments/edit/${department.id}`} className="w-4 mr-2 transform hover:text-indigo-500 hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Link>
                                        <button onClick={() => handleDelete(department.id)} className="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center text-lg mt-8">Aucun département trouvé.</p>
                )}
            </>
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="container mx-auto">
                <ApiStateHandler
                    key={refreshKey} // La clé est essentielle pour forcer le rechargement
                    apiCall={fetchDepartments}
                    renderSuccess={renderDepartments}
                    loadingMessage="Chargement des départements..."
                />
            </div>
        </div>
    );
};

export default DepartmentsList;
