import React, { useState } from 'react'
import './styleProducts.css'

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

        <h3 className='nombre'>{producto.titulo}</h3>
        <h4 className='nombre'>{producto.descripcion}</h4>
        <p className='precio'>${producto.precio}</p>
        <p className='stock'>Stock: {producto.stock}</p>

        <div className='cantidadContainer'>
            <button className='qtyButton' onClick={decrease}>-</button>
            <span>{cantidad}</span>
            <button className='qtyButton' onClick={increase}>+</button>
        </div>

        {/* <button onClick={(()=> agregarCarrito(producto))}>Agregar al carrito</button> */}
        <button onClick={() => agregarCarrito({...producto, quantity: cantidad})}>Agregar al carrito</button>
    </section>
  )
}

export default Products
