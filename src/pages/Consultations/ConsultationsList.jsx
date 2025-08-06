// src/pages/Consultations/ConsultationsList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConsultationService from '../../services/consultation.service';


const ConsultationsList = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchConsultations = async () => {
        try {
            const response = await ConsultationService.getConsultations();
            setConsultations(response.data);
        } catch (err) {
            console.error('Erreur lors de la récupération des consultations:', err);
            setError('Impossible de charger la liste des consultations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultations();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
            try {
                await ConsultationService.deleteConsultation(id);
                alert('Consultation supprimée avec succès !');
                fetchConsultations(); // Recharger la liste après suppression
            } catch (err) {
                console.error('Erreur lors de la suppression de la consultation:', err);
                alert('Échec de la suppression de la consultation.');
            }
        }
    };

    if (loading) return <div>Chargement des consultations...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="consultations-list-container">
            <div className="consultations-header">
                <h2>Liste des Consultations</h2>
                {/* On peut ajouter un lien vers un formulaire de création de consultation ici si vous le souhaitez */}
            </div>
            {consultations.length > 0 ? (
                <table className="consultations-table">
                    <thead>
                    <tr>
                        <th>ID Consultation</th>
                        <th>ID Admission</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Actions</th> {/* Nouvelle colonne */}
                    </tr>
                    </thead>
                    <tbody>
                    {consultations.map((consultation) => (
                        <tr key={consultation.id}>
                            <td>{consultation.id}</td>
                            <td>{consultation.admission?.id}</td>
                            <td>{consultation.consultationDate}</td>
                            <td>{consultation.consultationType}</td>
                            <td>
                                <Link to={`/consultations/edit/${consultation.id}`} className="action-button edit">Modifier</Link>
                                <button onClick={() => handleDelete(consultation.id)} className="action-button delete">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucune consultation trouvée.</p>
            )}
        </div>
    );
};

export default ConsultationsList;