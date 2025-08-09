//import axios from 'axios';
import api from './http-common.js';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/';

class AuditService {
    getAuditEvents() {
        // Cet endpoint est protégé et nécessite un rôle ADMIN
        return api.get(API_URL + 'audit-logs', { headers: authHeader() });
    }
    // getAuditEventById(id) {
    //     // Récupère un événement d'audit spécifique par son ID
    //     return api.get(API_URL + `audit-logs/${id}`, { headers: authHeader() });
    // }
    // createAuditEvent(auditData) {
    //     // Crée un nouvel événement d'audit
    //     return api.post(API_URL + 'audit-logs', auditData, { headers: authHeader() });
    // }
    // updateAuditEvent(id, auditData) {
    //     // Met à jour un événement d'audit existant
    //     return api.put(API_URL + `audit-logs/${id}`, auditData, { headers: authHeader() });
    // }
    // deleteAuditEvent(id) {
    //     // Supprime un événement d'audit par son ID
    //     return api.delete(API_URL + `audit-logs/${id}`, { headers: authHeader() });
    // }
    // getAuditEventsByUser(userId) {
    //     // Récupère les événements d'audit pour un utilisateur spécifique
    //     return api.get(API_URL + `audit-logs/user/${userId}`, { headers: authHeader() });
    // }
    // getAuditEventsByType(eventType) {
    //     // Récupère les événements d'audit par type d'événement
    //     return api.get(API_URL + `audit-logs/type/${eventType}`, { headers: authHeader() });
    // }
    // getAuditEventsByDateRange(startDate, endDate) {
    //     // Récupère les événements d'audit dans une plage de dates spécifique
    //     return api.get(API_URL + `audit-logs/date-range`, {
    //         headers: authHeader(),
    //         params: { startDate, endDate }
    //     });
    // }
    // getAuditEventsByAction(action) {
    //     // Récupère les événements d'audit par action spécifique
    //     return api.get(API_URL + `audit-logs/action/${action}`, { headers: authHeader() });
    // }
    // getAuditEventsByEntity(entity) {
    //     // Récupère les événements d'audit par entité spécifique
    //     return api.get(API_URL + `audit-logs/entity/${entity}`, { headers: authHeader() });
    // }
    // getAuditEventsBySeverity(severity) {
    //     // Récupère les événements d'audit par niveau de gravité
    //     return api.get(API_URL + `audit-logs/severity/${severity}`, { headers: authHeader() });
    // }
    // getAuditEventsByStatus(status) {
    //     // Récupère les événements d'audit par statut
    //     return api.get(API_URL + `audit-logs/status/${status}`, { headers: authHeader() });
    // }
    // getAuditEventsByIpAddress(ipAddress) {
    //     // Récupère les événements d'audit par adresse IP
    //     return api.get(API_URL + `audit-logs/ip/${ipAddress}`, { headers: authHeader() });
    // }

}

export default new AuditService();