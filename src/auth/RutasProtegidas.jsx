import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RutasProtegidas = ({ children, roleRequired }) => {
  const { user, rol, loading } = useAuth();

  //Mientras se verifica la sesión (por ejemplo, al recargar la página), evitamos renderizar
  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Verificando acceso...</p>;
  }

  //Si no hay usuario o no cumple con el rol requerido, redirige al inicio
  if (!user || (roleRequired && rol !== roleRequired)) {
    return <Navigate to="/" replace />;
  }

  //Acceso permitido
  return children;
};

export default RutasProtegidas;