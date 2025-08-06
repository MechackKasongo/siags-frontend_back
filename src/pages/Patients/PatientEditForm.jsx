import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientService from '../../services/patient.service';

const PatientEditForm = () => {
    const { id } = useParams(); // Récupère l'ID du patient depuis l'URL
    const navigate = useNavigate();

    const [patient, setPatient] = useState({
        nom: '',
        prenom: '',
        dateNaissance: '',
        sexe: '',
        numeroDossier: '',
        adresse: '',
        numeroTelephone: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await PatientService.getPatientById(id);
                // Utilise la réponse pour initialiser l'état du formulaire
                setPatient(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération du patient:', err);
                setMessage('Impossible de charger les données du patient.');
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
            setMessage('Patient mis à jour avec succès !');
            // Redirection après un petit délai
            setTimeout(() => {
                navigate(`/patients/${id}`);
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du patient:', err.response || err);
            setMessage('Échec de la mise à jour du patient.');
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Chargement du formulaire d'édition...</div>;
    }

    return (
        <div className="patient-form-container">
            <h2>Modifier le Patient : {patient.nom} {patient.prenom}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nom">Nom :</label>
                    <input type="text" id="nom" name="nom" value={patient.nom} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="prenom">Prénom :</label>
                    <input type="text" id="prenom" name="prenom" value={patient.prenom} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="dateNaissance">Date de Naissance :</label>
                    <input type="date" id="dateNaissance" name="dateNaissance" value={patient.dateNaissance} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="sexe">Sexe :</label>
                    <select id="sexe" name="sexe" value={patient.sexe} onChange={handleChange} required>
                        <option value="">Sélectionner</option>
                        <option value="MASCULIN">Masculin</option>
                        <option value="FEMININ">Féminin</option>
                        <option value="AUTRE">Autre</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="numeroDossier">Numéro de Dossier :</label>
                    <input type="text" id="numeroDossier" name="numeroDossier" value={patient.numeroDossier} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="adresse">Adresse :</label>
                    <input type="text" id="adresse" name="adresse" value={patient.adresse} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="numeroTelephone">Numéro de Téléphone :</label>
                    <input type="tel" id="numeroTelephone" name="numeroTelephone" value={patient.numeroTelephone} onChange={handleChange} />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
                </button>
                {message && (
                    <div className={`form-message ${message.includes('succès') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default PatientEditForm;