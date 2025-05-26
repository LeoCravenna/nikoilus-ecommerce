import React from 'react'
import './styleProducts.css'

const Products = ({producto}) => {
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
            <button className='qtyButton'>-</button>
            <span></span>
            <button className='qtyButton'>+</button>
        </div>

        <button>Agregar al carrito</button>
    </section>
  )
}

export default Products
