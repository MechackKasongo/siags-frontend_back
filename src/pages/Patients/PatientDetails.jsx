import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PatientService from '../../services/patient.service';
import { toast } from 'react-toastify';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

/**
 * Un hook personnalisé pour gérer l'état d'un appel API (loading, data, error).
 * Cela centralise la logique et rend les composants plus propres.
 * @param {Function} apiFunction - La fonction asynchrone qui effectue l'appel API.
 * @param {Array} dependencies - Un tableau de dépendances pour relancer l'appel si elles changent.
 * @returns {Object} Un objet contenant les états de chargement, de données et d'erreur.
 */
const useApiState = (apiFunction, dependencies) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiFunction();
                if (isMounted) {
                    setData(response.data);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Erreur lors de la récupération des données:', err);
                    const errorMessage = err.response?.data?.message || 'Impossible de charger les données.';
                    setError(errorMessage);
                    toast.error(errorMessage);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, dependencies);

    return { loading, data, error };
};

/**
 * @description Affiche les détails d'un patient et permet de le supprimer ou de le modifier.
 * @component
 */
const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Utilisation du hook useApiState pour gérer l'appel API
    const { loading, data: patient, error } = useApiState(() => PatientService.getPatientById(id), [id]);

    /**
     * @description Ouvre la modale de confirmation de suppression.
     */
    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    /**
     * @description Gère l'action de suppression du patient.
     */
    const handleDelete = async () => {
        try {
            await PatientService.deletePatient(id);
            toast.success('Patient supprimé avec succès !');
            navigate('/patients');
        } catch (err) {
            console.error('Erreur lors de la suppression du patient:', err);
            const errorMessage = err.response?.data?.message || 'Échec de la suppression du patient.';
            toast.error(errorMessage);
        } finally {
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Chargement des détails du patient...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500 font-bold">{error}</div>;
    }

    if (!patient) {
        return <div className="flex items-center justify-center min-h-screen text-gray-500">Aucun patient trouvé.</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-xl font-sans">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-extrabold text-gray-800">Détails du Patient</h2>
                <div className="flex space-x-2">
                    <Link to={`/patients/edit/${patient.id}`} className="inline-flex items-center px-4 py-2 text-white bg-yellow-500 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                        <FaEdit className="mr-2" /> Modifier
                    </Link>
                    <button onClick={openDeleteModal} className="inline-flex items-center px-4 py-2 text-white bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        <FaTrashAlt className="mr-2" /> Supprimer
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <p><strong>Nom :</strong> {patient.lastName}</p>
                <p><strong>Prénom :</strong> {patient.firstName}</p>
                <p><strong>Numéro de Dossier :</strong> {patient.recordNumber}</p>
                <p><strong>Date de Naissance :</strong> {patient.birthDate}</p>
                <p><strong>Sexe :</strong> {patient.gender}</p>
                <p><strong>Adresse :</strong> {patient.address}</p>
                <p><strong>Téléphone :</strong> {patient.phoneNumber}</p>
            </div>
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

export default PatientDetails;
