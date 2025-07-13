import React, { useState, useEffect } from 'react';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import '../components/styleContact.css';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    mensaje: ''
  });

  const [errors, setErrors] = useState({});
  const [enviado, setEnviado] = useState(false);

  // Validaciones individuales en tiempo real
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es obligatorio';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(value.trim()))
          return 'Solo se permiten letras y espacios';
        return '';
      case 'telefono':
        if (!value.trim()) return 'El teléfono es obligatorio';
        if (!/^\d{8,15}$/.test(value.trim()))
          return 'Debe contener al menos 8 dígitos numéricos';
        return '';
      case 'email':
        if (!value.trim()) return 'El correo es obligatorio';
        if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(value))
          return 'Formato de correo inválido';
        return '';
      case 'mensaje':
        return value.trim() ? '' : 'Por favor, escribí tu mensaje';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualiza el estado del formulario
    setFormData(prev => ({ ...prev, [name]: value }));

    // Valida en tiempo real el campo modificado
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    for (let key in formData) {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    setTimeout(() => {
      toast.success('Mensaje enviado con éxito 🎉');
      setEnviado(true);

      setTimeout(() => {
        setFormData({
          nombre: '',
          telefono: '',
          email: '',
          mensaje: ''
        });
        setErrors({});
        setEnviado(false);
      }, 2000);
    }, 800);
  };

  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <section className="aboutus-hero">
          <div className="aboutus-overlay">
            <h1>Contactanos</h1>
          </div>
        </section>
        <div className="contact-container">
          <h2>¿Querés contactarte con Nikoilus?</h2>
          <p className="intro">
            Estamos acá para ayudarte. Si tenés dudas, sugerencias o simplemente querés saludarnos, completá el formulario y nos pondremos en contacto lo antes posible.
          </p>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <label>
              Nombre completo:
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'input-error' : ''}
              />
              {errors.nombre && <span className="error-text">{errors.nombre}</span>}
            </label>

            <label>
              Teléfono:
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={errors.telefono ? 'input-error' : ''}
              />
              {errors.telefono && <span className="error-text">{errors.telefono}</span>}
            </label>

            <label>
              Correo electrónico:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </label>

            <label>
              Mensaje:
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                className={errors.mensaje ? 'input-error' : ''}
                rows="5"
              />
              {errors.mensaje && <span className="error-text">{errors.mensaje}</span>}
            </label>

            <button type="submit" disabled={enviado}>
              {enviado ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
