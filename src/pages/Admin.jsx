import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import db, { auth } from '../firebase/firebase';
import Footer from '../components/static/Footer';
import '../components/styleAdmin.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_nikoilus.png';
import Swal from 'sweetalert2';

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
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
  const [errors, setErrors] = useState({});
  //const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage1, setUploadingImage1] = useState(false);
  const [uploadingImage2, setUploadingImage2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);
  const formRef = useRef(null);

  const productosRef = collection(db, 'productos');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const q = query(productosRef, orderBy('createdAt', 'asc')); // ordena por fecha ascendente
      const querySnapshot = await getDocs(q);
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

  const uploadToCloudinary = async (file, setLoadingFn) => {
    setLoadingFn(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'nikoilus_prods');
    data.append('cloud_name', 'leocraveapi');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/leocraveapi/image/upload', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      setLoadingFn(false);
      return json.secure_url;
    } catch (err) {
      setLoadingFn(false);
      toast.error("Error al subir imagen a Cloudinary");
      throw err;
    }
  };

  const handleImageChange = (e, imageKey, previewKey) => {
    const file = e.target.files[0];

    if (file) {
      const previewURL = URL.createObjectURL(file);

      setForm(prev => {
        const updatedForm = {
          ...prev,
          [imageKey]: file,
          [previewKey]: previewURL
        };

        // Validación de imágenes en tiempo real
        const hasImage =
          updatedForm.image1 || updatedForm.preview1 ||
          updatedForm.image2 || updatedForm.preview2;

        if (hasImage) {
          setErrors(prev => {
            const updated = { ...prev };
            delete updated.images;
            return updated;
          });
        }

        return updatedForm;
      });
    }
  };

  const deletePreviewImage = (previewKey, imageKey, inputRef) => {
    if (form[previewKey]) {
      URL.revokeObjectURL(form[previewKey]);
    }

    setForm(prev => {
      const updatedForm = {
        ...prev,
        [previewKey]: '',
        [imageKey]: null
      };

      // Validación: si ya no hay imágenes, mostrar error
      const hasImage =
        updatedForm.image1 || updatedForm.preview1 ||
        updatedForm.image2 || updatedForm.preview2;

      setErrors(prev => ({
        ...prev,
        images: hasImage ? undefined : 'Debe subir al menos una imagen'
      }));

      return updatedForm;
    });

    if (inputRef?.current) {
      inputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({ ...prev, [name]: value }));

    // Validación en tiempo real
    setErrors(prev => {
      const updated = { ...prev };

      switch (name) {
        case 'title':
          if (!value.trim()) updated.title = 'El título es obligatorio';
          else delete updated.title;
          break;

        case 'description':
          if (!value.trim()) updated.description = 'La descripción es obligatoria';
          else delete updated.description;
          break;

        case 'price':
          if (!value) updated.price = 'El precio es obligatorio';
          else if (parseFloat(value) <= 0) updated.price = 'Debe ser mayor a cero';
          else delete updated.price;
          break;

        case 'stock':
          if (!value) updated.stock = 'El stock es obligatorio';
          else if (parseInt(value) < 0) updated.stock = 'No puede ser negativo';
          else delete updated.stock;
          break;

        case 'category':
          if (!value) updated.category = 'Seleccioná una categoría';
          else delete updated.category;
          break;

        default:
          break;
      }

      return updated;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!form.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (!form.price) newErrors.price = 'El precio es obligatorio';
    else if (parseFloat(form.price) <= 0) newErrors.price = 'Debe ser mayor a cero';
    if (!form.stock) newErrors.stock = 'El stock es obligatorio';
    else if (parseInt(form.stock) < 0) newErrors.stock = 'No puede ser negativo';
    if (!form.category) newErrors.category = 'Seleccioná una categoría';

    const hasImage =
      form.image1 || form.preview1 || form.image2 || form.preview2;
    if (!hasImage) newErrors.images = 'Debe subir al menos una imagen';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { id, title, description, price, stock, category, image1, image2 } = form;

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    try {
       setSavingProduct(true);

      let url1 = form.preview1;
      let url2 = form.preview2;

      if (!id && !url1 && !url2) {
        toast.error('Debes subir al menos una imagen');
        return;
      }

      if (image1) {
        url1 = await uploadToCloudinary(image1, setUploadingImage1);
      }

      if (image2) {
        url2 = await uploadToCloudinary(image2, setUploadingImage2);
      }

      const data = {
        title,
        description,
        price: parsedPrice,
        stock: parsedStock,
        category,
        pictureUrl: url1,
        pictureUrl2: url2,
        createdAt: new Date()
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

      if (fileInput1Ref.current) fileInput1Ref.current.value = '';
      if (fileInput2Ref.current) fileInput2Ref.current.value = '';

      setErrors({});
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      toast.error('Error al guardar el producto');
    } finally {
      setSavingProduct(false);
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
        preview1: product.pictureUrl,
        preview2: product.pictureUrl2
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    //const product = products.find(p => p.id === id);

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡Esta acción eliminará el producto permanentemente!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
    });

    if (result.isConfirmed) {
        try {
        // Borra imágenes en Cloudinary si existen
        /* if (product.pictureUrl) {
            await deleteImageFromCloudinary(product.pictureUrl);
        }
        if (product.pictureUrl2) {
            await deleteImageFromCloudinary(product.pictureUrl2);
        } */

        await deleteDoc(doc(db, 'productos', id));
        fetchProducts();

        Swal.fire('Eliminado', 'El producto fue eliminado correctamente.', 'success');
        } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
        }
    }
  };  

  //Función que borra imágenes en Cloudinary
  /* const deleteImageFromCloudinary = async (imageUrl) => {
    const publicId = imageUrl
        .split('/')
        .slice(-1)[0]
        .split('.')[0]; // Extrae el public_id

    try {
        await fetch('https://api.cloudinary.com/v1_1/leocraveapi/delete_by_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: publicId }) // Solo posible si tenés token, si no usás backend.
        });
    } catch (error) {
        console.error('No se pudo eliminar la imagen de Cloudinary:', error);
    }
  }; */

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
    setShowModal(false);
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

  // Filtrado
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="layout-container">
      {/* <Header /> */}
      <header className="admin-header">
        <div className="admin-header-left">
            <img src={logo} alt="Nikoilus logo" className="logo-img" />
        </div>
        <div className="admin-header-right">
            <span className="admin-label">Admin</span>
            <button onClick={handleLogout} className="btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button>
        </div>
      </header>
      <main className="main-content admin-panel">
        <h1 className="admin-title">Panel Administrativo</h1>

        <button onClick={() => setShowModal(true)} className="btn-toggle-form">
            ➕ Agregar nuevo producto
        </button>

        <div className="filter-bar">
          <input
            type="text"
            className="input-style"
            placeholder="🔍 Buscar por título..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reinicia a la primera página
            }}
          />

          <select
            className="input-style"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Todas las categorías</option>
            <option value="sports">🏀 Deportes</option>
            <option value="music">🎵 Música</option>
            <option value="movie">🎬 Películas</option>
          </select>
        </div>

        {showModal  && (
          <div className="modal-overlay">
            <div className="modal-content">
              {savingProduct && (
                <div className="saving-overlay">
                  <div className="saving-spinner"></div>
                  <p className="saving-text">
                    {form.id ? 'Actualizando producto...' : 'Creando producto...'}
                  </p>
                </div>
              )}
              <form ref={formRef} className="admin-form animate" onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Título" value={form.title} onChange={handleChange} className={errors.title ? 'input-error' : ''} />
                {errors.title && <span className="form-error">{errors.title}</span>}
                
                <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className={errors.description ? 'input-error' : ''} />
                {errors.description && <span className="form-error">{errors.description}</span>}
                
                <input type="number" name="price" placeholder="Precio" value={form.price} onChange={handleChange} className={errors.price ? 'input-error' : ''} />
                {errors.price && <span className="form-error">{errors.price}</span>}
                
                <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className={errors.stock ? 'input-error' : ''} />
                {errors.stock && <span className="form-error">{errors.stock}</span>}
                
                <select name="category" value={form.category} onChange={handleChange} className={errors.category ? 'input-error' : ''}>
                    <option value="">Seleccionar categoría</option>
                    <option value="sports">🏀 Deportes</option>
                    <option value="music">🎵 Música</option>
                    <option value="movie">🎬 Películas</option>
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}

                <label>Imagen principal</label>
                <input type="file" accept="image/*" ref={fileInput1Ref} onChange={(e) => handleImageChange(e, 'image1', 'preview1')} />
                {form.preview1 && (
                  <div className="image-preview">
                    <img src={form.preview1} alt="preview1" width={100} />
                    <button type="button" onClick={() => deletePreviewImage('preview1', 'image1', fileInput1Ref)}><i className="fa-solid fa-trash"></i></button>
                  </div>
                )}
                {uploadingImage1 && <p>Subiendo imagen 1...</p>}
                {errors.images && <span className="form-error">{errors.images}</span>}

                <label>Imagen secundaria</label>
                <input type="file" accept="image/*" ref={fileInput2Ref} onChange={(e) => handleImageChange(e, 'image2', 'preview2')} />
                {form.preview2 && (
                  <div className="image-preview">
                    <img src={form.preview2} alt="preview2" width={100} />
                    <button type="button" onClick={() => deletePreviewImage('preview2', 'image2', fileInput2Ref)}><i className="fa-solid fa-trash"></i></button>
                  </div>
                )}
                {uploadingImage2 && <p>Subiendo imagen 2...</p>}

                <button type="submit" disabled={savingProduct}>
                  {form.id ? 'Actualizar' : savingProduct ? 'Creando...' : 'Crear'}
                </button>
                <div className="admin-form-actions">
                    {form.id ? (
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={handleCancelEdit}
                        >
                            Cancelar edición
                        </button>
                        ) : (
                        <>
                            <button
                            type="button"
                            className="btn-cancelar"
                            onClick={() => {
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
                                if (fileInput1Ref.current) fileInput1Ref.current.value = '';
                                if (fileInput2Ref.current) fileInput2Ref.current.value = '';
                                setShowModal(false);
                                toast.info('Creación cancelada');
                            }}
                            >
                            Cancelar
                            </button>

                            <button
                            type="button"
                            className="btn-resetear"
                            onClick={async () => {
                                const result = await Swal.fire({
                                title: '¿Limpiar formulario?',
                                text: 'Se borrarán todos los campos completados.',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Sí, limpiar',
                                cancelButtonText: 'Cancelar',
                                confirmButtonColor: '#17a2b8',
                                cancelButtonColor: '#6c757d'
                                });

                                if (result.isConfirmed) {
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
                                if (fileInput1Ref.current) fileInput1Ref.current.value = '';
                                if (fileInput2Ref.current) fileInput2Ref.current.value = '';
                                toast.info('Formulario reseteado');
                                }
                            }}
                            >
                            Limpiar formulario
                            </button>
                        </>
                    )}
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <>
          <ul className="admin-product-list">
            {paginatedProducts.map(product => (
              <li key={product.id} className="admin-product-item">
                <img src={product.pictureUrl} alt={product.title} />
                <div>
                  <strong>{product.title}</strong>
                  <p>{product.description}</p>
                  <span style={{ fontWeight: 'bold', color: '#2047b3' }}>
                    📦 {product.stock} unidades
                  </span>
                  <span>
                    🎯 {product.category}
                  </span>
                  <p>${product.price}</p>
                </div>
                <div className="admin-actions">
                  <button onClick={() => handleEdit(product)}><i class="fa-solid fa-pen"></i> Editar</button>
                  <button onClick={() => handleDelete(product.id)}><i className="fa-solid fa-trash"></i> Eliminar</button>
                </div>
              </li>
            ))}
          </ul>

          {/* PAGINACIÓN */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;