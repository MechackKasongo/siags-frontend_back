import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdmissionService from '../../services/admission.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';

const AdmissionsList = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    const fetchAdmissions = async () => {
        const response = await AdmissionService.getAdmissions();
        return response.data;
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette admission ?')) {
            try {
                await AdmissionService.deleteAdmission(id);
                setStatusMessage({ type: 'success', message: 'Admission supprimée avec succès !' });
                setRefreshKey(prevKey => prevKey + 1);
            } catch (err) {
                console.error('Erreur lors de la suppression de l\'admission:', err);
                setStatusMessage({ type: 'error', message: 'Échec de la suppression de l\'admission.' });
            }
        }
    };

    const renderAdmissionsTable = (admissions) => {
        return (
            <>
                {statusMessage.message && (
                    <div className={`p-4 mb-4 rounded-lg text-white ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {statusMessage.message}
                    </div>
                )}
                <div className="admissions-header flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Liste des Admissions</h2>
                    <Link to="/admissions/new" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Créer une admission
                    </Link>
                </div>
                {admissions.length > 0 ? (
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID Admission</th>
                            <th className="py-3 px-6 text-left">ID Patient</th>
                            <th className="py-3 px-6 text-left">Motif</th>
                            <th className="py-3 px-6 text-left">Département</th>
                            <th className="py-3 px-6 text-left">Statut</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                        {admissions.map((admission) => (
                            <tr key={admission.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{admission.id}</td>
                                <td className="py-3 px-6 text-left">{admission.patient?.id}</td>
                                <td className="py-3 px-6 text-left">{admission.reasonForAdmission}</td>
                                <td className="py-3 px-6 text-left">{admission.assignedDepartment?.name}</td>
                                <td className="py-3 px-6 text-left">{admission.status}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        <Link to={`/admissions/edit/${admission.id}`} className="w-4 mr-2 transform hover:text-indigo-500 hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Link>
                                        <button onClick={() => handleDelete(admission.id)} className="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center text-lg mt-8">Aucune admission trouvée.</p>
                )}
            </>
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="container mx-auto">
                <ApiStateHandler
                    key={refreshKey}
                    apiCall={fetchAdmissions}
                    renderSuccess={renderAdmissionsTable}
                    loadingMessage="Chargement de la liste des admissions..."
                />
            </div>
        </div>
    );
};

export default AdmissionsList;
