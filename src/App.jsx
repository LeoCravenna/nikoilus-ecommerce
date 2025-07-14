import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import GalleryProducts from './pages/GalleryProducts'
import ContactUs from './pages/ContactUs'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Checkout from './pages/Checkout'

//Firebase para la colección de productos
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import db from './firebase/firebase'

//Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './auth/PrivateRoute';

//Alertas
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [productos, setProductos] = useState([]) //Estado de productos
  const [cargando, setCargando] = useState(true) //Estado carga de productos
  const [error, setError] = useState(false) //Estado api

  //Carga productos
  useEffect(() => {
    const productosRef = collection(db, 'productos');
    const q = query(productosRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductos(productosData);
      setCargando(false);
    }, (error) => {
      console.error("Error al obtener productos de Firebase:", error);
      setError(true);
      setCargando(false);
    });

    return () => unsubscribe(); //Limpiar la suscripción al desmontar
  }, []);

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path='/' element={<Home productos={productos} cargando={cargando} />} />
              <Route path='/aboutus' element={<AboutUs />} />
              <Route path='/products' element={<GalleryProducts productos={productos} cargando={cargando} />} />
              <Route path='/products/:id' element={<ProductDetail productos={productos} />} />
              <Route path='/contactUs' element={<ContactUs />} />
              <Route
                path='/admin'
                element={
                  <PrivateRoute roleRequired="admin">
                    <Admin />
                  </PrivateRoute>
                }
              />
              <Route path='/login' element={<Login />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Router>
          <ToastContainer position="bottom-right" autoClose={2000} />
        </CartProvider>
      </AuthProvider>    
    </>
  )
}

export default App
