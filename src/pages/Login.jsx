import React, { useState, useEffect, use  } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import db from '../firebase/firebase';
import '../components/styleLogin.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modoRegistro) {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Agregar usuario a la colección 'usuarios' en Firestore con rol cliente
        await addDoc(collection(db, 'usuarios'), {
          email: user.email,
          rol: 'cliente'
        });

        toast.success('Cuenta creada exitosamente. Redirigiendo...');
        navigate('/');
        return;
      }

      // Iniciar sesión
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Obtener rol desde Firestore
      const q = query(collection(db, 'usuarios'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const rol = userData.rol;

        toast.success('Inicio de sesión exitoso');

        if (rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error('No se encontró información del usuario en Firestore');
      }

    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="login-background">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        {modoRegistro && (
          <select disabled className="input-style">
            <option value="cliente">👤 Cliente</option>
          </select>
        )}

        <button type="submit">
          {modoRegistro ? 'Registrarme' : 'Ingresar'}
        </button>

        <button
          type="button"
          className="toggle-mode"
          onClick={() => setModoRegistro(!modoRegistro)}
        >
          {modoRegistro ? 'Ya tengo una cuenta' : 'Crear una cuenta nueva'}
        </button>

        <a href="/" className="volver-inicio">⬅️ Volver al inicio</a>
      </form>
    </div>
  );
};

export default Login;

/* const Login = ({ isAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoRegistro) {
        await createUserWithEmailAndPassword(auth, email, pass);
        toast.success('Cuenta creada correctamente. Ingresando...');
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
        toast.success('Ingreso exitoso');
      }
      navigate('/admin');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-background">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        <button type="submit">
          {modoRegistro ? 'Registrarme' : 'Ingresar'}
        </button>

        <button
          type="button"
          className="toggle-mode"
          onClick={() => setModoRegistro(!modoRegistro)}
        >
          {modoRegistro ? 'Ya tengo una cuenta' : 'Crear una cuenta nueva'}
        </button>

        <a href="/" className="volver-inicio">⬅️ Volver al inicio</a>
      </form>
    </div>
  );
};

export default Login; */
