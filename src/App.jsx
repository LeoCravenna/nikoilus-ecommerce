import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import GalleryProducts from './pages/GalleryProducts'
import ContactUs from './pages/ContactUs'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import RutasProtegida from './auth/RutasProtegidas'
import Admin from './pages/Admin'
import Login from './pages/Login'

//Firebase para la colección de productos
import { collection, getDocs } from 'firebase/firestore'
import db from './firebase/firebase'

//Context
import { CartProvider } from './context/CartContext';

//Alertas
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [productos, setProductos] = useState([]) //Estado de productos
  const [cargando, setCargando] = useState(true) //Estado carga de productos
  const [error, setError] = useState(false) //Estado api
  const [isAuthenticated, setIsAuth] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosRef = collection(db, "productos");
        const querySnapshot = await getDocs(productosRef);
        const productosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(productosData);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener productos de Firebase:", error);
        setError(true);
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home productos={productos} cargando={cargando} />} />
            <Route path='/aboutus' element={<AboutUs />} />
            <Route path='/products' element={<GalleryProducts productos={productos} cargando={cargando} />} />
            <Route path='/products/:id' element={<ProductDetail productos={productos} />} />
            <Route path='/contactUs' element={<ContactUs />} />
            <Route path='/admin' element={
              <RutasProtegida isAuthenticated={isAuthenticated}>
                <Admin />
              </RutasProtegida>} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<NotFound />} />


            {/* <Route path='/' element={<Home borrarProducto={handleDeleteFromCart} agregarCarrito={handleAddToCart} cart={cart} productos={productos} cargando={cargando} />} />
            <Route path='/aboutus' element={<AboutUs borrarProducto={handleDeleteFromCart} cart={cart}/>} />
            <Route path='/products' element={<GalleryProducts borrarProducto={handleDeleteFromCart} agregarCarrito={handleAddToCart} cart={cart} productos={productos} cargando={cargando} />} />
            <Route path='/products/:id' element={<ProductDetail productos={productos} agregarCarrito={handleAddToCart} />} />
            <Route path='/contactUs' element={<ContactUs borrarProducto={handleDeleteFromCart} cart={cart} />} />
            <Route path='/admin' element={<RutasProtegida isAuthenticated={isAuthenticated}> <Admin /> </RutasProtegida>} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<NotFound />} /> */}

          </Routes>
        </Router>
        <ToastContainer position="bottom-right" autoClose={2000} />
      </CartProvider>  
    </>
  )
}

export default App
