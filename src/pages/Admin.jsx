import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import db, { storage } from '../firebase/firebase';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import '../components/styleAdmin.css';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image1: null,
    image2: null,
    preview1: '',
    preview2: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploadingImage1, setUploadingImage1] = useState(false);
  const [uploadingImage2, setUploadingImage2] = useState(false);

  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);

  const productosRef = collection(db, 'productos');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (form.preview1) URL.revokeObjectURL(form.preview1);
      if (form.preview2) URL.revokeObjectURL(form.preview2);
    };
  }, [form.preview1, form.preview2]);

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

  const handleImageChange = (e, imageKey, previewKey) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setForm(prev => ({
        ...prev,
        [imageKey]: file,
        [previewKey]: previewURL
      }));
    }
  };

  const deletePreviewImage = (previewKey, imageKey, inputRef) => {
    if (form[previewKey]) URL.revokeObjectURL(form[previewKey]);
    setForm(prev => ({
      ...prev,
      [previewKey]: '',
      [imageKey]: null
    }));
    if (inputRef?.current) {
      inputRef.current.value = '';
    }
  };

  const uploadImage = async (file, setLoadingFn) => {
    setLoadingFn(true);
    const imageRef = ref(storage, `productos/${uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, file);
    setLoadingFn(false);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, title, description, price, image1, image2, stock, category } = form;

    if (!title || !description || !price || !stock || !category) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('El precio debe ser mayor a cero');
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      toast.error('El stock debe ser un número válido');
      return;
    }
    if (!id && (!image1 || !image2)) {
      toast.error('Debes subir ambas imágenes');
      return;
    }

    try {
      let url1 = image1 ? await uploadImage(image1, setUploadingImage1) : null;
      let url2 = image2 ? await uploadImage(image2, setUploadingImage2) : null;

      const data = {
        title,
        description,
        price: parsedPrice,
        stock: parsedStock,
        category,
        ...(url1 && { pictureUrl: url1 }),
        ...(url2 && { pictureUrl2: url2 }),
      };

      if (id) {
        await updateDoc(doc(db, 'productos', id), data);
        toast.success('Producto actualizado');
      } else {
        await addDoc(productosRef, data);
        toast.success('Producto creado');
      }

      setForm({
        id: null,
        title: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image1: null,
        image2: null,
        preview1: '',
        preview2: ''
      });

      fileInput1Ref.current.value = '';
      fileInput2Ref.current.value = '';
      fetchProducts();
    } catch (err) {
      console.error('Error al guardar producto:', err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      title: product.title,
      description: product.description || '',
      price: product.price,
      stock: product.stock || '',
      category: product.category || '',
      image1: null,
      image2: null,
      preview1: '',
      preview2: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'productos', id));
      fetchProducts();
      toast.warn('Producto eliminado');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      id: null,
      title: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image1: null,
      image2: null,
      preview1: '',
      preview2: ''
    });
    toast.info('Edición cancelada');
    fileInput1Ref.current.value = '';
    fileInput2Ref.current.value = '';
  };

  const handleResetForm = () => {
    if (window.confirm("¿Seguro que querés limpiar todos los campos?")) {
      handleCancelEdit();
      toast.info('Formulario reseteado');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Sesión cerrada correctamente");
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div className="layout-container">
      <Header />
      <main className="main-content admin-panel">
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#d9534f',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          🔒 Cerrar sesión
        </button>
        <h1 className="admin-title">Panel Administrativo</h1>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Precio" value={form.price} onChange={handleChange} required />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />

          <div style={{ position: 'relative' }}>
            <select name="category" value={form.category} onChange={handleChange} required style={{ appearance: 'none' }}>
              <option value="">Seleccionar categoría ⬇️</option>
              <option value="sports">🏀 Deportes</option>
              <option value="music">🎵 Música</option>
              <option value="movie">🎬 Películas</option>
            </select>
          </div>

          <label>Imagen principal</label>
          <input type="file" accept="image/*" ref={fileInput1Ref} onChange={(e) => handleImageChange(e, 'image1', 'preview1')} />
          {form.preview1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={form.preview1} alt="preview1" width={100} style={{ borderRadius: 6 }} />
              <button className='btn-deletePreview' type="button" onClick={() => deletePreviewImage('preview1', 'image1', fileInput1Ref)}>🗑</button>
            </div>
          )}
          {uploadingImage1 && <p>Subiendo imagen 1...</p>}

          <label>Imagen secundaria</label>
          <input type="file" accept="image/*" ref={fileInput2Ref} onChange={(e) => handleImageChange(e, 'image2', 'preview2')} />
          {form.preview2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={form.preview2} alt="preview2" width={100} style={{ borderRadius: 6 }} />
              <button className='btn-deletePreview' type="button" onClick={() => deletePreviewImage('preview2', 'image2', fileInput2Ref)}>🗑</button>
            </div>
          )}
          {uploadingImage2 && <p>Subiendo imagen 2...</p>}

          <button type="submit">{form.id ? 'Actualizar' : 'Crear'}</button>

          <div className="admin-form-actions">
            {form.id && (
              <button type="button" className="btn-cancelar" onClick={handleCancelEdit}>Cancelar edición</button>
            )}
            <button type="button" className="btn-resetear" onClick={handleResetForm}>Limpiar formulario</button>
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
                  <span style={{ fontWeight: 'bold', color: '#2047b3' }}>
                    📦 {product.stock} unidades
                  </span>
                  <span style={{
                    background: '#2047b3',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    marginTop: '4px',
                    display: 'inline-block'
                  }}>
                    🎯 {product.category}
                  </span>
                  <p>${product.price}</p>
                </div>
                <div className="admin-actions">
                  <button onClick={() => handleEdit(product)}>✏️ Editar</button>
                  <button onClick={() => handleDelete(product.id)}>🗑 Eliminar</button>
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
