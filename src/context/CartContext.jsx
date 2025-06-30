import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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

 /*  const increaseQuantity = (product) => {
    setCart(cart.map(item =>
      item.id === product.id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    ));
  }; */

  const decreaseQuantity = (product) => {
    setCart(prevCart =>
        prevCart
        .map(item => {
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

  const clearCart = () => {
    setCart([]);
    toast.info('Todos los productos fueron eliminados del carrito', {
        toastId: 'cart-cleared',
    });
  };

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
