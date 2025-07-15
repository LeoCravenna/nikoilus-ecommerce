import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

//Crea el contexto
const CartContext = createContext();

//Hook personalizado para acceder fácilmente al carrito
export const useCart = () => useContext(CartContext);

//Proveedor del contexto de carrito
export const CartProvider = ({ children }) => {
  //Estado inicial: se recupera del localStorage
  const [cart, setCart] = useState(() => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  //Guarda en localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  //Agrega un producto al carrito o actualiza su cantidad
  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);

      if (existing) {
        const nuevaCantidad = existing.cantidad + product.cantidad;

        if (nuevaCantidad <= product.stock) {
          toast.success('Cantidad actualizada', { toastId: `update-${product.id}` });
          return prevCart.map(item =>
          item.id === product.id
            ? { ...item, cantidad: nuevaCantidad }
            : item
          );
        } else {
          toast.error(`No hay más stock disponible (Stock: ${product.stock})`, {
            toastId: `stock-${product.id}`
          });
          return prevCart;
        }
      } else {
        if (product.cantidad <= product.stock) {
          toast.success('Producto agregado al carrito', { toastId: `add-${product.id}` });
          return [...prevCart, { ...product }];
        } else {
          toast.error(`No hay suficiente stock (Stock: ${product.stock})`, {
            toastId: `nostock-${product.id}`
          });
          return prevCart;
        }
      }
    });
  };

  //Disminuye la cantidad de un producto o lo elimina del carrito
  const removeFromCart = (product) => {
    setCart(prevCart =>
      prevCart
      .map(item => {
        if (item.id === product.id) {
          if (item.cantidad > 1) {
            return { ...item, cantidad: item.cantidad - 1 };
          } else {
            toast.error('Producto eliminado del carrito', {
              toastId: `remove-${product.id}`
            });
            return null;
          }
        }
        return item;
      })
      .filter(item => item !== null)
    );
  };

  //Aumenta la cantidad de un producto en el carrito, si hay stock
  const increaseQuantity = (product) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === product.id) {
          if (item.cantidad < product.stock) {
            toast.success('Cantidad actualizada', { toastId: `update-${product.id}` });
            return { ...item, cantidad: item.cantidad + 1 };
          }
        }
        return item;
      })
    );
  };

  //Disminuye la cantidad de un producto en el carrito o lo elimina
  const decreaseQuantity = (product) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === product.id) {
          if (item.cantidad > 1) {
            toast.success('Cantidad actualizada', { toastId: `update-${product.id}` });
            return { ...item, cantidad: item.cantidad - 1 };
          } else {
            toast.error('Producto eliminado del carrito', { toastId: `remove-${product.id}` });
            return null;
          }
        }
        return item;
      })
      .filter(item => item !== null)
    );
  };

  //Elimina todos los productos del carrito
  const clearCart = () => {
    setCart([]);
    toast.info('Todos los productos fueron eliminados del carrito', {
      toastId: 'cart-cleared',
    });
  };

  //Valores disponibles en el contexto
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
