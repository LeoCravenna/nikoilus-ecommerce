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

  const calcularTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.cantidad, 0);
  };

  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className='cart-header'>
        <h2 style={{ color: 'black' }}>Carrito de Compras</h2>
        <button onClick={onClose} className='close-button'>X</button>
      </div>

      <div className='cart-content'>
        {cart.length === 0 ? (
          <p style={{ color: 'red' }}>El carrito está vacío</p>
        ) : (
          <>
            <ul className='cart-item'>
            {cart.map((item) => (
                <li key={item.id} className="cart-card">
                <img src={item.pictureUrl} alt={item.title} className="cart-thumbnail" />
                <div className="cart-details">
                    <h4>{item.title}</h4>
                    <p>Precio: ${item.price}</p>
                    <div className='cart-controls'>
                    <button onClick={() => decreaseQuantity(item)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => increaseQuantity(item)}>+</button>
                    </div>
                    <p>Subtotal: ${item.price * item.cantidad}</p>
                    {item.cantidad === item.stock && (
                    <p style={{ color: 'red', fontSize: '12px' }}>
                        Máximo disponible en stock
                    </p>
                    )}
                </div>
                <button className='btnEliminarDelCarrito' onClick={() => removeFromCart(item)}>
                    <i className='fa-solid fa-trash'></i>
                </button>
                </li>
            ))}
            </ul>

            <hr />
            <h3 className="cart-total">Total: ${calcularTotal()}</h3>
            <button className='btnVaciarCarrito' onClick={clearCart}>Vaciar carrito</button>
            <button className='btnSeguirTienda' onClick={onClose}>
              Continuar viendo la tienda
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
