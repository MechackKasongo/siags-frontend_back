//import axios from 'axios';
import api from './http-common.js';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/';

class ConsultationService {
    getConsultations() {
        return api.get(API_URL + 'consultations', { headers: authHeader() });
    }

    getConsultationById(id) {
        return api.get(API_URL + `consultations/${id}`, { headers: authHeader() });
    }

    createConsultation(consultationData) {
        return api.post(API_URL + 'consultations', consultationData, { headers: authHeader() });
    }

    updateConsultation(id, consultationData) {
        return api.put(API_URL + `consultations/${id}`, consultationData, { headers: authHeader() });
    }

    deleteConsultation(id) {
        return api.delete(API_URL + `consultations/${id}`, { headers: authHeader() });
    }
}

export default new ConsultationService();