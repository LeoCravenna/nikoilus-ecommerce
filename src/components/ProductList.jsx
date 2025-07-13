import React from 'react';
import Products from './Products';

const ProductList = ({ productos, titulo = "Galería de Productos" }) => {
  return (
    <>
      <h2 style={{ textAlign: 'center', fontSize: '30px' }}>{titulo}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
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
