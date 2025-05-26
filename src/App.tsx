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

  return (
    <>
      <Router>
        <Routes>

          <Route path='/' element={<Home productos={productos} cargando={cargando} />} />
          <Route path='/aboutus' element={<AboutUs />} />
          <Route path='/products' element={<GalleryProducts />} />
          <Route path='/contactUs' element={<ContactUs />} />
          <Route path='*' element={<NotFound />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
