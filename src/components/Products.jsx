import React, { useState } from 'react';
import './styleProducts.css';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { useCart } from '../context/CartContext';

const Products = ({ producto }) => {
  const { cart, addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [hover, setHover] = useState(false);

  const cantidadEnCarrito = cart.find(p => p.id === producto.id)?.cantidad || 0;
  const stockDisponible = producto.stock - cantidadEnCarrito;

  const increase = () =>
    setCantidad(prev => (prev < producto.stock ? prev + 1 : prev));

  const decrease = () =>
    setCantidad(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <section className='card'>
      <div
        className="imageContainer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setHover(true)} // para mobile
      >
        {hover ? (
          <Carousel showThumbs={false} infiniteLoop autoPlay>
            <div>
              <img src={producto.pictureUrl2} alt={producto.title} className='image' />
            </div>
            <div>
              <img src={producto.pictureUrl} alt={`${producto.title} 2`} className='image' />
            </div>
          </Carousel>
        ) : (
          <img src={producto.pictureUrl2} alt={producto.title} className="image" />
        )}
      </div>

      <h3 className='titulo'>{producto.title}</h3>
      <p className='precio'>${producto.price}</p>
      <p className='stock'>Stock: {producto.stock}</p>

      <div className='cantidadContainer'>
        <button
          className='qtyButton buttonDecrecer'
          onClick={decrease}
          disabled={cantidad <= 1}
        >-</button>

        <span>{cantidad}</span>

        <button
          className='qtyButton buttonIncrementar'
          onClick={increase}
          disabled={cantidad >= stockDisponible}
        >+</button>
      </div>

      <div className="btn-agregar-wrapper">
        <button
          className={`btn-agregar ${cantidad + cantidadEnCarrito > producto.stock ? 'btn-stock-maximo' : ''}`}
          onClick={() => {
            addToCart({ ...producto, cantidad });
            setCantidad(1);
          }}
          disabled={producto.stock === 0 || cantidad + cantidadEnCarrito > producto.stock}
        >
          {producto.stock === 0
            ? 'Sin stock'
            : cantidad + cantidadEnCarrito > producto.stock
            ? <>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '6px' }}></i>
                Stock máximo
              </>
            : 'Agregar al carrito'}
        </button>

        {cantidad + cantidadEnCarrito > producto.stock && (
          <p className="stock-alert">
            No podés agregar más unidades de este producto.
          </p>
        )}
      </div>

      <Link to={`/products/${producto.id}`}>Ver más</Link>
    </section>
  );
};

export default Products;