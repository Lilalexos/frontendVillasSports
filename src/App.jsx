import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Registerpage from './pages/Registerpage';
import Loginpage from './pages/Loginpage';
import EventosListPage from './pages/EventosListPage';
import EventoFormPage from './pages/EventoFormPage';
import EventoDetailPage from './pages/EventoDetailPage';
import UserEventosPage from './pages/UserEventosPage';
import DashboardPage from './pages/DashboardPage';

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />

        {/* Rutas protegidas */}
        <Route
          path="/mis-eventos"
          element={
            <PrivateRoute>
              <UserEventosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/eventos"
          element={
            <PrivateRoute>
              <EventosListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/eventos/nuevo"
          element={
            <PrivateRoute>
              <EventoFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/eventos/editar/:id"
          element={
            <PrivateRoute>
              <EventoFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/eventos/:id"
          element={
            <PrivateRoute>
              <EventoDetailPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;