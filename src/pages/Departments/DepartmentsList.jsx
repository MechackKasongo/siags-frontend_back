// src/pages/Departments/DepartmentsList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importez useNavigate
import DepartmentService from '../../services/department.service';


const DepartmentsList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchDepartments = async () => {
        try {
            const response = await DepartmentService.getDepartments();
            setDepartments(response.data);
        } catch (err) {
            console.error('Erreur lors de la récupération des départements:', err);
            setError('Impossible de charger la liste des départements.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
            try {
                await DepartmentService.deleteDepartment(id);
                alert('Département supprimé avec succès !');
                fetchDepartments(); // Recharger la liste après suppression
            } catch (err) {
                console.error('Erreur lors de la suppression du département:', err);
                alert('Échec de la suppression du département.');
            }
        }
    };

    if (loading) return <div>Chargement des départements...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="departments-container">
            <div className="departments-header">
                <h2>Liste des Départements</h2>
                <Link to="/departments/new" className="add-button">
                    Ajouter un département
                </Link>
            </div>
            {departments.length > 0 ? (
                <table className="departments-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom du Département</th>
                        <th>Actions</th> {/* Nouvelle colonne */}
                    </tr>
                    </thead>
                    <tbody>
                    {departments.map((department) => (
                        <tr key={department.id}>
                            <td>{department.id}</td>
                            <td>{department.name}</td>
                            <td>
                                <Link to={`/departments/edit/${department.id}`} className="action-button edit">Modifier</Link>
                                <button onClick={() => handleDelete(department.id)} className="action-button delete">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun département trouvé.</p>
            )}
        </div>
    );
};

export default DepartmentsList;