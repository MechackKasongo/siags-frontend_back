import api from './http-common';

class AdmissionService {
    getAdmissions() {
        return api.get('admissions'); // CORRECTED: Removed headers: authHeader() and API_URL
    }

    getAdmissionById(id) {
        return api.get(`admissions/${id}`); // CORRECTED
    }
    createAdmission(admissionData) {
        return api.post('admissions', admissionData); // CORRECTED
    }

    updateAdmission(id, admissionData) {
        return api.put(`admissions/${id}`, admissionData); // CORRECTED
    }

    deleteAdmission(id) {
        return api.delete(`admissions/${id}`); // CORRECTED
    }
}

export default new AdmissionService();