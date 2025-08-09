import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultationService from '../../services/consultation.service';
import AdmissionService from '../../services/admission.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';
import { toast } from 'react-toastify';

/**
 * Composant pour le formulaire de création d'une nouvelle consultation.
 * Il récupère la liste des admissions pour le sélecteur.
 */
const ConsultationForm = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    // Les hooks d'état sont maintenant au niveau supérieur du composant
    const [consultationData, setConsultationData] = useState({
        consultationDate: '',
        consultationType: '',
        admissionId: '',
    });

    // Appel API pour récupérer les admissions pour le sélecteur
    const fetchAdmissions = async () => {
        try {
            const response = await AdmissionService.getAdmissions();
            return response.data;
        } catch (err) {
            console.error('Erreur lors de la récupération des admissions:', err.response || err);
            throw new Error('Impossible de charger la liste des admissions pour la sélection.');
        }
    };

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setConsultationData({ ...consultationData, [name]: value });
    };

    // Gérer la soumission du formulaire de création
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', type: '' });

        try {
            await ConsultationService.createConsultation(consultationData);
            toast.success('Consultation créée avec succès !');
            setStatus({ loading: false, message: 'Consultation créée avec succès !', type: 'success' });
            setTimeout(() => navigate('/consultations'), 2000); // Rediriger après succès
        } catch (err) {
            console.error('Erreur lors de la création de la consultation:', err.response || err);
            toast.error('Échec de la création de la consultation.');
            setStatus({ loading: false, message: 'Échec de la création de la consultation.', type: 'error' });
        }
    };

    // Rendre le formulaire avec les données d'admissions
    const renderForm = (admissions) => {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center font-sans">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Créer une Nouvelle Consultation</h2>
                    {status.message && (
                        <div className={`form-message text-center p-3 rounded-lg mb-4 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="admissionId" className="block text-sm font-medium text-gray-700">Admission :</label>
                            <select
                                id="admissionId"
                                name="admissionId"
                                value={consultationData.admissionId}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Sélectionner une admission</option>
                                {admissions.map((admission) => (
                                    <option key={admission.id} value={admission.id}>
                                        Admission #{admission.id} - Patient: {admission.patient?.nom} {admission.patient?.prenom}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={status.loading}
                        >
                            {status.loading ? 'Création en cours...' : 'Créer la consultation'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <ApiStateHandler
            apiCall={fetchAdmissions}
            renderSuccess={renderForm}
            loadingMessage="Chargement des admissions pour la sélection..."
        />
    );
};

export default ConsultationForm;
