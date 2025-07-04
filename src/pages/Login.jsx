import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebase/firebase';
import db from '../firebase/firebase';
import '../components/styleLogin.css';

import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, rol } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && rol) {
      rol === 'admin' ? navigate('/admin') : navigate('/');
    }
  }, [user, rol, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!pass.trim()) {
      newErrors.pass = 'La contraseña es obligatoria';
    } else if (pass.length < 6) {
      newErrors.pass = 'Debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
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
        //return;
      } else {
        // Iniciar sesión
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Obtener rol desde Firestore
        const q = query(collection(db, 'usuarios'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const rol = querySnapshot.docs[0].data().rol;

          toast.success('Inicio de sesión exitoso');

          rol === 'admin' ? navigate('/admin') : navigate('/');
        } else {
          toast.error('No se encontró información del usuario en Firestore');
        }
      }    
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <form
        onSubmit={handleSubmit}
        className={`login-form ${modoRegistro ? 'register-mode' : 'login-mode'}`}
      >
        <h2>
          {modoRegistro ? '👤 Crear cuenta' : '🔐 Iniciar sesión'}
        </h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) validate();
          }}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="form-error">{errors.email}</span>}

        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              if (errors.pass) validate();
            }}
            className={errors.pass ? 'input-error' : ''}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.pass && <span className="form-error">{errors.pass}</span>}

        {modoRegistro && (
          <select className="input-style" disabled>
            <option value="cliente">Cliente</option>
          </select>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : modoRegistro ? 'Registrarme' : 'Ingresar'}
        </button>

        <button
          type="button"
          className="toggle-mode alt-color"
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