import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConsultationService from '../../services/consultation.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Composant pour afficher la liste des consultations avec des actions d'édition et de suppression.
 * Il utilise ApiStateHandler pour gérer les états de chargement et d'erreur.
 */
const ConsultationsList = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    // Fonction pour l'appel API qui récupère toutes les consultations
    const fetchConsultations = async () => {
        try {
            const response = await ConsultationService.getConsultations();
            return response.data;
        } catch (err) {
            console.error('Erreur lors de la récupération des consultations:', err.response || err);
            throw new Error('Impossible de charger la liste des consultations.');
        }
    };

    // Fonction pour gérer la suppression d'une consultation
    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
            try {
                await ConsultationService.deleteConsultation(id);
                toast.success('Consultation supprimée avec succès !');
                setRefreshKey(prevKey => prevKey + 1); // Déclencher un re-fetch des données
            } catch (err) {
                console.error('Erreur lors de la suppression de la consultation:', err.response || err);
                toast.error('Échec de la suppression de la consultation.');
            }
        }
    };

    // Fonction qui rend le tableau des consultations
    const renderConsultationsTable = (consultations) => {
        return (
            <>
                <div className="consultations-header flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Liste des Consultations</h2>
                    <Link to="/consultations/new" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Créer une consultation
                    </Link>
                </div>
                {consultations.length > 0 ? (
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID Consultation</th>
                            <th className="py-3 px-6 text-left">ID Admission</th>
                            <th className="py-3 px-6 text-left">Date</th>
                            <th className="py-3 px-6 text-left">Type</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                        {consultations.map((consultation) => (
                            <tr key={consultation.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{consultation.id}</td>
                                <td className="py-3 px-6 text-left">{consultation.admission?.id}</td>
                                <td className="py-3 px-6 text-left">{consultation.consultationDate}</td>
                                <td className="py-3 px-6 text-left">{consultation.consultationType}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-2">
                                        <Link to={`/consultations/edit/${consultation.id}`} className="transform hover:text-indigo-500 hover:scale-110">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(consultation.id)} className="transform hover:text-red-500 hover:scale-110">
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center text-lg mt-8">Aucune consultation trouvée.</p>
                )}
            </>
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="container mx-auto">
                <ApiStateHandler
                    key={refreshKey}
                    apiCall={fetchConsultations}
                    renderSuccess={renderConsultationsTable}
                    loadingMessage="Chargement de la liste des consultations..."
                />
            </div>
        </div>
    );
};

export default ConsultationsList;
