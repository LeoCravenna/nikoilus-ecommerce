import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../firebase/firebase';

//Crear el contexto de autenticación
const AuthContext = createContext();

/*
 * Proveedor del contexto de autenticación.
 * Escucha cambios en Firebase Auth y obtiene el rol del usuario desde Firestore.
*/
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //Usuario autenticado (Firebase Auth)
  const [rol, setRol] = useState(null); //Rol del usuario (de Firestore)
  const [loading, setLoading] = useState(true); //Estado de carga (mientras se verifica)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const q = query(collection(db, 'usuarios'), where('email', '==', currentUser.email));

          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            setRol(data.rol || null); //Extrae rol si existe
          } else {
            setRol(null); //Usuario no tiene rol asignado en Firestore
          }
        } catch (error) {
          console.error('Error al obtener rol del usuario:', error);
          setRol(null);
        }
      } else {
        setUser(null);
        setRol(null);
      }
      setLoading(false);
    });

    //Limpiar listener cuando se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, rol, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

//Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => useContext(AuthContext);