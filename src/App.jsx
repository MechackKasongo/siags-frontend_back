// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'; // Ajoute useNavigate
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard.jsx';
// NOUVEAU : Importe ProtectedRoute
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Assure-toi de l'extension .jsx

import { AuthProvider, useAuth } from './context/AuthContext.jsx';


const Navbar = () => {
    const { currentUser, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-sendwe-blue p-4 text-white flex justify-between items-center shadow-md"> {/* Utilisation de sendwe-blue */}
            <Link to="/" className="text-xl font-bold text-white">SIAGS App</Link> {/* Assure-toi que le texte est blanc */}
            <div>
                {currentUser ? (
                    <>
                        <Link to="/profile" className="mr-4 hover:text-sendwe-gray">Profil</Link> {/* Hover sur un gris plus clair */}
                        {hasRole("ROLE_ADMIN") && (
                            <Link to="/admin/dashboard" className="mr-4 hover:text-sendwe-gray">Admin Dashboard</Link>
                        )}
                        <button onClick={handleLogout} className="bg-sendwe-red px-3 py-1 rounded hover:bg-red-700 text-white">Déconnexion</button> {/* Bouton de déconnexion en sendwe-red */}
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-4 hover:text-sendwe-gray">Connexion</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Navbar />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />

                        {/* Route protégée pour le profil de l'utilisateur (nécessite d'être connecté) */}
                        <Route element={<ProtectedRoute />}> {/* Aucun rôle/permission spécifié, juste être connecté */}
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        {/* Route protégée pour le tableau de bord administrateur (nécessite ROLE_ADMIN) */}
                        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        </Route>

                        {/* Tu ajouteras d'autres routes protégées ici avec des rôles/permissions spécifiques */}
                        {/* Exemple pour un réceptionniste: */}
                        {/* <Route element={<ProtectedRoute allowedRoles={["ROLE_RECEPTIONIST"]} />}>
                            <Route path="/patients" element={<PatientsList />} />
                        </Route> */}

                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;