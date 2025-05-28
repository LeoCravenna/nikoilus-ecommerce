import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './staticStyle.css'
import Cart from '../Cart'

const Header = ({cartItems, borrarProducto}) => {
  const [isCartOpen, setCartOpen] = useState(false)

  return (
    <header>
        <nav>
            <ul>
                <li><NavLink to='/' className='link'>Inicio</NavLink></li>
                <li><NavLink to='/aboutus' className='link'>Sobre nosotros</NavLink></li>
                <li><NavLink to='/products' className='link'>Galería de Productos</NavLink></li>
                <li><NavLink to='/contactus' className='link'>Contactanos</NavLink></li>
                <li className='cartnav'>
                  <button className='btnCart' onClick={()=> setCartOpen(true)}><i className='fa-solid fa-cart-shopping'></i></button>
                  <Cart borrarProducto={borrarProducto} cartItems={cartItems} isOpen={isCartOpen} onClose={()=> setCartOpen(false)} />
                </li>
                <li className='btnLogin'>
                  <NavLink to='/login' className='link'><i className="fa-solid fa-right-to-bracket"></i></NavLink>
                </li>
                <li className='btnAdmin'>
                  <NavLink to='/admin' className='link'><i className="fa-solid fa-user-tie"></i></NavLink>
                </li>
            </ul>
        </nav>
    </header>
  )
}

export default Header
