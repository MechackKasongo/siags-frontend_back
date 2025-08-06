// src/pages/Departments/DepartmentForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentService from '../../services/department.service';

const DepartmentForm = () => {
    const [departmentName, setDepartmentName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await DepartmentService.createDepartment({ name: departmentName });
            setMessage('Département ajouté avec succès !');
            setTimeout(() => {
                navigate('/departments');
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la création du département:', err.response || err);
            setMessage('Échec de la création du département.');
            setLoading(false);
        }
    };

    return (
        <div className="department-form-container">
            <h2>Ajouter un Nouveau Département</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="departmentName">Nom du Département :</label>
                    <input
                        type="text"
                        id="departmentName"
                        name="departmentName"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Ajout en cours...' : 'Ajouter le Département'}
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

export default DepartmentForm;