import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import db, { storage } from '../firebase/firebase';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import '../components/styleAdmin.css';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, title: '', description: '', price: '',  image1: null, image2: null, });
  const [loading, setLoading] = useState(true);

  const productosRef = collection(db, 'productos');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(productosRef);
      const productosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productosData);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const uploadImage = async (file) => {
    const imageRef = ref(storage, `productos/${uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, title, description, price, image1, image2 } = form;

    try {
      let url1 = null;
      let url2 = null;

      if (image1) url1 = await uploadImage(image1);
      if (image2) url2 = await uploadImage(image2);

      if (id) {
        const docRef = doc(db, 'productos', id);
        await updateDoc(docRef, {
          title,
          description,
          price: parseFloat(price),
          ...(url1 && { pictureUrl: url1 }),
          ...(url2 && { pictureUrl2: url2 }),
        });
      } else {
        if (!url1 || !url2) {
          alert("Debes subir ambas imágenes para crear un producto nuevo.");
          return;
        }
        await addDoc(productosRef, {
          title,
          description,
          price: parseFloat(price),
          pictureUrl: url1,
          pictureUrl2: url2,
          stock: 10,
        });
        toast.success(id ? 'Producto actualizado correctamente' : 'Producto creado exitosamente');
      }

      setForm({ id: null, title: '', description: '', price: '', image1: null, image2: null });
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      title: product.title,
      description: product.description || '',
      price: product.price,
      image1: null,
      image2: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'productos', id));
      fetchProducts();
      toast.warn('Producto eliminado');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleCancelEdit = () => {
    setForm({ id: null, title: '', description: '', price: '', url: '', url2: '' });
    toast.info('Edición cancelada');
  };

  const handleResetForm = () => {
    if (window.confirm("¿Estás seguro de que querés limpiar todos los campos?")) {
        setForm({ id: null, title: '', description: '', price: '', url: '', url2: '' });
    }
    toast.info('Formulario reseteado');
  };

  return (
    <div className="layout-container">
      <Header />
      <main className="main-content admin-panel">
        <h1 className="admin-title">Panel Administrativo</h1>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Precio" value={form.price} onChange={handleChange} required />
          <label>Imagen principal:</label>
          <input type="file" name="image1" accept="image/*" onChange={handleChange} />
          <label>Imagen secundaria:</label>
          <input type="file" name="image2" accept="image/*" onChange={handleChange} />
          <button type="submit">{form.id ? 'Actualizar' : 'Crear'}</button>
          <div className="admin-form-actions">
            {form.id && (
                <button type="button" onClick={handleCancelEdit} className="btn-cancelar">
                Cancelar edición
                </button>
            )}
            <button type="button" onClick={handleResetForm} className="btn-resetear">
                Limpiar formulario
            </button>
           </div>
        </form>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <ul className="admin-product-list">
            {products.map(product => (
              <li key={product.id} className="admin-product-item">
                <img src={product.pictureUrl2} alt={product.title} />
                <div>
                  <strong>{product.title}</strong>
                  <p>{product.description}</p>
                  <p>${product.price}</p>
                </div>
                <div className="admin-actions">
                  <button onClick={() => handleEdit(product)}>Editar</button>
                  <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;

/* import React, { useState, useEffect } from 'react'

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
 */