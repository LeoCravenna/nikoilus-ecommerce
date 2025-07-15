import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//Páginas principales
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import GalleryProducts from './pages/GalleryProducts'
import ContactUs from './pages/ContactUs'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Checkout from './pages/Checkout'

//Firebase y Firestore para los productos
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import db from './firebase/firebase'

//Contextos globales
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

//Ruta protegida para admin
import RutasProtegidas from './auth/RutasProtegidas';

//Notificaciones
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  //Estado para productos cargados desde Firebase
  const [productos, setProductos] = useState([]) //Estado de productos
  const [cargando, setCargando] = useState(true) //Estado carga de productos
  const [error, setError] = useState(false) //Estado api

  //Escucha en tiempo real la colección de productos
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

    //Limpia la suscripción al desmontar componente
    return () => unsubscribe();
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
                  <RutasProtegidas roleRequired="admin">
                    <Admin />
                  </RutasProtegidas>
                }
              />
              <Route path='/login' element={<Login />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Router>
          {/* Contenedor de notificaciones */}
          <ToastContainer position="bottom-right" autoClose={2000} />
        </CartProvider>
      </AuthProvider>    
    </>
  )
}

export default App
