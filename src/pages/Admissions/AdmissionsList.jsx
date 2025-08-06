// src/pages/Admissions/AdmissionsList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdmissionService from '../../services/admission.service';


const AdmissionsList = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchAdmissions = async () => {
        try {
            const response = await AdmissionService.getAdmissions();
            setAdmissions(response.data);
        } catch (err) {
            console.error('Erreur lors de la récupération des admissions:', err);
            setError('Impossible de charger la liste des admissions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette admission ?')) {
            try {
                await AdmissionService.deleteAdmission(id);
                alert('Admission supprimée avec succès !');
                fetchAdmissions(); // Recharger la liste après suppression
            } catch (err) {
                console.error('Erreur lors de la suppression de l\'admission:', err);
                alert('Échec de la suppression de l\'admission.');
            }
        }
    };

    if (loading) return <div className="admissions-container">Chargement de la liste des admissions...</div>;
    if (error) return <div className="admissions-container error-message">{error}</div>;

    return (
        <div className="admissions-container">
            <div className="admissions-header">
                <h2>Liste des Admissions</h2>
                <Link to="/admissions/new" className="add-button">
                    Créer une admission
                </Link>
            </div>
            {admissions.length > 0 ? (
                <table className="admissions-table">
                    <thead>
                    <tr>
                        <th>ID Admission</th>
                        <th>ID Patient</th>
                        <th>Motif</th>
                        <th>Département</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {admissions.map((admission) => (
                        <tr key={admission.id} className="admission-row">
                            <td>{admission.id}</td>
                            <td>{admission.patient?.id}</td>
                            <td>{admission.reasonForAdmission}</td>
                            <td>{admission.assignedDepartment?.name}</td>
                            <td>{admission.status}</td>
                            <td>
                                <Link to={`/admissions/edit/${admission.id}`} className="action-button edit">Modifier</Link>
                                <button onClick={() => handleDelete(admission.id)} className="action-button delete">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-admissions-message">Aucune admission trouvée.</p>
            )}
        </div>
    );
};

export default AdmissionsList;