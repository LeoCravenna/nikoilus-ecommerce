import React from 'react';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import ProductList from '../components/ProductList';
import loading from '../assets/loading.gif';
import '../components/static/staticStyle.css';
import '../components/styleHome.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ productos, cargando }) => {
  const navigate = useNavigate();
  const topProductos = productos.slice(0, 6);

  return (
    <div className="layout-container">
      <Header />
      <main className="main-content home-content">
        <section className="aboutus-hero">
          <div className="aboutus-overlay">
            <h1>Bienvenidos a Nikoilus</h1>
            <p className="aboutus-subtitle">
              Cuadros con estilo que inspiran tus espacios
            </p>
          </div>
        </section>

        {/* PRODUCTOS DESTACADOS */}
        {cargando ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={loading} alt="loading" />
          </div>
        ) : (
          <>
            <ProductList productos={topProductos} titulo="Los más destacados" />

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                className="ver-mas-btn animate-fade-in"
                onClick={() => {
                  navigate('/products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Ver todos los productos <i className="fa-solid fa-arrow-right-long" style={{ marginLeft: '8px' }}></i>
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
