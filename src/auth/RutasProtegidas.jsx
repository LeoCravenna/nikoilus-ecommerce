import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebase/firebase';
import db from '../firebase/firebase';

const RutasProtegida = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allowAccess, setAllowAccess] = useState(false);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const q = query(collection(db, 'usuarios'), where('email', '==', user.email));
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const rol = snapshot.docs[0].data().rol;
            if (rol === 'admin') {
              setAllowAccess(true);
            }
          }
        }
        setIsLoading(false);
      });
    };

    checkAuthAndRole();
  }, []);

  if (isLoading) return <p>Cargando autenticación...</p>;
  if (!allowAccess) return <Navigate to="/" replace />;

  return children;
};

export default RutasProtegida;