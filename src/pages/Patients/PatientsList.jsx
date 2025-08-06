import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PatientService from '../../services/patient.service';
import { toast } from 'react-toastify';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const PatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await PatientService.getPatients(page, size, searchTerm);
            setPatients(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Erreur lors de la récupération des patients:', err);
            setError('Impossible de charger la liste des patients. Veuillez réessayer.');
            toast.error('Erreur lors du chargement des patients.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [page, size, searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
            try {
                await PatientService.deletePatient(id);
                toast.success('Patient supprimé avec succès !');
                // Mise à jour optimiste de la liste
                setPatients(patients.filter(p => p.id !== id));
            } catch (err) {
                console.error('Erreur lors de la suppression du patient:', err);
                toast.error('Échec de la suppression du patient.');
            }
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Liste des Patients</h2>
                <div className="flex space-x-4">
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

            {loading ? (
                <div className="text-center py-8 text-gray-500 text-lg">Chargement des patients...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-600 text-lg">{error}</div>
            ) : patients.length > 0 ? (
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
                                        <Link to={`/patients/${patient.id}`}>{patient.nom}</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.prenom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.numeroDossier}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Link to={`/patients/edit/${patient.id}`} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors">
                                            <FaEdit className="mr-1" /> Modifier
                                        </Link>
                                        <button onClick={() => handleDelete(patient.id)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
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
            ) : (
                <div className="text-center py-8 text-gray-500 text-lg">Aucun patient trouvé.</div>
            )}
        </div>
    );
};

export default PatientsList;