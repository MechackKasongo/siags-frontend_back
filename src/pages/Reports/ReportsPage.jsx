import React from 'react';
import ReportService from '../../services/report.service';
import ApiStateHandler from '../../components/ApiStateHandler.jsx';

const ReportsPage = () => {

    /**
     * @description Fetches all report data concurrently and returns a single object.
     * @returns {Promise<object>} A promise that resolves to an object containing all report data.
     */
    const fetchReports = async () => {
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

        return {
            totalPatients: totalPatientsRes.data,
            patientGenderDistribution: genderDistRes.data,
            totalAdmissions: totalAdmissionsRes.data,
            admissionsByDepartment: admissionsByDeptRes.data,
        };
    };

    /**
     * @description Renders the report content once the data is successfully loaded.
     * @param {object} data The report data returned from the API call.
     * @param {number} data.totalPatients The total number of patients.
     * @param {Array<object>} data.patientGenderDistribution Distribution of patients by gender.
     * @param {number} data.totalAdmissions The total number of admissions.
     * @param {Array<object>} data.admissionsByDepartment Admissions count by department.
     * @returns {JSX.Element} The JSX for the report page.
     */
    const renderReports = ({ totalPatients, patientGenderDistribution, totalAdmissions, admissionsByDepartment }) => {
        return (
            <div className="p-8 bg-gray-50 min-h-screen font-sans">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Statistiques et Rapports</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Report Card: Patients */}
                        <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-indigo-500">
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Patients</h3>
                            <p className="text-lg text-gray-600 mb-2">Nombre total de patients : <strong className="text-indigo-600">{totalPatients}</strong></p>
                            <h4 className="text-md font-medium text-gray-500 mt-4">Répartition par sexe :</h4>
                            <ul className="list-disc list-inside mt-2 text-gray-600">
                                {patientGenderDistribution.map((item, index) => (
                                    <li key={index}>
                                        <span className="font-semibold">{item.gender}</span> : {item.patientCount}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Report Card: Admissions */}
                        <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-indigo-500">
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Admissions</h3>
                            <p className="text-lg text-gray-600 mb-2">Nombre total d'admissions : <strong className="text-indigo-600">{totalAdmissions}</strong></p>
                            <h4 className="text-md font-medium text-gray-500 mt-4">Admissions par département :</h4>
                            <ul className="list-disc list-inside mt-2 text-gray-600">
                                {admissionsByDepartment.map((item, index) => (
                                    <li key={index}>
                                        <span className="font-semibold">{item.departmentName}</span> : {item.admissionCount}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <ApiStateHandler
            apiCall={fetchReports}
            renderSuccess={renderReports}
            loadingMessage="Chargement des statistiques..."
            errorMessage="Impossible de charger les rapports."
        />
    );
};

export default ReportsPage;
