import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentService from '../../services/department.service';

const DepartmentForm = () => {
    const [departmentData, setDepartmentData] = useState({ name: '' });
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartmentData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', type: '' });

        try {
            await DepartmentService.createDepartment(departmentData);
            setStatus({ loading: false, message: 'Département ajouté avec succès !', type: 'success' });
            setTimeout(() => {
                navigate('/departments');
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la création du département:', err.response || err);
            setStatus({ loading: false, message: 'Échec de la création du département.', type: 'error' });
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Ajouter un Nouveau Département</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du Département</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={departmentData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {status.loading ? 'Ajout en cours...' : 'Ajouter le Département'}
                    </button>
                    {status.message && (
                        <div className={`form-message text-center p-3 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default DepartmentForm;
