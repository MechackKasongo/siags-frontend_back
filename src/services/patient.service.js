// src/services/patients.service.js
import api from './http-common.js'; // C'est l'instance d'Axios avec l'intercepteur

// Note: Plus besoin d'importer 'authHeader', ni 'axios' ni 'API_URL' si vous utilisez baseURL
// const API_URL = 'http://localhost:8080/api/';

class PatientService {
    // Nouvelle méthode pour gérer la pagination et la recherche
    getPatients(page = 0, size = 10, searchTerm = '') {
        // L'intercepteur gère l'en-tête, donc il suffit de passer les paramètres
        return api.get('patients', {
            params: { page, size, search: searchTerm }
        });
    }

    createPatient(patientData) {
        // L'intercepteur gère l'en-tête, il suffit d'envoyer les données
        return api.post('patients', patientData);
    }

    getPatientById(id) {
        return api.get(`patients/${id}`);
    }

    updatePatient(id, patientData) {
        return api.put(`patients/${id}`, patientData);
    }

    deletePatient(id) {
        return api.delete(`patients/${id}`);
    }
}

export default new PatientService();