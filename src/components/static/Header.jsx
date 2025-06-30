import React, { useState, useEffect  } from 'react';
import { NavLink } from 'react-router-dom';
import './staticStyle.css';
import Cart from '../Cart';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="main-header">
      <nav className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar">
          {/* Logo */}
          <div className={`logo ${scrolled ? 'logo-small' : ''}`}>
            <NavLink to="/" className="link">Nikoilus</NavLink>
          </div>
    
          {/* Mobile: carrito y hamburguesa */}
          <div className="mobile-actions">
            <button className="btnCart mobile-only" onClick={() => setCartOpen(true)}>
              <i className="fa-solid fa-cart-shopping"></i>
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </button>

            <button
              className={`menu-toggle ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><NavLink to='/' className='link' onClick={() => setMenuOpen(false)}>Inicio</NavLink></li>
            <li><NavLink to='/aboutus' className='link' onClick={() => setMenuOpen(false)}>Sobre nosotros</NavLink></li>
            <li><NavLink to='/products' className='link' onClick={() => setMenuOpen(false)}>Galería de Productos</NavLink></li>
            <li><NavLink to='/contactus' className='link' onClick={() => setMenuOpen(false)}>Contactanos</NavLink></li>
            {/* Desktop: carrito dentro del menú */}
            <li className="desktop-only">
              <button className="btnCart" onClick={() => setCartOpen(true)}>
                <i className="fa-solid fa-cart-shopping"></i>
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </button>
            </li>
            <li>
              <NavLink to='/login' className='link' onClick={() => setMenuOpen(false)}><i className="fa-solid fa-right-to-bracket"></i></NavLink>
            </li>
            <li>
              <NavLink to='/admin' className='link' onClick={() => setMenuOpen(false)}><i className="fa-solid fa-user-tie"></i></NavLink>
            </li>
          </ul>

          <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
        </div>  
      </nav>
    </header>
  );
};

export default Header;
