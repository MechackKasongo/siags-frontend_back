import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConsultationService from '../../services/consultation.service';
import PatientService from '../../services/patient.service'; // On en aura besoin pour afficher le patient
import AdmissionService from '../../services/admission.service'; // On en aura besoin pour afficher l'admission

const ConsultationEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [consultationData, setConsultationData] = useState({
        consultationDate: '',
        consultationType: '',
        admissionId: '', // On stocke l'ID de l'admission
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchConsultation = async () => {
            try {
                const response = await ConsultationService.getConsultationById(id);
                const consultation = response.data;

                // Pré-remplir le formulaire avec les données existantes
                setConsultationData({
                    consultationDate: consultation.consultationDate,
                    consultationType: consultation.consultationType,
                    admissionId: consultation.admission.id,
                });

            } catch (err) {
                console.error('Erreur lors du chargement de la consultation:', err);
                setMessage('Impossible de charger les données de la consultation.');
            } finally {
                setLoading(false);
            }
        };
        fetchConsultation();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConsultationData({ ...consultationData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await ConsultationService.updateConsultation(id, consultationData);
            setMessage('Consultation mise à jour avec succès !');
            setTimeout(() => {
                navigate(`/consultations`);
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la consultation:', err.response || err);
            setMessage('Échec de la mise à jour de la consultation.');
            setLoading(false);
        }
    };

    if (loading) return <div>Chargement du formulaire de modification...</div>;
    if (message.includes('Impossible')) return <div className="error-message">{message}</div>;

    return (
        <div className="consultation-form-container">
            <h2>Modifier la Consultation #{id}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="consultationDate">Date de Consultation :</label>
                    <input
                        type="date"
                        id="consultationDate"
                        name="consultationDate"
                        value={consultationData.consultationDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="consultationType">Type de Consultation :</label>
                    <input
                        type="text"
                        id="consultationType"
                        name="consultationType"
                        value={consultationData.consultationType}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* On peut afficher l'admission associée, mais la modifier serait complexe */}
                {/* Pour l'instant, on se contente de l'afficher */}
                <p>Admission associée : **{consultationData.admissionId}**</p>
                <button type="submit" disabled={loading}>
                    {loading ? 'Mise à jour en cours...' : 'Mettre à jour la consultation'}
                </button>
                {message && <div className={`form-message ${message.includes('succès') ? 'success' : 'error'}`}>{message}</div>}
            </form>
        </div>
    );
};

export default ConsultationEditForm;