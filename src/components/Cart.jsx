import React from 'react';
import './styleCart.css';
import { useCart } from '../context/CartContext';

const Cart = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  } = useCart();

  const calcularTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <header className="cart-header">
        <h2 className="cart-title">Carrito de Compras</h2>
        <button
          onClick={onClose}
          className="close-button"
          aria-label="Cerrar carrito"
        >
          &times;
        </button>
      </header>

      <div className="cart-content">
        {cart.length === 0 ? (
          <p style={{ color: 'red' }}>El carrito está vacío</p>
        ) : (
          <>
            <ul className="cart-item">
              {cart.map((item) => (
                <li key={item.id} className="cart-card">
                  <img
                    src={item.pictureUrl}
                    alt={`Miniatura de ${item.title}`}
                    className="cart-thumbnail"
                  />
                  <div className="cart-details">
                    <h4>{item.title}</h4>
                    <p>Precio: {formatPrice(item.price)}</p>

                    <div className="cart-controls">
                      <button className='qtyButtonCart buttonDecrecerCart' onClick={() => decreaseQuantity(item)} aria-label="Restar cantidad">−</button>
                      <span>{item.cantidad}</span>
                      <button className='qtyButtonCart buttonIncrementarCart' onClick={() => increaseQuantity(item)} aria-label="Sumar cantidad">+</button>
                    </div>

                    <p>Subtotal: {formatPrice(item.price * item.cantidad)}</p>

                    {item.cantidad === item.stock && (
                      <p className="stock-alert-cart">Máximo disponible en stock</p>
                    )}
                  </div>

                  <button
                    className="btnEliminarDelCarrito"
                    onClick={() => removeFromCart(item)}
                    aria-label="Eliminar producto"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </li>
              ))}
            </ul>

            <hr />
            <h3 className="cart-total">Total: {formatPrice(calcularTotal())}</h3>
            <hr />
            <button
              className="btnComprar"
              onClick={() => {
                onClose();
                window.location.href = '/checkout';
              }}
            >
              Comprar
            </button>
            <hr />
            <button className="btnVaciarCarrito" onClick={clearCart}>
              Vaciar carrito
            </button>
            <button className="btnSeguirTienda" onClick={onClose}>
              Continuar viendo la tienda
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Cart;