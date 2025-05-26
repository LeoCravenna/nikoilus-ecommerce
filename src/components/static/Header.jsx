import React from 'react'
import { Link } from 'react-router-dom'
import './staticStyle.css'

const Header = () => {
  return (
    <header>
        <nav>
            <ul>
                <li><Link to='/' className='link'>Inicio</Link></li>
                <li><Link to='/aboutus' className='link'>Sobre nosotros</Link></li>
                <li><Link to='/products' className='link'>Galería de Productos</Link></li>
                <li><Link to='/contactus' className='link'>Contactanos</Link></li>
            </ul>
        </nav>
    </header>
  )
}

export default Header
