import React from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const ProductDetail = ({productos}) => {
    const {id} = useParams()

    const product = productos.find(producto => producto.id == id)

    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <h1>Detalle del producto: {id}</h1>
            {product ? (<h2>{product.titulo}</h2>) : (<p>Producto no encontrado</p>)}
            <Link to='/'>Volver al inicio</Link>
        </div>
    )
}

export default ProductDetail
