import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientService from '../../services/patient.service';
import { toast } from 'react-toastify'; // Importez la fonction toast

const PatientForm = () => {
    const [patient, setPatient] = useState({
        nom: '',
        prenom: '',
        dateNaissance: '', // Format 'YYYY-MM-DD'
        sexe: '',
        numeroDossier: '',
        adresse: '',
        numeroTelephone: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // État pour stocker les erreurs de validation
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Met à jour l'état du patient
        setPatient({ ...patient, [name]: value });

        // Efface l'erreur pour ce champ lorsqu'il est modifié
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    // Fonction de validation
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!patient.nom) {
            newErrors.nom = 'Le nom est obligatoire.';
            isValid = false;
        }
        if (!patient.prenom) {
            newErrors.prenom = 'Le prénom est obligatoire.';
            isValid = false;
        }
        if (!patient.dateNaissance) {
            newErrors.dateNaissance = 'La date de naissance est obligatoire.';
            isValid = false;
        }
        if (!patient.sexe) {
            newErrors.sexe = 'Le sexe est obligatoire.';
            isValid = false;
        }
        if (!patient.numeroDossier) {
            newErrors.numeroDossier = 'Le numéro de dossier est obligatoire.';
            isValid = false;
        }
        // Vous pouvez ajouter d'autres validations ici (ex: format de téléphone, etc.)

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Étape 1 : Valider le formulaire
        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs dans le formulaire.');
            return;
        }

        setLoading(true);

        try {
            // Étape 2 : Envoyer les données si la validation est réussie
            await PatientService.createPatient(patient);
            toast.success('Patient ajouté avec succès !'); // Utilise le toast

            // Redirection après un petit délai pour afficher le message de succès
            setTimeout(() => {
                navigate('/patients');
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la création du patient:', err.response || err);
            toast.error('Échec de la création du patient. Veuillez réessayer.'); // Utilise le toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="patient-form-container">
            <h2>Ajouter un Nouveau Patient</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nom">Nom :</label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={patient.nom}
                        onChange={handleChange}
                        // L'attribut 'required' n'est plus nécessaire car nous faisons la validation manuelle
                    />
                    {errors.nom && <p className="error-message">{errors.nom}</p>}
                </div>
                <div>
                    <label htmlFor="prenom">Prénom :</label>
                    <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={patient.prenom}
                        onChange={handleChange}
                    />
                    {errors.prenom && <p className="error-message">{errors.prenom}</p>}
                </div>
                <div>
                    <label htmlFor="dateNaissance">Date de Naissance :</label>
                    <input
                        type="date"
                        id="dateNaissance"
                        name="dateNaissance"
                        value={patient.dateNaissance}
                        onChange={handleChange}
                    />
                    {errors.dateNaissance && <p className="error-message">{errors.dateNaissance}</p>}
                </div>
                <div>
                    <label htmlFor="sexe">Sexe :</label>
                    <select
                        id="sexe"
                        name="sexe"
                        value={patient.sexe}
                        onChange={handleChange}
                    >
                        <option value="">Sélectionner</option>
                        <option value="MASCULIN">Masculin</option>
                        <option value="FEMININ">Féminin</option>
                        <option value="AUTRE">Autre</option>
                    </select>
                    {errors.sexe && <p className="error-message">{errors.sexe}</p>}
                </div>
                <div>
                    <label htmlFor="numeroDossier">Numéro de Dossier :</label>
                    <input
                        type="text"
                        id="numeroDossier"
                        name="numeroDossier"
                        value={patient.numeroDossier}
                        onChange={handleChange}
                    />
                    {errors.numeroDossier && <p className="error-message">{errors.numeroDossier}</p>}
                </div>
                <div>
                    <label htmlFor="adresse">Adresse :</label>
                    <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        value={patient.adresse}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="numeroTelephone">Numéro de Téléphone :</label>
                    <input
                        type="tel"
                        id="numeroTelephone"
                        name="numeroTelephone"
                        value={patient.numeroTelephone}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Ajout en cours...' : 'Ajouter le Patient'}
                </button>
            </form>
        </div>
    );
};

export default PatientForm;