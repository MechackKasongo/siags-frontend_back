import React, { useState, useEffect } from 'react';
import AuditService from '../../services/audit.service';
import AuthService from '../../services/auth.service';
import { Navigate } from 'react-router-dom';

const AuditPage = () => {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Vérification du rôle de l'utilisateur
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser && currentUser.roles.includes('ROLE_ADMIN');

    useEffect(() => {
        // Si l'utilisateur n'est pas un administrateur, nous n'effectuons pas l'appel API
        if (!isAdmin) {
            setLoading(false);
            return;
        }

        const fetchAudits = async () => {
            try {
                const response = await AuditService.getAuditEvents();
                setAudits(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des audits:', err);
                setError('Accès refusé ou impossible de charger la liste des audits.');
            } finally {
                setLoading(false);
            }
        };
        fetchAudits();
    }, [isAdmin]);

    if (!isAdmin) {
        // Redirige vers la page d'accueil si l'utilisateur n'est pas un admin
        return <Navigate to="/" />;
    }

    if (loading) {
        return <div>Chargement de la page d'audit...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="audits-container">
            <h2>Journaux d'Audit</h2>
            {audits.length > 0 ? (
                <table className="audits-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom d'utilisateur</th>
                        <th>Action</th>
                        <th>Date de l'événement</th>
                        <th>Détails</th>
                    </tr>
                    </thead>
                    <tbody>
                    {audits.map((audit) => (
                        <tr key={audit.id}>
                            <td>{audit.id}</td>
                            <td>{audit.username}</td>
                            <td>{audit.action}</td>
                            <td>{new Date(audit.eventDate).toLocaleString()}</td>
                            <td>{audit.details}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun événement d'audit trouvé.</p>
            )}
        </div>
    );
};

export default AuditPage;