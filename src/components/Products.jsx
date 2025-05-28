import React, { useState } from 'react'
import './styleProducts.css'
import { Link } from 'react-router-dom';

const Products = ({producto, agregarCarrito}) => {
  const [cantidad, setCantidad] = useState(1);

  const increase = () => setCantidad(prev => (prev < producto.stock ? prev + 1 :
    prev));

  const decrease = () => setCantidad(prev => (prev > 1 ? prev -1 : 1));  

  return (
    <section className='card'>
        <div className='imageContainer'>
            <img src={producto.url} alt="" className='image' />
        </div>

        <h3 className='titulo'>{producto.titulo}</h3>
        <h4 className='descripcion'>{producto.descripcion}</h4>
        <p className='precio'>${producto.precio}</p>
        <p className='stock'>Stock: {producto.stock}</p>

        <div className='cantidadContainer'>
            <button className='qtyButton buttonDecrecer' onClick={decrease}>-</button>
            <span>{cantidad}</span>
            <button className='qtyButton buttonIncrementar' onClick={increase}>+</button>
        </div>

        <button className='btnAgregarCarrito' style={{display: cantidad == 0 ? 'none' : 'block'}} onClick={()=> agregarCarrito({...producto, cantidad:cantidad})}>Agregar al carrito</button>

        <Link to={`/products/${producto.id}`}>Ver más</Link>
    </section>
  )
}

export default Products
