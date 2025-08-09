import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConsultationService from '../../services/consultation.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';
import { toast } from 'react-toastify';

/**
 * Composant pour le formulaire de modification d'une consultation existante.
 * Il récupère l'ID de la consultation depuis l'URL.
 */
const ConsultationEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    // Fonction pour l'appel API initial qui récupère les données de la consultation
    const fetchConsultation = async () => {
        try {
            const response = await ConsultationService.getConsultationById(id);
            return response.data;
        } catch (err) {
            console.error('Erreur lors de la récupération de la consultation:', err.response || err);
            throw new Error('Impossible de charger les données de la consultation.');
        }
    };

    // Fonction pour la soumission du formulaire de modification
    const handleSubmit = async (e, consultationData) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', type: '' });

        try {
            await ConsultationService.updateConsultation(id, consultationData);
            toast.success('Consultation mise à jour avec succès !');
            setStatus({ loading: false, message: 'Consultation mise à jour avec succès !', type: 'success' });
            setTimeout(() => {
                navigate(`/consultations`); // Rediriger vers la liste après succès
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la consultation:', err.response || err);
            toast.error('Échec de la mise à jour de la consultation.');
            setStatus({ loading: false, message: 'Échec de la mise à jour de la consultation.', type: 'error' });
        }
    };

    // Rendre le formulaire de modification
    const renderForm = (consultation) => {
        const [consultationData, setConsultationData] = useState({
            consultationDate: consultation.consultationDate,
            consultationType: consultation.consultationType,
            admissionId: consultation.admission.id,
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setConsultationData({ ...consultationData, [name]: value });
        };

        return (
            <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center font-sans">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Modifier la Consultation #{id}</h2>
                    {status.message && (
                        <div className={`form-message text-center p-3 rounded-lg mb-4 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status.message}
                        </div>
                    )}
                    <form onSubmit={(e) => handleSubmit(e, consultationData)} className="space-y-6">
                        <div>
                            <label htmlFor="consultationDate" className="block text-sm font-medium text-gray-700">Date de Consultation :</label>
                            <input
                                type="date"
                                id="consultationDate"
                                name="consultationDate"
                                value={consultationData.consultationDate}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700">Type de Consultation :</label>
                            <input
                                type="text"
                                id="consultationType"
                                name="consultationType"
                                value={consultationData.consultationType}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-500">Admission associée : <span className="font-semibold">{consultation.admission?.id}</span></p>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={status.loading}
                        >
                            {status.loading ? 'Mise à jour en cours...' : 'Mettre à jour la consultation'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <ApiStateHandler
            apiCall={fetchConsultation}
            renderSuccess={renderForm}
            loadingMessage="Chargement des données de la consultation..."
        />
    );
};

export default ConsultationEditForm;
