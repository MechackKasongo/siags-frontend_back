//import axios from 'axios';
import api from './http-common.js';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/reports/';

class ReportService {
    // Récupère le nombre total de patients
    getTotalPatientsCount() {
        return api.get(API_URL + 'patients/count', { headers: authHeader() });
    }

    // Récupère la répartition des patients par sexe
    getPatientGenderDistribution() {
        return api.get(API_URL + 'patients/gender-distribution', { headers: authHeader() });
    }

    // Récupère le nombre total d'admissions
    getTotalAdmissionsCount() {
        return api.get(API_URL + 'admissions/count', { headers: authHeader() });
    }

    // Récupère le nombre d'admissions par département
    getAdmissionCountByDepartment() {
        return api.get(API_URL + 'admissions/count-by-department', { headers: authHeader() });
    }

    // Vous pouvez ajouter d'autres méthodes pour les autres rapports ici
    // getAdmissionCountByMonth(year) { ... }
    // getConsultationCountByDoctor() { ... }
}

export default new ReportService();