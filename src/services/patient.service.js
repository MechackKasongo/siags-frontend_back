// src/services/patients.service.js

import api from './http-common.js'; // Use the 'api' instance that has the interceptor.
const API_URL = 'http://localhost:8080/api/v1/';

class PatientService {
    // The interceptor automatically handles the 'Authorization' header, so we just need to provide the endpoint.
    getPatients(page = 0, size = 10, searchTerm = '') {
        return api.get('patients', {
            params: { page, size, search: searchTerm }
        });
    }

    createPatient(patientData) {
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