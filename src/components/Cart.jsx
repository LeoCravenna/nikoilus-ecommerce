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
                    <p>Precio: ${item.price}</p>

                    <div className="cart-controls">
                      <button onClick={() => decreaseQuantity(item)} aria-label="Restar cantidad">−</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => increaseQuantity(item)} aria-label="Sumar cantidad">+</button>
                    </div>

                    <p>Subtotal: ${item.price * item.cantidad}</p>

                    {item.cantidad === item.stock && (
                      <p className="stock-alert">Máximo disponible en stock</p>
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
            <h3 className="cart-total">Total: ${calcularTotal()}</h3>
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