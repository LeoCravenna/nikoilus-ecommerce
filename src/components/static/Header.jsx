import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './staticStyle.css'
import Cart from '../Cart'

const Header = ({cartItems, borrarProducto}) => {
  const [isCartOpen, setCartOpen] = useState(false)

  return (
    <header>
        <nav>
            <ul>
                <li><Link to='/' className='link'>Inicio</Link></li>
                <li><Link to='/aboutus' className='link'>Sobre nosotros</Link></li>
                <li><Link to='/products' className='link'>Galería de Productos</Link></li>
                <li><Link to='/contactus' className='link'>Contactanos</Link></li>
                <li className='cartnav'>
                  <button className='btnCart' onClick={()=> setCartOpen(true)}><i className='fa-solid fa-cart-shopping'></i></button>
                  <Cart borrarProducto={borrarProducto} cartItems={cartItems} isOpen={isCartOpen} onClose={()=> setCartOpen(false)} />
                </li>
            </ul>
        </nav>
    </header>
  )
}

export default Header
