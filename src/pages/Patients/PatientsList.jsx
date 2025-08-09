import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PatientService from '../../services/patient.service';
import { toast } from 'react-toastify';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';

/**
 * @description Affiche la liste des patients avec pagination et recherche.
 * @component
 */
const PatientsList = () => {
    // Les états pour la pagination, la recherche et la suppression restent ici
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [patientToDeleteId, setPatientToDeleteId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fonction d'appel API à passer à ApiStateHandler
    const fetchPatients = async () => {
        const response = await PatientService.getPatients(page, size, searchTerm);
        // Gère les réponses paginées ou en tableau simple
        if (response.data.content) {
            setTotalPages(response.data.totalPages);
            return response.data.content;
        } else if (Array.isArray(response.data)) {
            setTotalPages(1);
            return response.data;
        } else {
            throw new Error("La structure de la réponse de l'API est inattendue.");
        }
    };

    /**
     * @description Ouvre la modale de confirmation pour la suppression d'un patient.
     * @param {string} id L'ID du patient à supprimer.
     */
    const openDeleteModal = (id) => {
        setPatientToDeleteId(id);
        setShowDeleteModal(true);
    };

    /**
     * @description Gère l'action de suppression du patient sélectionné.
     */
    const handleDelete = async () => {
        if (!patientToDeleteId) return;

        try {
            await PatientService.deletePatient(patientToDeleteId);
            toast.success('Patient supprimé avec succès !');
            // Force le rafraîchissement des données via ApiStateHandler
            setRefreshKey(prevKey => prevKey + 1);
        } catch (err) {
            console.error('Erreur lors de la suppression du patient:', err);
            const errorMessage = err.response?.data?.message || 'Échec de la suppression du patient.';
            toast.error(errorMessage);
        } finally {
            setShowDeleteModal(false);
            setPatientToDeleteId(null);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        // Déclenche un rafraîchissement
        setRefreshKey(prevKey => prevKey + 1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        // Déclenche un rafraîchissement
        setRefreshKey(prevKey => prevKey + 1);
    };

    // Fonction de rendu du tableau de patients qui sera passée à ApiStateHandler
    const renderPatientsTable = (patients) => {
        return (
            <>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro de Dossier</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
                                    <Link to={`/patients/${patient.id}`}>{patient.lastName}</Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.firstName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.recordNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <Link to={`/patients/edit/${patient.id}`} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors">
                                        <FaEdit className="mr-1" /> Modifier
                                    </Link>
                                    <button onClick={() => openDeleteModal(patient.id)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                                        <FaTrashAlt className="mr-1" /> Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-6">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            &lt; Précédent
                        </button>
                        {[...Array(totalPages).keys()].map(number => (
                            <button
                                key={number}
                                onClick={() => handlePageChange(number)}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                                    number === page
                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {number + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages - 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant &gt;
                        </button>
                    </nav>
                </div>
            </>
        );
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg mx-auto max-w-7xl font-sans">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Liste des Patients</h2>
                <div className="flex space-x-4 items-center">
                    <form onSubmit={handleSearchSubmit} className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Rechercher par nom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors duration-200">
                            Rechercher
                        </button>
                    </form>
                    <Link to="/patients/new" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200">
                        Ajouter un Patient
                    </Link>
                </div>
            </div>

            <ApiStateHandler
                key={refreshKey}
                apiCall={fetchPatients}
                renderSuccess={renderPatientsTable}
                loadingMessage="Chargement de la liste des patients..."
            />

            {/* Modale de confirmation de suppression */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                        <h3 className="text-xl font-bold mb-4">Confirmation</h3>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer ce patient ?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Oui, Supprimer</button>
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientsList;
