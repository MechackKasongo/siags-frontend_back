//import axios from 'axios';
import api from './http-common.js';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/';

class DepartmentService {
    getDepartments() {
        return api.get(API_URL + 'departments', { headers: authHeader() });
    }

    getDepartmentById(id) {
        return api.get(API_URL + `departments/${id}`, { headers: authHeader() });
    }

    createDepartment(departmentData) {
        return api.post(API_URL + 'departments', departmentData, { headers: authHeader() });
    }

    // Nouvelle méthode pour mettre à jour un département
    updateDepartment(id, departmentData) {
        return api.put(API_URL + `departments/${id}`, departmentData, { headers: authHeader() });
    }

    // Nouvelle méthode pour supprimer un département
    deleteDepartment(id) {
        return api.delete(API_URL + `departments/${id}`, { headers: authHeader() });
    }
}

export default new DepartmentService();