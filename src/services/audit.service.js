//import axios from 'axios';
import api from './http-common.js';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/';

class AuditService {
    getAuditEvents() {
        // Cet endpoint est protégé et nécessite un rôle ADMIN
        return api.get(API_URL + 'audits', { headers: authHeader() });
    }

    // Vous pourriez ajouter d'autres méthodes pour filtrer ou rechercher les audits si votre API le permet
}

export default new AuditService();