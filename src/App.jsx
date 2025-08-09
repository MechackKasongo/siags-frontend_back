import React, { useState, useEffect } from 'react'; // Importez useState et useEffect
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'; // Importez useNavigate
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AuthService from './services/auth.service';
import { ToastContainer, toast } from 'react-toastify'; // Importez toast
import 'react-toastify/dist/ReactToastify.css';

// Composants de l'application
import PatientsList from './pages/Patients/PatientsList';
import AdmissionsList from './pages/Admissions/AdmissionsList';
import AdmissionForm from './pages/Admissions/AdmissionForm';
import PatientDetails from './pages/Patients/PatientDetails';
import DepartmentsList from './pages/Departments/DepartmentsList';
import ConsultationsList from './pages/Consultations/ConsultationsList';
import ConsultationForm from './pages/Consultations/ConsultationForm'; // AJOUT : Import du composant de formulaire de création
import ReportsPage from './pages/Reports/ReportsPage';
import AuditPage from './pages/Audits/AuditPage';
import PatientEditForm from './pages/Patients/PatientEditForm';
import AdmissionEditForm from './pages/Admissions/AdmissionEditForm';
import ConsultationEditForm from './pages/Consultations/ConsultationEditForm';
import UserEditForm from './pages/Users/UserEditForm';
import UsersList from './pages/Users/UsersList';
import DepartmentForm from './pages/Departments/DepartmentForm';
import DepartmentEditForm from './pages/Departments/DepartmentEditForm';
import UserProfile from './pages/UserProfile';
import PatientForm from './pages/Patients/PatientForm';
import UserCreateForm from './pages/Users/UserCreateForm';

// Import des icônes pour la navigation
import {
    FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaProcedures,
    FaBed, FaHospital, FaNotesMedical, FaChartBar, FaUserShield, FaFlask
} from 'react-icons/fa';

// Composant pour protéger les routes
const PrivateRoute = ({ children, isAuthenticated }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
    // État pour gérer l'utilisateur courant dans l'application
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        toast.info("Vous avez été déconnecté.");
        navigate('/login');
    };

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
    };

    const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes('ROLE_ADMIN');

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <nav className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to={"/"} className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                        SIAGS
                    </Link>
                    <div className="hidden md:flex items-center space-x-6">
                        {currentUser ? (
                            <>
                                <Link to={"/dashboard"} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                                    <FaTachometerAlt /> <span>Tableau de Bord</span>
                                </Link>
                                <Link to={"/patients"} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                                    <FaUserCircle /> <span>Patients</span>
                                </Link>
                                <Link to={"/admissions"} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                                    <FaBed /> <span>Admissions</span>
                                </Link>
                                <Link to={"/departments"} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                                    <FaHospital /> <span>Départements</span>
                                </Link>
                                <Link to={"/consultations"} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                                    <FaNotesMedical /> <span>Consultations</span>
                                </Link>
                                <Link to={"/reports"} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                                    <FaChartBar /> <span>Rapports</span>
                                </Link>
                                {isAdmin && (
                                    <>
                                        <Link to={"/admin/users"} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                                            <FaUserShield /> <span>Utilisateurs</span>
                                        </Link>
                                        <Link to={"/audits"} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                                            <FaFlask /> <span>Audits</span>
                                        </Link>
                                    </>
                                )}
                            </>
                        ) : (
                            <Link to={"/login"} className="text-gray-600 hover:text-blue-600 transition-colors">
                                Connexion
                            </Link>
                        )}
                    </div>
                    {currentUser && (
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2">
                                <FaUserCircle /> <span>{currentUser.username}</span>
                            </Link>
                            <button onClick={logOut} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="container mx-auto mt-6 px-4">
                <Routes>
                    <Route path="/" element={<p className="text-center text-lg text-gray-600">Bienvenue sur SIAGS</p>} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/dashboard" element={<PrivateRoute isAuthenticated={!!currentUser}><Dashboard /></PrivateRoute>} />
                    <Route path="/patients" element={<PrivateRoute isAuthenticated={!!currentUser}><PatientsList /></PrivateRoute>} />
                    <Route path="/patients/new" element={<PrivateRoute isAuthenticated={!!currentUser}><PatientForm /></PrivateRoute>} />
                    <Route path="/patients/:id" element={<PrivateRoute isAuthenticated={!!currentUser}><PatientDetails /></PrivateRoute>} />
                    <Route path="/patients/edit/:id" element={<PrivateRoute isAuthenticated={!!currentUser}><PatientEditForm /></PrivateRoute>} />
                    <Route path="/admissions" element={<PrivateRoute isAuthenticated={!!currentUser}><AdmissionsList /></PrivateRoute>} />
                    <Route path="/admissions/new" element={<PrivateRoute isAuthenticated={!!currentUser}><AdmissionForm /></PrivateRoute>} />
                    <Route path="/admissions/edit/:id" element={<PrivateRoute isAuthenticated={!!currentUser}><AdmissionEditForm /></PrivateRoute>} />
                    <Route path="/departments" element={<PrivateRoute isAuthenticated={!!currentUser}><DepartmentsList /></PrivateRoute>} />
                    <Route path="/departments/new" element={<PrivateRoute isAuthenticated={!!currentUser}><DepartmentForm /></PrivateRoute>} />
                    <Route path="/departments/edit/:id" element={<PrivateRoute isAuthenticated={!!currentUser}><DepartmentEditForm /></PrivateRoute>} />
                    <Route path="/consultations" element={<PrivateRoute isAuthenticated={!!currentUser}><ConsultationsList /></PrivateRoute>} />
                    <Route path="/consultations/new" element={<PrivateRoute isAuthenticated={!!currentUser}><ConsultationForm /></PrivateRoute>} /> {/* AJOUT : Route pour le formulaire de création de consultation */}
                    <Route path="/consultations/edit/:id" element={<PrivateRoute isAuthenticated={!!currentUser}><ConsultationEditForm /></PrivateRoute>} />
                    <Route path="/reports" element={<PrivateRoute isAuthenticated={!!currentUser}><ReportsPage /></PrivateRoute>} />
                    <Route path="/audits" element={<PrivateRoute isAuthenticated={!!currentUser}><AuditPage /></PrivateRoute>} />
                    <Route path="/admin/users" element={<PrivateRoute isAuthenticated={!!currentUser}><UsersList /></PrivateRoute>} />
                    <Route path="/admin/users/new" element={<PrivateRoute isAuthenticated={!!currentUser}><UserCreateForm /></PrivateRoute>} />
                    <Route path="/admin/users/edit/:id" element={<PrivateRoute isAuthenticated={!!currentUser}><UserEditForm /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute isAuthenticated={!!currentUser}><UserProfile /></PrivateRoute>} />
                    <Route path="*" element={<h1 className="text-center text-3xl font-bold mt-10">404 - Page non trouvée</h1>} />
                </Routes>
            </main>
            <ToastContainer />
        </div>
    );
};

export default App;
