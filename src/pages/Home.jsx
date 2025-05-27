import React from 'react'
import Header from '../components/static/Header'
import Footer from '../components/static/Footer'
import ProductList from '../components/ProductList'
import loading from '../assets/loading.gif'

const Home = ({cart, productos, cargando, agregarCarrito, borrarProducto}) => {
  return (
    <>
    <Header borrarProducto={borrarProducto} cartItems={cart}/>
    <main>
        
        <h1>Bienvenidos a mi Tienda</h1>

        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi consequatur sequi nesciunt sed dolorem, ad nisi veniam distinctio labore similique sit quam quisquam ex necessitatibus, id optio eos facere earum.</p>
        {
            cargando ? <img src={loading} alt='loading' /> : 
            <ProductList agregarCarrito={agregarCarrito} productos={productos} />

        }

    </main>  
    
    <Footer />  
    </>
  )
}

export default Home
