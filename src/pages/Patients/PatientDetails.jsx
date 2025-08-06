import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook pour récupérer les paramètres de l'URL
import PatientService from '../../services/patient.service';
import { Link } from 'react-router-dom';

const PatientDetails = () => {
    const { id } = useParams(); // Récupère l'ID du patient depuis l'URL
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await PatientService.getPatientById(id);
                setPatient(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des détails du patient:', err);
                setError('Impossible de charger les détails du patient.');
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]); // Relancer l'effet si l'ID dans l'URL change

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
            try {
                await PatientService.deletePatient(id);
                alert('Patient supprimé avec succès !');
                navigate('/patients'); // Redirection vers la liste des patients
            } catch (err) {
                console.error('Erreur lors de la suppression du patient:', err);
                alert('Échec de la suppression du patient.');
            }
        }
    };

    if (loading) {
        return <div>Chargement des détails du patient...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!patient) {
        return <div>Aucun patient trouvé.</div>;
    }

    return (
        <div className="patient-details-container">
            <div className="patient-details-header">
                <h2>Détails du Patient : {patient.nom} {patient.prenom}</h2>
                <div className="patient-actions">
                    <Link to={`/patients/edit/${patient.id}`} className="edit-button">Modifier</Link>
                    <button onClick={handleDelete} className="delete-button">Supprimer</button>
                </div>
            </div>
            <h2>Détails du Patient : {patient.nom} {patient.prenom}</h2>
            <p><strong>Numéro de Dossier :</strong> {patient.numeroDossier}</p>
            <p><strong>Date de Naissance :</strong> {patient.dateNaissance}</p>
            <p><strong>Sexe :</strong> {patient.sexe}</p>
            <p><strong>Adresse :</strong> {patient.adresse}</p>
            <p><strong>Téléphone :</strong> {patient.numeroTelephone}</p>


        </div>
    );
};

export default PatientDetails;