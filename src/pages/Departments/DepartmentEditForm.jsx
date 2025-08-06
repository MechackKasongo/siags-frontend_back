// src/pages/Departments/DepartmentEditForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DepartmentService from '../../services/department.service';
import { toast } from 'react-toastify';

const DepartmentEditForm = () => {
    // État pour stocker les données du département
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await DepartmentService.getDepartmentById(id);
                setName(response.data.name);
                setDescription(response.data.description);
            } catch (err) {
                console.error("Erreur lors de la récupération du département", err);
                toast.error("Département non trouvé.");
                navigate('/departments'); // Redirige si non trouvé
            }
        };
        fetchDepartment();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!name || !description) {
            setError('Veuillez remplir tous les champs.');
            setLoading(false);
            return;
        }

        const departmentData = { name, description };
        try {
            await DepartmentService.updateDepartment(id, departmentData);
            toast.success('Département mis à jour avec succès !');
            navigate('/departments');
        } catch (err) {
            console.error("Erreur lors de la mise à jour du département", err);
            setError('Échec de la mise à jour du département.');
            toast.error('Échec de la mise à jour.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Modifier le Département</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du Département</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? 'Mise à jour en cours...' : 'Mettre à jour le Département'}
                </button>
            </form>
        </div>
    );
};

export default DepartmentEditForm;