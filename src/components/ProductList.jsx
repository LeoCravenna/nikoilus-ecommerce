import React from 'react';
import './styleProductList.css';
import Products from './Products';

const ProductList = ({ productos, titulo = "Galería de Productos" }) => {
  return (
    <>
      <h2 className='titulo'>{titulo}</h2>
      <div className="product-grid">
        {
          productos.map(producto => (
            <Products key={producto.id} producto={producto} />
          ))
        }
      </div>
    </>
  );
};

export default ProductList;
