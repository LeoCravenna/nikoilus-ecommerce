import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate  } from 'react-router-dom';
import './staticStyle.css';
import Cart from '../Cart';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo_nikoilus.png';

import { auth } from '../../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../../firebase/firebase';
import { toast } from 'react-toastify';

const Header = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();

  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  //scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //Autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(collection(db, 'usuarios'), where('email', '==', currentUser.email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setRol(snapshot.docs[0].data().rol);
        }
      } else {
        setUser(null);
        setRol(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRol(null);
      toast.info("Sesión cerrada");
      navigate('/');
    } catch (error) {
      toast.error("Error al cerrar sesión");
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

          {/* Mobile: Cart + Hamburger Menu */}
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

          {/* Navegación principal */}
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><NavLink to='/' className='link' onClick={() => setMenuOpen(false)}>Inicio</NavLink></li>
            <li><NavLink to='/aboutus' className='link' onClick={() => setMenuOpen(false)}>Sobre nosotros</NavLink></li>
            <li><NavLink to='/products' className='link' onClick={() => setMenuOpen(false)}>Galería de Productos</NavLink></li>
            <li><NavLink to='/contactus' className='link' onClick={() => setMenuOpen(false)}>Contactanos</NavLink></li>

            {/* Desktop: Cart button */}
            <li className="desktop-only">
              <button className="btnCart" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">
                <i className="fa-solid fa-cart-shopping"></i>
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </button>
            </li>

            {/* Mostrar si no está logueado */}
            {!user && (
              <li>
                <NavLink to='/login' className='link' onClick={() => setMenuOpen(false)} aria-label="Login">
                  <i className="fa-solid fa-right-to-bracket"></i>
                </NavLink>
              </li>
            )}

            {/* Solo si es admin */}
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
            {/* {rol === 'admin' && (
              <li>
                <NavLink to='/admin' className='link' onClick={() => setMenuOpen(false)} aria-label="Admin">
                  <i className="fa-solid fa-user-tie"></i>
                </NavLink>
                <button className='btn-logout' onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
                </button>
              </li>
            )} */}

            {/* Solo si es cliente  */}
            {rol === 'cliente' && (
              <li className='user-info'>
                <span className='user-label'>{rol}</span>
                <button className='btn-logout' onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              </li>
            )}

            {/* <li>
              <NavLink to='/login' className='link' onClick={() => setMenuOpen(false)} aria-label="Login">
                <i className="fa-solid fa-right-to-bracket"></i>
              </NavLink>
            </li>
            <li>
              <NavLink to='/admin' className='link' onClick={() => setMenuOpen(false)} aria-label="Admin">
                <i className="fa-solid fa-user-tie"></i>
              </NavLink>
            </li> */}
          </ul>

          {/* Carrito lateral */}
          <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
        </div>
      </nav>
    </header>
  );
};

export default Header;

/* import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './staticStyle.css';
import Cart from '../Cart';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo_nikoilus.png';

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

         
          <div className={`logo ${scrolled ? 'logo-small' : ''}`}>
            <NavLink to="/">
              <img src={logo} alt="Nikoilus logo" className="logo-img" />
            </NavLink>
          </div>

          
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

            <li>
              <NavLink to='/login' className='link' onClick={() => setMenuOpen(false)} aria-label="Login">
                <i className="fa-solid fa-right-to-bracket"></i>
              </NavLink>
            </li>
            <li>
              <NavLink to='/admin' className='link' onClick={() => setMenuOpen(false)} aria-label="Admin">
                <i className="fa-solid fa-user-tie"></i>
              </NavLink>
            </li>
          </ul>

         
          <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
        </div>
      </nav>
    </header>
  );
};

export default Header; */