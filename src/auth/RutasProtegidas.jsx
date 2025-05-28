import React from 'react';
import { Navigate } from 'react-router-dom';


function RutasProtegida({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
export default RutasProtegida;