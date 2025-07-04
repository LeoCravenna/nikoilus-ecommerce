import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, rol, loading } = useAuth();

  // Mientras se verifica la sesión (por ejemplo al recargar), evitamos renderizar
  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Verificando acceso...</p>;
  }

  // Si no hay usuario o no cumple con el rol requerido (si se pasó uno)
  if (!user || (roleRequired && rol !== roleRequired)) {
    return <Navigate to="/" replace />;
  }

  // Acceso permitido
  return children;
};

export default PrivateRoute;