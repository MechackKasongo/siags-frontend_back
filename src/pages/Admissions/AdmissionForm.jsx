import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdmissionService from '../../services/admission.service';
import PatientService from '../../services/patient.service';
import DepartmentService from '../../services/department.service';

const AdmissionForm = () => {
    const [patients, setPatients] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [admissionData, setAdmissionData] = useState({
        patientId: '',
        departmentId: '',
        reasonForAdmission: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSelectOptions = async () => {
            try {
                const patientsResponse = await PatientService.getPatients();
                const departmentsResponse = await DepartmentService.getDepartments();
                setPatients(patientsResponse.data);
                setDepartments(departmentsResponse.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des options du formulaire:', err);
                setMessage('Erreur lors du chargement des patients et départements.');
            } finally {
                setLoading(false);
            }
        };
        fetchSelectOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmissionData({ ...admissionData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await AdmissionService.createAdmission(admissionData);
            setMessage('Admission créée avec succès !');
            setTimeout(() => navigate('/admissions'), 2000);
        } catch (err) {
            console.error('Erreur lors de la création de l\'admission:', err.response || err);
            setMessage('Échec de la création de l\'admission.');
        }
    };

    if (loading) {
        return <div className="admission-form-container">Chargement du formulaire...</div>;
    }

    return (
        <div className="admission-form-container">
            <h2>Créer une Nouvelle Admission</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="patientId">Patient :</label>
                    <select id="patientId" name="patientId" value={admissionData.patientId} onChange={handleChange} required>
                        <option value="">Sélectionner un patient</option>
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
                        <option value="">Sélectionner un département</option>
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
                <button type="submit" className="submit-button">Créer l'admission</button>
                {message && <div className={`form-message ${message.includes('succès') ? 'success' : 'error'}`}>{message}</div>}
            </form>
        </div>
    );
};

export default AdmissionForm;