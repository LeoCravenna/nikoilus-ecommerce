import React from 'react'
import Products from './Products'

const ProductList = ({productos, agregarCarrito}) => {
  return (
    <>
        <h2 style={{textAlign:'center',fontSize:'30px'}}>Galería de Productos</h2>
        <div style={{display:'flex', flexWrap:'wrap', justifyContent:'space-evenly'}}>
            {
            productos.map(producto=>(
                <Products key={producto.id} producto={producto} agregarCarrito={agregarCarrito} />
            ))
        }
        </div>
        
    </>
  )
}

export default ProductList
