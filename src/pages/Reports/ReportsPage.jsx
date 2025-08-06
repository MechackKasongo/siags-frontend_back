import React, { useState, useEffect } from 'react';
import ReportService from '../../services/report.service';

const ReportsPage = () => {
    const [totalPatients, setTotalPatients] = useState(0);
    const [patientGenderDistribution, setPatientGenderDistribution] = useState([]);
    const [totalAdmissions, setTotalAdmissions] = useState(0);
    const [admissionsByDepartment, setAdmissionsByDepartment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [
                    totalPatientsRes,
                    genderDistRes,
                    totalAdmissionsRes,
                    admissionsByDeptRes,
                ] = await Promise.all([
                    ReportService.getTotalPatientsCount(),
                    ReportService.getPatientGenderDistribution(),
                    ReportService.getTotalAdmissionsCount(),
                    ReportService.getAdmissionCountByDepartment(),
                ]);

                setTotalPatients(totalPatientsRes.data);
                setPatientGenderDistribution(genderDistRes.data);
                setTotalAdmissions(totalAdmissionsRes.data);
                setAdmissionsByDepartment(admissionsByDeptRes.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des rapports:', err);
                setError('Impossible de charger les rapports.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return <div>Chargement des statistiques...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="reports-container">
            <h2>Statistiques et Rapports</h2>

            <div className="report-card">
                <h3>Patients</h3>
                <p>Nombre total de patients : <strong>{totalPatients}</strong></p>
                <h4>Répartition par sexe :</h4>
                <ul>
                    {patientGenderDistribution.map((item, index) => (
                        <li key={index}>
                            {item.gender} : {item.patientCount}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="report-card">
                <h3>Admissions</h3>
                <p>Nombre total d'admissions : <strong>{totalAdmissions}</strong></p>
                <h4>Admissions par département :</h4>
                <ul>
                    {admissionsByDepartment.map((item, index) => (
                        <li key={index}>
                            {item.departmentName} : {item.admissionCount}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ReportsPage;