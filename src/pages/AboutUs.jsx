import React from 'react';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';

const AboutUs = () => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <h1 style={{ textAlign: 'center' }}>Acerca de Nikoilus</h1>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
