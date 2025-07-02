import React, { useState, useEffect  } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../components/styleLogin.css'

const Login = ({ isAuthenticated }) => {
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

export default Login;
