import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './staticStyle.css';
import Cart from '../Cart';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo_nikoilus.png';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { toast } from 'react-toastify';

const Header = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { cart } = useCart();
  const { user, rol } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPanel = location.pathname === '/admin';
  const isCheckout = location.pathname === '/checkout';
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info('Sesión cerrada correctamente');
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <header className="main-header">
      <nav className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar">

          {/* Logo */}
          <div className={`logo ${scrolled ? 'logo-small' : ''}`}>
            <NavLink to="/">
              <img src={logo} alt="Nikoilus logo" className="logo-img" />
            </NavLink>
          </div>

          {/* Admin Panel */}
          {isCheckout ? null : isAdminPanel && rol === 'admin' ? (
            <>
              <div className="mobile-actions">
                <span className="admin-label">Admin</span>
                <button
                  className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Abrir menú"
                >
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                </button>
              </div>

              <div className={`admin-header-nav ${menuOpen ? 'open' : ''}`}>
                <button onClick={() => navigate('/')} className="btn-ir-tienda">
                  Ir a la tienda
                </button>
                <button onClick={handleLogout} className="btn-logout">
                  <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Cliente / Visitante */}
              <div className="mobile-actions">
                <button className="btnCart mobile-only" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">
                  <i className="fa-solid fa-cart-shopping"></i>
                  {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                </button>

                <button
                  className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Abrir menú"
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

                <li className="desktop-only">
                  <button className="btnCart" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">
                    <i className="fa-solid fa-cart-shopping"></i>
                    {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                  </button>
                </li>

                {!user && (
                  <li>
                    <NavLink to='/login' className='link' onClick={() => setMenuOpen(false)} aria-label="Login">
                      <i className="fa-solid fa-right-to-bracket"></i>
                    </NavLink>
                  </li>
                )}

                {rol === 'admin' && (
                  <li className="admin-buttons">
                    <button
                      className="btn-ir-panel"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/admin');
                      }}
                    >
                      Ir al Panel
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
                    </button>
                  </li>
                )}

                {rol === 'cliente' && (
                  <li className='user-info'>
                    <span className='user-label'>{rol}</span>
                    <button className='btn-logout' onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
                    </button>
                  </li>
                )}
              </ul>

              <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;