import React from 'react'
import Header from '../components/static/Header'
import Footer from '../components/static/Footer'
import ProductList from '../components/ProductList'
import loading from '../assets/loading.gif'

const GalleryProducts = ({cart, productos, cargando, agregarCarrito, borrarProducto}) => {
  return (
    <>
    <Header borrarProducto={borrarProducto} cartItems={cart}/>
      <h1>Galería de Productos</h1>

      {
        cargando ? <img src={loading} alt='loading' /> : 
        <ProductList agregarCarrito={agregarCarrito} productos={productos} />

      }
    <Footer />    
    </>
  )
}

export default GalleryProducts
