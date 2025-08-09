import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuditService from '../../services/audit.service';
import AuthService from '../../services/auth.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';

const AuditPage = () => {
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser && currentUser.roles.includes('ROLE_ADMIN');
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    const fetchAudits = async () => {
        const response = await AuditService.getAuditEvents();
        return response.data;
    };

    const renderAuditsTable = (audits) => {
        return (
            <>
                {statusMessage.message && (
                    <div className={`p-4 mb-4 rounded-lg text-white ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {statusMessage.message}
                    </div>
                )}
                <div className="audits-header flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Journaux d'Audit</h2>
                </div>
                {audits.length > 0 ? (
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Nom d'utilisateur</th>
                            <th className="py-3 px-6 text-left">Action</th>
                            <th className="py-3 px-6 text-left">Date de l'événement</th>
                            <th className="py-3 px-6 text-left">Détails</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                        {audits.map((audit) => (
                            <tr key={audit.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{audit.id}</td>
                                <td className="py-3 px-6 text-left">{audit.username}</td>
                                <td className="py-3 px-6 text-left">{audit.action}</td>
                                <td className="py-3 px-6 text-left">{new Date(audit.eventDate).toLocaleString()}</td>
                                <td className="py-3 px-6 text-left">{audit.details}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center text-lg mt-8">Aucun événement d'audit trouvé.</p>
                )}
            </>
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="container mx-auto">
                <ApiStateHandler
                    apiCall={fetchAudits}
                    renderSuccess={renderAuditsTable}
                    loadingMessage="Chargement des journaux d'audit..."
                />
            </div>
        </div>
    );
};

export default AuditPage;
