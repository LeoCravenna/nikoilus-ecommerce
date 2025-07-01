import React from 'react'
import Header from '../components/static/Header'
import Footer from '../components/static/Footer'
import { Link } from 'react-router-dom'
import '../components/styleNotFound.css'

const NotFound = () => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content notfound-container">
        <h1 className="notfound-title">404 - Obra no encontrada</h1>
        <p className="notfound-message">
          Parece que este cuadro no está en nuestra galería. Tal vez fue vendido, movido o simplemente nunca existió.
        </p>
        <div className="notfound-frame">
          🖼️
        </div>
        <Link to="/" className="notfound-button">Volver al inicio</Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound
