import React from 'react'
import Header from '../components/static/Header'
import Footer from '../components/static/Footer'

const AboutUs = ({cart, borrarProducto}) => {
  return (
    <>
    <Header borrarProducto={borrarProducto} cartItems={cart}/>
      <h1>Acerca de</h1>
    <Footer />
    </>
  )
}

export default AboutUs
