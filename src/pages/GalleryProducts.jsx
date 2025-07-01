import React from 'react';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import ProductList from '../components/ProductList';
import loading from '../assets/loading.gif';
import '../components/static/staticStyle.css';

const GalleryProducts = ({ productos, cargando }) => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
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

export default GalleryProducts;
