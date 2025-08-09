import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DepartmentService from '../../services/department.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';

const DepartmentEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    // Fonction pour l'appel API initial, elle sera passée à ApiStateHandler
    const fetchDepartmentById = async () => {
        const response = await DepartmentService.getDepartmentById(id);
        return response.data;
    };

    const handleUpdate = async (e, departmentData) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', type: '' });

        try {
            await DepartmentService.updateDepartment(id, departmentData);
            setStatus({ loading: false, message: 'Département mis à jour avec succès !', type: 'success' });
            setTimeout(() => {
                navigate('/departments');
            }, 2000);
        } catch (err) {
            console.error("Erreur lors de la mise à jour du département", err);
            setStatus({ loading: false, message: 'Échec de la mise à jour du département.', type: 'error' });
        }
    };

    // Le rendu du formulaire, qui est passé à ApiStateHandler
    const renderForm = (initialData) => {
        const [departmentData, setDepartmentData] = useState(initialData);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setDepartmentData(prevData => ({
                ...prevData,
                [name]: value
            }));
        };

        return (
            <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Modifier le Département</h2>
                {status.message && (
                    <p className={`text-center mb-4 p-3 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {status.message}
                    </p>
                )}
                <form onSubmit={(e) => handleUpdate(e, departmentData)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du Département</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={departmentData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Assuming description is a new field from the previous version */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={departmentData.description || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                        disabled={status.loading}
                    >
                        {status.loading ? 'Mise à jour en cours...' : 'Mettre à jour le Département'}
                    </button>
                </form>
            </div>
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="container mx-auto">
                <ApiStateHandler
                    apiCall={fetchDepartmentById}
                    renderSuccess={renderForm}
                    loadingMessage="Chargement des données du département..."
                />
            </div>
        </div>
    );
};

export default DepartmentEditForm;
