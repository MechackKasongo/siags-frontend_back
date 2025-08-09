import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdmissionService from '../../services/admission.service';
import PatientService from '../../services/patient.service';
import DepartmentService from '../../services/department.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';

// Nouveau composant pour contenir le formulaire et ses Hooks
const AdmissionEditFormContent = ({ initialData, handleSubmit, status, id }) => {
    const { admission, patients, departments } = initialData;

    // Utilisation des Hooks dans ce nouveau composant pour respecter les règles
    const [admissionData, setAdmissionData] = useState({
        patientId: admission.patient?.id || '',
        departmentId: admission.assignedDepartment?.id || '',
        reasonForAdmission: admission.reasonForAdmission,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmissionData({ ...admissionData, [name]: value });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Modifier l'Admission #{id}</h2>
                {status.message && (
                    <div className={`form-message text-center p-3 rounded-lg mb-4 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {status.message}
                    </div>
                )}
                <form onSubmit={(e) => handleSubmit(e, admissionData)} className="space-y-6">
                    <div className="form-group">
                        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient :</label>
                        <select
                            id="patientId"
                            name="patientId"
                            value={admissionData.patientId}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.nom} {patient.prenom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">Département :</label>
                        <select
                            id="departmentId"
                            name="departmentId"
                            value={admissionData.departmentId}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reasonForAdmission" className="block text-sm font-medium text-gray-700">Motif d'admission :</label>
                        <textarea
                            id="reasonForAdmission"
                            name="reasonForAdmission"
                            value={admissionData.reasonForAdmission}
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
                        {status.loading ? 'Mise à jour en cours...' : 'Mettre à jour l\'admission'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const AdmissionEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    // Fonction pour l'appel API initial
    const fetchAdmissionAndOptions = async () => {
        try {
            const admissionRes = await AdmissionService.getAdmissionById(id);
            const patientsRes = await PatientService.getPatients();
            const departmentsRes = await DepartmentService.getDepartments();

            return {
                admission: admissionRes.data,
                patients: patientsRes.data,
                departments: departmentsRes.data,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'admission ou des options:", error.response || error);
            throw error;
        }
    };

    // Fonction pour la soumission du formulaire
    const handleSubmit = async (e, admissionData) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', type: '' });

        try {
            // Envoi de l'objet de données tel quel, car l'API attend probablement des identifiants non imbriqués
            const payload = {
                patientId: admissionData.patientId,
                departmentId: admissionData.departmentId,
                reasonForAdmission: admissionData.reasonForAdmission,
            };

            await AdmissionService.updateAdmission(id, payload);
            setStatus({ loading: false, message: 'Admission mise à jour avec succès !', type: 'success' });
            setTimeout(() => {
                navigate(`/admissions`);
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la mise à jour de l\'admission:', err.response || err);
            setStatus({ loading: false, message: 'Échec de la mise à jour de l\'admission.', type: 'error' });
        }
    };

    return (
        <ApiStateHandler
            apiCall={fetchAdmissionAndOptions}
            renderSuccess={(data) => (
                <AdmissionEditFormContent
                    initialData={data}
                    handleSubmit={handleSubmit}
                    status={status}
                    id={id}
                />
            )}
            loadingMessage="Chargement des données de l'admission..."
        />
    );
};

export default AdmissionEditForm;
