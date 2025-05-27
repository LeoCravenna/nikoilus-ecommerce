import React from 'react'
import Header from '../components/static/Header'
import Footer from '../components/static/Footer'

const ContactUs = ({cart, borrarProducto}) => {
  return (
    <>
    <Header borrarProducto={borrarProducto} cartItems={cart}/>
      <h1>Contacto</h1>
    <Footer />
    </>
  )
}

export default ContactUs
