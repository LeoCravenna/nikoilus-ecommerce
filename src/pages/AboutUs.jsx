import React from 'react';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import '../components/styleAboutUs.css';

const AboutUs = () => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content aboutus-container">
        <section className="aboutus-hero">
          <div className="aboutus-overlay">
            <h1>Sobre nosotros</h1>
          </div>
        </section>

        <section className="aboutus-content">
          <h2>Nuestra historia</h2>
          <p>
            Nikoilus nace del deseo de fusionar pasión, diseño y arte en piezas únicas que hablen por sí solas. Amamos el poder que tiene un cuadro para cambiar por completo un ambiente y transmitir emociones. Por eso cuidamos cada detalle, desde la selección de materiales hasta la experiencia de compra.
          </p>

          <h2>Nuestra propuesta</h2>
          <p>
            Descubrí una colección única de cuadros pensados para transformar tus espacios. En Nikoilus combinamos arte, estilo y calidad para ofrecerte obras que inspiran y dan vida a cada rincón. Ya sea que busques un toque moderno, clásico o abstracto, tenemos el cuadro ideal para vos. ¡Explorá, inspirate y encontrá esa pieza especial que habla de vos!
          </p>

          <h2>¿Por qué elegirnos?</h2>
          <ul>
            <li>🎨 Diseños exclusivos y con personalidad</li>
            <li>🖼️ Materiales de alta calidad</li>
            <li>🚚 Envíos a todo el país</li>
            <li>🛒 Compra online simple y segura</li>
            <li>💬 Atención personalizada</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
