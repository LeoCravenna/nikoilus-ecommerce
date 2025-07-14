import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import '../components/styleCart.css';
import '../components/styleCheckout.css';

const Checkout = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const calcularTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="layout-container">
        <Header />
        <main className="main-content">
        <h1 className="checkout-title">Resumen de tu compra</h1>
        {cart.length === 0 ? (
            <p>Tu carrito está vacío.</p>
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
                    <p>Precio unitario: {formatPrice(item.price)}</p>
                    <div className="cart-controls">
                        <button
                        className="qtyButtonCart buttonDecrecerCart"
                        onClick={() => decreaseQuantity(item)}
                        aria-label="Restar cantidad"
                        >
                        −
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                        className="qtyButtonCart buttonIncrementarCart"
                        onClick={() => increaseQuantity(item)}
                        aria-label="Sumar cantidad"
                        disabled={item.cantidad >= item.stock}
                        >
                        +
                        </button>
                    </div>
                    <p>Subtotal: {formatPrice(item.price * item.cantidad)}</p>
                    {item.cantidad === item.stock && (
                        <p className="stock-alert-cart">Máximo disponible</p>
                    )}
                    </div>
                    <button
                    className="btnEliminarDelCarrito"
                    onClick={() => removeFromCart(item)}
                    >
                    <i className="fa-solid fa-trash"></i>
                    </button>
                </li>
                ))}
            </ul>

            <h2 className="cart-total">
                Total del pedido: {formatPrice(calcularTotal())}
            </h2>

            <div className="checkout-actions">
                <button
                className="btnSeguirTienda"
                onClick={() => navigate('/products')}
                >
                🛒 Seguir comprando
                </button>
                <button
                className="btnVaciarCarrito"
                onClick={() => navigate('/checkout/confirm')}
                >
                ✅ Finalizar compra
                </button>
            </div>
            </>
        )}
        </main>
        <Footer />
    </div>    
  );
};

export default Checkout;