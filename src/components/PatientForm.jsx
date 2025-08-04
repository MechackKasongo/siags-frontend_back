import React, { useState, useEffect } from 'react';
import PatientService from '../services/patient.service';
import { toast } from 'react-toastify'; // Pour les notifications
import 'react-toastify/dist/ReactToastify.css';

// Props:
// patientToEdit: objet patient si en mode édition, null si en mode création
// onSaveSuccess: callback à exécuter après une sauvegarde réussie
// onCancel: callback à exécuter si l'utilisateur annule

const PatientForm = ({ patientToEdit, onSaveSuccess, onCancel }) => {
    const initialPatientState = {
        lastName: '',
        firstName: '',
        gender: '',
        birthDate: '', // Format 'YYYY-MM-DD' pour input type="date"
        address: '',
        city: '',
        zipCode: '',
        phoneNumber: '',
        recordNumber: '',
        email: '',
        bloodType: '',
        knownIllnesses: '',
        allergies: ''
    };

    const [patient, setPatient] = useState(initialPatientState);
    const [loading, setLoading] = useState(false);
    const [formMessage, setFormMessage] = useState('');

    useEffect(() => {
        if (patientToEdit) {
            // Si un patient est passé pour l'édition, pré-remplir le formulaire
            setPatient({
                ...patientToEdit,
                birthDate: patientToEdit.birthDate ? new Date(patientToEdit.birthDate).toISOString().split('T')[0] : '' // Format YYYY-MM-DD
            });
        } else {
            // Sinon, réinitialiser le formulaire pour une nouvelle création
            setPatient(initialPatientState);
        }
    }, [patientToEdit]); // Re-exécuter quand patientToEdit change

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient(prevPatient => ({
            ...prevPatient,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormMessage('');

        try {
            if (patientToEdit) {
                // Mode édition
                await PatientService.updatePatient(patientToEdit.id, patient);
                toast.success("Patient mis à jour avec succès !");
            } else {
                // Mode création
                await PatientService.createPatient(patient);
                toast.success("Patient créé avec succès !");
            }
            onSaveSuccess(); // Appeler le callback de succès du parent
            setPatient(initialPatientState); // Réinitialiser le formulaire après création
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du patient :", error.response || error);
            const resMessage =
                (error.response &&
                    error.response.data &&
                    (error.response.data.message || error.response.data.error)) || // Vérifier 'error' aussi
                error.message ||
                error.toString();
            setFormMessage("Erreur: " + resMessage);
            toast.error("Échec de la sauvegarde du patient: " + resMessage);
        } finally {
            setLoading(false);
        }
    };

    // Options pour le genre et le groupe sanguin (vous pouvez les obtenir du backend si elles sont dynamiques)
    const genderOptions = ['MASCULIN', 'FEMININ', 'AUTRE']; // Assurez-vous que ça correspond à votre backend si vous utilisez une Enum
    const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']; // Assurez-vous que ça correspond à votre backend

    return (
        <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
                {patientToEdit ? 'Éditer le Patient' : 'Ajouter un Nouveau Patient'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Nom de famille */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom de famille <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={patient.lastName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Prénom */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={patient.firstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Numéro de dossier */}
                    <div>
                        <label htmlFor="recordNumber" className="block text-sm font-medium text-gray-700">N° Dossier <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="recordNumber"
                            name="recordNumber"
                            value={patient.recordNumber}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            readOnly={!!patientToEdit} // Rendre lecture seule en mode édition
                        />
                    </div>
                    {/* Genre */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Genre</label>
                        <select
                            id="gender"
                            name="gender"
                            value={patient.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Sélectionner</option>
                            {genderOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    {/* Date de Naissance */}
                    <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Date de Naissance</label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={patient.birthDate}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={patient.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Téléphone */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={patient.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Groupe Sanguin */}
                    <div>
                        <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Groupe Sanguin</label>
                        <select
                            id="bloodType"
                            name="bloodType"
                            value={patient.bloodType}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Sélectionner</option>
                            {bloodTypeOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    {/* Adresse */}
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={patient.address}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Ville */}
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={patient.city}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Code Postal */}
                    <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Code Postal</label>
                        <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={patient.zipCode}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Maladies Connues */}
                    <div className="md:col-span-2">
                        <label htmlFor="knownIllnesses" className="block text-sm font-medium text-gray-700">Maladies Connues</label>
                        <textarea
                            id="knownIllnesses"
                            name="knownIllnesses"
                            value={patient.knownIllnesses}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                    {/* Allergies */}
                    <div className="md:col-span-2">
                        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
                        <textarea
                            id="allergies"
                            name="allergies"
                            value={patient.allergies}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        {loading ? 'Sauvegarde...' : (patientToEdit ? 'Mettre à jour' : 'Ajouter')}
                    </button>
                </div>

                {formMessage && (
                    <p className={`mt-4 text-center ${formMessage.includes('Erreur') ? 'text-red-600' : 'text-green-600'}`}>
                        {formMessage}
                    </p>
                )}
            </form>
        </div>
    );
};

export default PatientForm;