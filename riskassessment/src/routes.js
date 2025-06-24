import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import History from './components/History';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token && typeof token === 'string' && token.length > 10;
};

const routes = [
  {
    path: '/login',
    element: () => isAuthenticated() ? <Navigate to="/" replace /> : <Login />,
    public: true
  },
  {
    path: '/signup',
    element: () => isAuthenticated() ? <Navigate to="/" replace /> : <Signup />,
    public: true
  },
  {
    path: '/forgot-password',
    element: () => <ForgotPassword />, 
    public: true
  },
  {
    path: '/',
    element: (dashboardProps) => (
      isAuthenticated() ? (
        <div className="flex flex-col min-h-screen">
          <Header />
          <Dashboard {...dashboardProps} />
          <Footer />
        </div>
      ) : (
        <Navigate to="/login" replace />
      )
    ),
    public: false
  },
  {
    path: '/history',
    element: () => (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <Header />
          <History />
          <Footer />
        </div>
      </ProtectedRoute>
    ),
    public: false
  },
  {
    path: '*',
    element: () => <Navigate to="/login" />,
    public: true
  }
];

export default routes;
