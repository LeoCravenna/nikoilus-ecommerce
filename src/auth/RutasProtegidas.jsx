import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const RutasProtegida = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: cargando

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // true si hay usuario
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <p>Cargando autenticación...</p>; // mientras se valida
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutasProtegida;