import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdmissionService from '../../services/admission.service';
import PatientService from '../../services/patient.service';
import DepartmentService from '../../services/department.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';
import { toast } from 'react-toastify';

/**
 * Composant pour le formulaire de création d'une nouvelle admission.
 * Il récupère les listes de patients et de départements pour les sélecteurs.
 */
const AdmissionForm = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    // État du formulaire pour la nouvelle admission
    const [admissionData, setAdmissionData] = useState({
        admissionDate: '',
        dischargeDate: '',
        reason: '',
        patientId: '',
        departmentId: '',
    });

    // Fonction pour l'appel API qui récupère les patients et les départements en parallèle
    const fetchDependencies = async () => {
        try {
            const [patientsResponse, departmentsResponse] = await Promise.all([
                PatientService.getPatients(),
                DepartmentService.getDepartments()
            ]);
            return {
                patients: patientsResponse.data,
                departments: departmentsResponse.data
            };
        } catch (err) {
            console.error('Erreur lors de la récupération des dépendances:', err.response || err);
            throw new Error('Impossible de charger les listes de patients et de départements.');
        }
    };

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmissionData({ ...admissionData, [name]: value });
    };

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', type: '' });

        // Mise à jour pour correspondre au DTO de la requête backend
        // Les champs patientId et departmentId sont maintenant envoyés directement
        // Le champ status est ajouté avec la valeur par défaut 'ACTIVE'
        const payload = {
            patientId: admissionData.patientId,
            departmentId: admissionData.departmentId,
            reasonForAdmission: admissionData.reason,
            admissionDate: admissionData.admissionDate
                ? new Date(admissionData.admissionDate).toISOString()
                : null,
            dischargeDate: admissionData.dischargeDate
                ? new Date(admissionData.dischargeDate).toISOString()
                : null,
            status: 'ACTIVE', // Le statut est obligatoire et est 'ACTIVE' par défaut
        };

        try {
            await AdmissionService.createAdmission(payload);
            toast.success('Admission créée avec succès !');
            setStatus({ loading: false, message: 'Admission créée avec succès !', type: 'success' });
            setTimeout(() => navigate('/admissions'), 2000); // Rediriger après succès
        } catch (err) {
            console.error('Erreur lors de la création de l\'admission:', err.response || err);
            toast.error('Échec de la création de l\'admission.');
            setStatus({ loading: false, message: 'Échec de la création de l\'admission.', type: 'error' });
        }
    };

    // Rendre le formulaire avec les données chargées
    const renderForm = (data) => {
        const { patients, departments } = data;
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center font-sans">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Créer une Nouvelle Admission</h2>
                    {status.message && (
                        <div className={`form-message text-center p-3 rounded-lg mb-4 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient :</label>
                            <select
                                id="patientId"
                                name="patientId"
                                value={admissionData.patientId}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Sélectionner un patient</option>
                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.nom} {patient.prenom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">Département :</label>
                            <select
                                id="departmentId"
                                name="departmentId"
                                value={admissionData.departmentId}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Sélectionner un département</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">Date d'admission :</label>
                            <input
                                type="datetime-local"
                                id="admissionDate"
                                name="admissionDate"
                                value={admissionData.admissionDate}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="dischargeDate" className="block text-sm font-medium text-gray-700">Date de sortie (optionnelle) :</label>
                            <input
                                type="datetime-local"
                                id="dischargeDate"
                                name="dischargeDate"
                                value={admissionData.dischargeDate}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Raison de l'admission :</label>
                            <textarea
                                id="reason"
                                name="reason"
                                value={admissionData.reason}
                                onChange={handleChange}
                                rows="3"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={status.loading}
                        >
                            {status.loading ? 'Création en cours...' : 'Créer l\'admission'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <ApiStateHandler
            apiCall={fetchDependencies}
            renderSuccess={renderForm}
            loadingMessage="Chargement des patients et des départements..."
        />
    );
};

export default AdmissionForm;
