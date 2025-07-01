import React from 'react';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import ProductList from '../components/ProductList';
import loading from '../assets/loading.gif';
import '../components/static/staticStyle.css';

const Home = ({ productos, cargando }) => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ textAlign: 'center' }}>Bienvenidos a Nikoilus</h1>

          <div style={{ width: '70%', padding: '0 16px', textAlign: 'center', border: '2px solid darkblue', borderRadius: '15px' }}>
            <p>
              Descubrí una colección única de cuadros pensados para transformar tus espacios. En Nikoilus combinamos arte, estilo y calidad para ofrecerte obras que inspiran y dan vida a cada rincón. Ya sea que busques un toque moderno, clásico o abstracto, tenemos el cuadro ideal para vos. ¡Explorá, inspirate y encontrá esa pieza especial que habla de vos!
            </p>
          </div>
        </div>

        {cargando ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={loading} alt='loading' />
          </div>
        ) : (
          <ProductList productos={productos} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
