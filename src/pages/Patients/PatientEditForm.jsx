import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientService from '../../services/patient.service';
import { toast } from 'react-toastify';

/**
 * @description Formulaire pour modifier un patient existant.
 * @component
 */
const PatientEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [patient, setPatient] = useState({
        nom: '', prenom: '', dateNaissance: '', sexe: '',
        numeroDossier: '', adresse: '', numeroTelephone: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await PatientService.getPatientById(id);
                setPatient(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération du patient:', err);
                const errorMessage = err.response?.data?.message || 'Impossible de charger les données du patient.';
                toast.error(errorMessage);
                setMessage(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await PatientService.updatePatient(id, patient);
            toast.success('Patient mis à jour avec succès !');
            setTimeout(() => {
                navigate(`/patients/${id}`);
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du patient:', err.response || err);
            const errorMessage = err.response?.data?.message || 'Échec de la mise à jour du patient.';
            toast.error(errorMessage);
            setMessage(errorMessage);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Chargement du formulaire d'édition...</div>;
    }

    return (
        <div className="container mx-auto p-8 bg-white rounded-lg shadow-xl font-sans max-w-2xl mt-10">
            <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Modifier le Patient</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom :</label>
                    <input type="text" id="nom" name="nom" value={patient.nom} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom :</label>
                    <input type="text" id="prenom" name="prenom" value={patient.prenom} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">Date de Naissance :</label>
                    <input type="date" id="dateNaissance" name="dateNaissance" value={patient.dateNaissance} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">Sexe :</label>
                    <select id="sexe" name="sexe" value={patient.sexe} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Sélectionner</option>
                        <option value="MASCULIN">Masculin</option>
                        <option value="FEMININ">Féminin</option>
                        <option value="AUTRE">Autre</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="numeroDossier" className="block text-sm font-medium text-gray-700">Numéro de Dossier :</label>
                    <input type="text" id="numeroDossier" name="numeroDossier" value={patient.numeroDossier} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse :</label>
                    <input type="text" id="adresse" name="adresse" value={patient.adresse} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="numeroTelephone" className="block text-sm font-medium text-gray-700">Numéro de Téléphone :</label>
                    <input type="tel" id="numeroTelephone" name="numeroTelephone" value={patient.numeroTelephone} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300">
                    {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
                </button>
            </form>
            {message && (
                <div className={`mt-4 p-3 rounded-md text-center ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default PatientEditForm;
