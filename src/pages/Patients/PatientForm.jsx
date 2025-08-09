import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientService from '../../services/patient.service';
import { toast } from 'react-toastify';

/**
 * @description Formulaire pour ajouter un nouveau patient.
 * @component
 */
const PatientForm = () => {
    // Les noms des champs ont été mis à jour pour correspondre au backend Spring Boot
    const [patient, setPatient] = useState({
        lastName: '',
        firstName: '',
        birthDate: '',
        gender: '',
        recordNumber: '',
        address: '',
        phoneNumber: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value });
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    /**
     * @description Valide les champs obligatoires du formulaire côté client.
     * @returns {boolean} True si le formulaire est valide, sinon False.
     */
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
        if (!patient.lastName) { newErrors.lastName = 'Le nom est obligatoire.'; isValid = false; }
        if (!patient.firstName) { newErrors.firstName = 'Le prénom est obligatoire.'; isValid = false; }
        if (!patient.birthDate) { newErrors.birthDate = 'La date de naissance est obligatoire.'; isValid = false; }
        if (!patient.gender) { newErrors.gender = 'Le sexe est obligatoire.'; isValid = false; }
        if (!patient.recordNumber) { newErrors.recordNumber = 'Le numéro de dossier est obligatoire.'; isValid = false; }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs dans le formulaire.');
            return;
        }
        setLoading(true);
        try {
            await PatientService.createPatient(patient);
            toast.success('Patient ajouté avec succès !');
            setTimeout(() => {
                navigate('/patients');
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la création du patient:', err.response || err);
            // L'erreur du backend fournit des messages de validation spécifiques
            const errorMessage = err.response?.data?.message || 'Échec de la création du patient.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 bg-white rounded-lg shadow-xl font-sans max-w-2xl mt-10">
            <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Ajouter un Nouveau Patient</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom :</label>
                    <input type="text" id="lastName" name="lastName" value={patient.lastName} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom :</label>
                    <input type="text" id="firstName" name="firstName" value={patient.firstName} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Date de Naissance :</label>
                    <input type="date" id="birthDate" name="birthDate" value={patient.birthDate} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Sexe :</label>
                    <select id="gender" name="gender" value={patient.gender} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Sélectionner</option>
                        <option value="MASCULIN">Masculin</option>
                        <option value="FEMININ">Féminin</option>
                        <option value="AUTRE">Autre</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>
                <div>
                    <label htmlFor="recordNumber" className="block text-sm font-medium text-gray-700">Numéro de Dossier :</label>
                    <input type="text" id="recordNumber" name="recordNumber" value={patient.recordNumber} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    {errors.recordNumber && <p className="text-red-500 text-sm mt-1">{errors.recordNumber}</p>}
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse :</label>
                    <input type="text" id="address" name="address" value={patient.address} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Numéro de Téléphone :</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={patient.phoneNumber} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full px-4 py-2 text-white bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300">
                    {loading ? 'Ajout en cours...' : 'Ajouter le Patient'}
                </button>
            </form>
        </div>
    );
};

export default PatientForm;
