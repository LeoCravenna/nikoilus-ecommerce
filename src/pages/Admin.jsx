import React, { useState, useEffect } from 'react'

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ id: null, title: "", price: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/data/data.json")
            .then((response) => response.json())
            .then((data) => {
                setTimeout(() => {
                    setProducts(data);
                    setLoading(false);
                }, 2000);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container">
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <>
                    <nav>
                        <ul className="nav">
                            <li className="navItem">
                                <button className="navButton">
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </button>
                            </li>
                            <li className="navItem">
                                <a href="/admin">Admin</a>
                            </li>
                        </ul>
                    </nav>
                    <h1 className="title">Panel Administrativo</h1>
                    <form className="form">
                        <input
                            type="text"
                            name="title"
                            placeholder="Título del producto"
                            className="input"
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Precio del producto"
                            className="input"
                            required
                        />
                        <button type="submit" className="button">
                            {form.id ? "Editar" : "Crear"}
                        </button>
                    </form>
                    <ul className="list">
                        {products.map((product) => (
                            <li key={product.id} className="listItem">
                                <img
                                    src={product.url}
                                    alt={product.titulo}
                                    className="listItemImage"
                                />
                                <span>{product.titulo}</span>
                                <span>${product.precio}</span>
                                <div>
                                    <button className="editButton">Editar</button>

                                    <button className="deleteButton">Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export default Admin
