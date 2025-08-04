import React, { useState, useEffect } from 'react';
import PatientService from '../services/patient.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Si vous n'avez pas encore installé ces dépendances :
// npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons react-toastify

const PatientList = ({ onEditPatient, onAddPatient }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        // Filtrer les patients chaque fois que la liste des patients ou le terme de recherche change
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = patients.filter(patient =>
            patient.firstName.toLowerCase().includes(lowercasedSearchTerm) ||
            patient.lastName.toLowerCase().includes(lowercasedSearchTerm) ||
            patient.recordNumber.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredPatients(filtered);
    }, [patients, searchTerm]);

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await PatientService.getAllPatients();
            setPatients(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Erreur lors de la récupération des patients:", err);
            setError("Impossible de charger les patients. Veuillez réessayer.");
            setLoading(false);
            toast.error("Échec du chargement des patients.");
        }
    };

    const handleDeletePatient = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.")) {
            try {
                await PatientService.deletePatient(id);
                toast.success("Patient supprimé avec succès !");
                fetchPatients(); // Recharger la liste après suppression
            } catch (err) {
                console.error("Erreur lors de la suppression du patient:", err);
                toast.error("Échec de la suppression du patient.");
            }
        }
    };

    if (loading) {
        return <div className="text-center py-4">Chargement des patients...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gestion des Patients</h2>

            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom ou numéro de dossier..."
                        className="p-2 pl-10 border rounded w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                    onClick={onAddPatient}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Ajouter Patient
                </button>
            </div>

            {filteredPatients.length === 0 ? (
                <p className="text-center text-gray-500">Aucun patient trouvé.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full leading-normal">
                        <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                N° Dossier
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Nom Complet
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Genre
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date de Naissance
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Téléphone
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {patient.recordNumber}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {patient.lastName} {patient.firstName}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {patient.gender}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {patient.birthDate}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {patient.phoneNumber}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {patient.email}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button
                                        onClick={() => onEditPatient(patient)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                        title="Modifier"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        onClick={() => handleDeletePatient(patient.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Supprimer"
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PatientList;