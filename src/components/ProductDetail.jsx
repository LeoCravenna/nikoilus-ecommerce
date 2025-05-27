import React from 'react'
import { useParams } from 'react-router-dom'

const ProductDetail = ({productos}) => {
    const {id} = useParams()

    const product = productos.find(producto => producto.id == id)

    return (
        <div>
            <h1>Detalle del producto: {id}</h1>
            {product ? (<h2>{product.titulo}</h2>) : (<p>Producto no encontrado</p>)}
        </div>
    )
}

export default ProductDetail
