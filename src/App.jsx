import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import GalleryProducts from './pages/GalleryProducts'
import ContactUs from './pages/ContactUs'
import NotFound from './pages/NotFound'

function App() {
  const [cart, setCart] = useState([]) //Estado del carrito
  const [productos, setProductos] = useState([]) //Estado de productos
  const [cargando, setCargando] = useState(true) //Estado carga de productos
  const [error, setError] = useState(false) //Estado api

  useEffect(()=>{
    fetch('/data/data.json')
    .then(respuesta => respuesta.json())
    .then(datos => { 
      setTimeout(()=>{
        setProductos(datos)
        setCargando(false)
      },2000)
    })
    .catch(error => {
      console.log('Error',error)
      setCargando(false)
      setError(true)
    })
  },[])

  const handleAddToCart = (product) => {
    const productInCart = cart.find((item) => item.id === product.id);
    if(productInCart) {
      setCart(cart.map((item) => item.id === product.id ? {...item,
        quantity:item.quantity+1} : item));
    }else{
      setCart([...cart, {...product,quantity:1}]);
    }
  };

  const handleDeleteFromCart = (product) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === product.id) {
          if (item.quantity > 1) {
            return {...item, quantity: item.quantity - 1};
          } else {
            return null; //Si quantity es 1, marcamos para eliminar
          }
        } else {
          return item; //Si no es el producto, lo dejamos igual
        }
      }).filter(item => item !== null); //Quitamos los productos nulos
    });
  };

  return (
    <>
      <Router>
        <Routes>

          <Route path='/' element={<Home borrarProducto={handleDeleteFromCart} agregarCarrito={handleAddToCart} cart={cart} productos={productos} cargando={cargando} />} />
          <Route path='/aboutus' element={<AboutUs borrarProducto={handleDeleteFromCart} cart={cart}/>} />
          <Route path='/products' element={<GalleryProducts borrarProducto={handleDeleteFromCart} agregarCarrito={handleAddToCart} cart={cart} productos={productos} cargando={cargando} />} />
          <Route path='/contactUs' element={<ContactUs borrarProducto={handleDeleteFromCart} cart={cart} />} />
          <Route path='*' element={<NotFound />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
