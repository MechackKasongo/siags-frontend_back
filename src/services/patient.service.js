import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/patients/';

class PatientService {
    // Récupérer tous les patients
    getAllPatients() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    // Récupérer un patient par ID
    getPatientById(id) {
        return axios.get(API_URL + id, { headers: authHeader() });
    }

    // Créer un nouveau patient
    createPatient(patientData) {
        return axios.post(API_URL, patientData, { headers: authHeader() });
    }

    // Mettre à jour un patient existant
    updatePatient(id, patientData) {
        return axios.put(API_URL + id, patientData, { headers: authHeader() });
    }

    // Supprimer un patient
    deletePatient(id) {
        return axios.delete(API_URL + id, { headers: authHeader() });
    }

    // Méthode de recherche par nom/prénom (si vous en avez une dans le backend)
    // Assurez-vous d'avoir un endpoint correspondant dans votre PatientController
    // findPatientsByName(name) {
    //     return axios.get(API_URL + 'search?name=' + name, { headers: authHeader() });
    // }
}

export default new PatientService();