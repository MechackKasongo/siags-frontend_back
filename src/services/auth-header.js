// src/services/auth-header.js

export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    // CRITICAL FIX: Check for the 'token' property.
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
}