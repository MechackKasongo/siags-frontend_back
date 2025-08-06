export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.jwt) {
        // Si un utilisateur est connecté et a un jeton JWT, nous renvoyons un en-tête d'autorisation
        // Le nom de l'en-tête et le préfixe 'Bearer ' sont définis par la configuration de votre backend
        return { Authorization: 'Bearer ' + user.jwt };
    } else {
        // Sinon, nous renvoyons un objet vide
        return {};
    }
}