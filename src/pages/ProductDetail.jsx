import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../components/styleProductDetail.css';
import { useCart } from '../context/CartContext';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';

const ProductDetail = ({ productos }) => {
  const { cart, addToCart } = useCart();
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const [hover, setHover] = useState(false);

  if (!productos || productos.length === 0) {
    return <p style={{ textAlign: 'center' }}>Cargando producto...</p>;
  }

  const product = productos.find((p) => p.id === id);
  const cantidadEnCarrito = cart.find(p => p.id === product.id)?.cantidad || 0;

  if (!product) {
    return (
      <>
        <Header />
        <div className='product-detail-container'>
          <h2>Producto no encontrado</h2>
          <Link to="/" className="back-button">Volver al inicio</Link>
        </div>
        <Footer />
      </>
    );
  }

  const increase = () =>
    setCantidad(prev => (prev < product.stock ? prev + 1 : prev));

  const decrease = () =>
    setCantidad(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      <Header />
        <main className="main-content">
          <div className="product-detail-container">
            <h1>{product.title}</h1>

            <div className="product-detail-content">
              <div
                className="carousel-container"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => setHover(true)} // para mobile
              >
                {hover ? (
                  <Carousel showThumbs={false} infiniteLoop autoPlay>
                    <div>
                      <img src={product.pictureUrl2} alt={product.title} className='image' />
                    </div>
                    <div>
                      <img src={product.pictureUrl} alt={`${product.title} 2`} className='image' />
                    </div>
                  </Carousel>
                ) : (
                  <img src={product.pictureUrl2} alt={product.title} className='image' />
                )}
              </div>

              <div className="product-info">
                <p><strong>Categoría:</strong> {product.category}</p>
                <p><strong>Descripción:</strong> {product.description}</p>
                <p><strong>Precio:</strong> ${product.price}</p>
                <p><strong>Stock:</strong> {product.stock}</p>

                <div className="cantidadContainer">
                  <button
                    className="qtyButton buttonDecrecer"
                    onClick={decrease}
                    disabled={cantidad <= 1}
                  >-</button>

                  <span>{cantidad}</span>

                  <button
                    className="qtyButton buttonIncrementar"
                    onClick={increase}
                    disabled={cantidad + cantidadEnCarrito >= product.stock}
                  >+</button>
                </div>

                <div className="btn-agregar-wrapper">
                  <button
                    className={`btn-agregar ${cantidad + cantidadEnCarrito > product.stock ? 'btn-stock-maximo' : ''}`}
                    onClick={() => {
                      addToCart({ ...product, cantidad });
                      setCantidad(1);
                    }}
                    disabled={product.stock === 0 || cantidad + cantidadEnCarrito > product.stock}
                  >
                    {product.stock === 0
                      ? 'Sin stock'
                      : cantidad + cantidadEnCarrito > product.stock
                      ? <>
                          <i className="fas fa-exclamation-triangle" style={{ marginRight: '6px' }}></i>
                          Stock máximo
                        </>
                      : 'Agregar al carrito'}
                  </button>

                  {cantidad + cantidadEnCarrito > product.stock && (
                    <p className="stock-alert">
                      No podés agregar más unidades de este producto.
                    </p>
                  )}
                </div>

                <Link to="/products" className="back-button">← Volver a galería</Link>
              </div>
            </div>
          </div>
        </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
