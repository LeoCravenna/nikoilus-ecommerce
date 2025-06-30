import React from 'react'
import Header from '../components/static/Header'
import Footer from '../components/static/Footer'

const ContactUs = ({cart, borrarProducto}) => {
  return (
    <>
    <div className="layout-container">
    <Header borrarProducto={borrarProducto} cartItems={cart}/>
      <main className="main-content">
        <h1 style={{textAlign:'center'}}>Contactanos</h1>
      </main>  
    <Footer />
    </div>
    </>
  )
}

export default ContactUs
