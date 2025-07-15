import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import '../components/styleCart.css';
import '../pages/styleCheckout.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import db from '../firebase/firebase';
import { formatPrice } from '../utils/formatPrice';

const Checkout = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  //Calcula el total del carrito en el checkout
  const calcularTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  return (
    <div className="layout-container">
        <Header />
        <main className="main-content checkout-grid">
          <h1 className="checkout-title">Mi carrito</h1>

          {cart.length === 0 ? (
            <div className="empty-cart-message">
              <p>Tu carrito está vacío</p>
              <button
                className="btnVolverATienda"
                onClick={() => navigate('/products')}
              >
                Volver a la tienda
              </button>
            </div>
          ) : (
            <div className="checkout-container">
              {/* Columna izquierda: productos */}
              <div className="checkout-items">
                <ul className="cart-item-checkout">
                  {cart.map((item) => (
                    <li key={item.id} className="cart-card">
                      <img
                        src={item.pictureUrl}
                        alt={`Miniatura de ${item.title}`}
                        className="cart-thumbnail-checkout"
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
                          <p className="stock-alert-cart">Máximo disponible en stock</p>
                        )}
                      </div>

                      <button
                        className="btnEliminarDelCarritoCheckout"
                        onClick={() => removeFromCart(item)}
                      >
                        <i className="fa-solid fa-trash"></i> Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Columna derecha: resumen */}
              <div className="checkout-summary">
                <div className="summary-line">
                  <span className="label">Subtotal</span>
                  <span className="value">{formatPrice(calcularTotal())}</span>
                </div>

                <hr />

                <div className="summary-line total-line">
                  <span className="label total-label">Total</span>
                  <span className="value total-value">{formatPrice(calcularTotal())}</span>
                </div>

                <button
                  className="btnFinalizarCompra"
                  onClick={async () => {
                    const MySwalInstance = withReactContent(Swal);

                    const { value: formValues } = await MySwalInstance.fire({
                      title: 'Datos del comprador',
                      html: `
                        <input id="swal-input1" class="swal2-input" placeholder="Nombre">
                        <span id="error1" style="color:red; font-size:12px; display:none"></span>

                        <input id="swal-input2" class="swal2-input" placeholder="Apellido">
                        <span id="error2" style="color:red; font-size:12px; display:none"></span>

                        <input id="swal-input3" class="swal2-input" placeholder="Teléfono">
                        <span id="error3" style="color:red; font-size:12px; display:none"></span>

                        <input id="swal-input4" class="swal2-input" placeholder="Email">
                        <span id="error4" style="color:red; font-size:12px; display:none"></span>
                      `,
                      focusConfirm: false,
                      confirmButtonText: 'Confirmar datos',
                      cancelButtonText: 'Cancelar',
                      showCancelButton: true,
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      confirmButtonColor: '#2047b3',
                      cancelButtonColor: '#dc3545',
                      didOpen: () => {
                        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                        const phoneRegex = /^\d{8,}$/;
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                        const validateInput = (inputId, errorId, validateFn, emptyMsg, invalidMsg) => {
                          const input = document.getElementById(inputId);
                          const error = document.getElementById(errorId);

                          input.addEventListener('input', () => {
                            const value = input.value.trim();

                            if (!value) {
                              error.innerText = emptyMsg;
                              error.style.display = 'block';
                            } else if (!validateFn(value)) {
                              error.innerText = invalidMsg;
                              error.style.display = 'block';
                            } else {
                              error.innerText = '';
                              error.style.display = 'none';
                            }
                          });
                        };

                        validateInput('swal-input1', 'error1', val => nameRegex.test(val), 'El nombre es requerido', 'Nombre inválido (solo letras)');
                        validateInput('swal-input2', 'error2', val => nameRegex.test(val), 'El apellido es requerido', 'Apellido inválido (solo letras)');
                        validateInput('swal-input3', 'error3', val => phoneRegex.test(val), 'El teléfono es requerido', 'Teléfono inválido (mínimo 8 dígitos numéricos)');
                        validateInput('swal-input4', 'error4', val => emailRegex.test(val), 'El email es requerido', 'Formato de email inválido');
                      },
                      preConfirm: () => {
                        const firstName = document.getElementById('swal-input1').value.trim();
                        const lastName = document.getElementById('swal-input2').value.trim();
                        const phone = document.getElementById('swal-input3').value.trim();
                        const email = document.getElementById('swal-input4').value.trim();

                        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                        const phoneRegex = /^\d{8,}$/;
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                        if (
                          !firstName || !nameRegex.test(firstName) ||
                          !lastName || !nameRegex.test(lastName) ||
                          !phone || !phoneRegex.test(phone) ||
                          !email || !emailRegex.test(email)
                        ) {
                          Swal.showValidationMessage('Revisá los datos. Todos los campos deben ser válidos.');
                          return false;
                        }

                        return { firstName, lastName, phone, email };
                      }
                    });

                    if (!formValues) return;

                    //Mostrar resumen de confirmación antes de enviar el pedido
                    const confirm = await Swal.fire({
                      title: 'Resumen del pedido',
                      html: `
                        <div class="swal-product-list">
                          ${cart.map(item => `
                            <div class="swal-product-card">
                              <img src="${item.pictureUrl}" alt="${item.title}" class="swal-product-image" />
                              <div class="swal-product-info">
                                <p class="swal-product-title">${item.title}</p>
                                <p class="swal-product-text">Precio unitario: ${formatPrice(item.price)}</p>
                                <p class="swal-product-text">Cantidad: ${item.cantidad}</p>
                                <p class="swal-product-subtotal"><b>Subtotal:</b> ${formatPrice(item.price * item.cantidad)}</p>
                              </div>
                            </div>
                          `).join('')}
                        </div>
                        <hr class="swal-divider" />
                        <p class="swal-total">Total: ${formatPrice(calcularTotal())}</p>
                      `,
                      confirmButtonText: 'Confirmar pedido',
                      cancelButtonText: 'Cancelar',
                      showCancelButton: true,
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      confirmButtonColor: '#2047b3',
                      cancelButtonColor: '#dc3545',
                      width: '600px'
                    });

                    if (!confirm.isConfirmed) return;

                    try {
                      //Mostrar loading correctamente
                      Swal.fire({
                        title: 'Generando pedido...',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                          Swal.showLoading();
                        },
                      });

                      const order = {
                        buyer: formValues,
                        items: cart.map(item => ({
                          id: item.id,
                          title: item.title,
                          price: item.price,
                          quantity: item.cantidad,
                          pictureUrl: item.pictureUrl,
                          pictureUrl2: item.pictureUrl2,
                          category: item.category,
                          description: item.description,
                          stock: item.stock,
                        })),
                        date: Timestamp.fromDate(new Date()),
                        total: parseFloat(calcularTotal().toFixed(2)),
                      };

                      const docRef = await addDoc(collection(db, 'pedidos'), order);

                      await Swal.fire({
                        icon: 'success',
                        title: 'Pedido generado exitosamente',
                        text: `Tu número de orden es: ${docRef.id}`,
                        confirmButtonColor: '#2047b3'
                      });

                      clearCart();
                      navigate('/products');

                    } catch (error) {
                      console.error("Error generando pedido:", error);
                      await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo generar el pedido. Intenta nuevamente.',
                        confirmButtonColor: '#dc3545'
                      });
                    }
                  }}
                >
                  FINALIZAR COMPRA
                </button>  

                <button
                  className="btnSeguirComprando"
                  onClick={() => navigate('/products')}
                >
                  SEGUIR COMPRANDO
                </button>
              </div>
            </div>
          )}
        </main>
        <Footer />
    </div>    
  );
};

export default Checkout;