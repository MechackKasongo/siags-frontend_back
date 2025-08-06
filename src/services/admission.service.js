//mport axios from 'axios';

import api from './http-common';
import authHeader from './auth-header'; // Réutilise le même en-tête d'autorisation

const API_URL = 'http://localhost:8080/api/';

class AdmissionService {
    getAdmissions() {
        // Récupère toutes les admissions
        return api.get(API_URL + 'admissions', { headers: authHeader() });
    }

    getAdmissionById(id) {
        // Récupère une admission par son ID
        return api.get(API_URL + `admissions/${id}`, { headers: authHeader() });
    }
    createAdmission(admissionData) {
        return api.post(API_URL + 'admissions', admissionData, { headers: authHeader() });
    }

    updateAdmission(id, admissionData) {
        return api.put(API_URL + `admissions/${id}`, admissionData, { headers: authHeader() });
    }

    deleteAdmission(id) {
        return api.delete(API_URL + `admissions/${id}`, { headers: authHeader() });
    }

}

export default new AdmissionService();