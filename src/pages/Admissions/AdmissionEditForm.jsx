import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdmissionService from '../../services/admission.service';
import PatientService from '../../services/patient.service';
import DepartmentService from '../../services/department.service';


const AdmissionEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [admissionData, setAdmissionData] = useState({
        patientId: '',
        departmentId: '',
        reasonForAdmission: '',
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAdmissionAndOptions = async () => {
            try {
                // Charger les données de l'admission et les options
                const admissionRes = await AdmissionService.getAdmissionById(id);
                const patientsRes = await PatientService.getPatients();
                const departmentsRes = await DepartmentService.getDepartments();

                const admission = admissionRes.data;

                setAdmissionData({
                    patientId: admission.patient.id, // On utilise l'ID du patient de l'admission
                    departmentId: admission.assignedDepartment.id, // On utilise l'ID du département
                    reasonForAdmission: admission.reasonForAdmission,
                });

                setPatients(patientsRes.data);
                setDepartments(departmentsRes.data);

            } catch (err) {
                console.error('Erreur lors du chargement des données d\'admission:', err);
                setMessage('Impossible de charger les données de l\'admission.');
            } finally {
                setLoading(false);
            }
        };
        fetchAdmissionAndOptions();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmissionData({ ...admissionData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await AdmissionService.updateAdmission(id, admissionData);
            setMessage('Admission mise à jour avec succès !');
            setTimeout(() => {
                navigate(`/admissions`);
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la mise à jour de l\'admission:', err.response || err);
            setMessage('Échec de la mise à jour de l\'admission.');
            setLoading(false);
        }
    };

    if (loading) return <div className="admission-form-container">Chargement du formulaire de modification...</div>;
    if (message.includes('Impossible')) return <div className="admission-form-container error-message">{message}</div>;

    return (
        <div className="admission-form-container">
            <h2>Modifier l'Admission #{id}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="patientId">Patient :</label>
                    <select id="patientId" name="patientId" value={admissionData.patientId} onChange={handleChange} required>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.nom} {patient.prenom}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="departmentId">Département :</label>
                    <select id="departmentId" name="departmentId" value={admissionData.departmentId} onChange={handleChange} required>
                        {departments.map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="reasonForAdmission">Motif d'admission :</label>
                    <textarea
                        id="reasonForAdmission"
                        name="reasonForAdmission"
                        value={admissionData.reasonForAdmission}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Mise à jour en cours...' : 'Mettre à jour l\'admission'}
                </button>
                {message && <div className={`form-message ${message.includes('succès') ? 'success' : 'error'}`}>{message}</div>}
            </form>
        </div>
    );
};

export default AdmissionEditForm;