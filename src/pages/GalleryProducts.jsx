import React, { useState, useEffect } from 'react';
import Header from '../components/static/Header';
import Footer from '../components/static/Footer';
import ProductList from '../components/ProductList';
import loading from '../assets/loading.gif';
import '../components/static/staticStyle.css';
import '../pages/styleGalleryProducts.css';
import { formatPrice } from '../utils/formatPrice';

const GalleryProducts = ({ productos, cargando }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [priceLimits, setPriceLimits] = useState([0, 100000]);
  const itemsPerPage = 8;

  useEffect(() => {
    //Determina rango de precios del catálogo
    const prices = productos.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceLimits([min, max]);
    setPriceRange([min, max]);
  }, [productos]);

  //Cuando cambia el input de título en el filtro
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  //Cuando cambia el select de categoria en el filtro
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  //Cuando cambia el rango de precios en el filtro
  const handlePriceChange = (index, value) => {
    const updated = [...priceRange];
    updated[index] = Number(value);
    setPriceRange(updated);
    setCurrentPage(1);
  };

  //Limpiar filtros de búsqueda
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange(priceLimits);
    setCurrentPage(1);
  };

  //Filtro combinado
  const productosFiltrados = productos.filter((producto) => {
    const matchSearch = producto.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory ? producto.category === selectedCategory : true;
    const matchPrice = producto.price >= priceRange[0] && producto.price <= priceRange[1];
    return matchSearch && matchCat && matchPrice;
  });

  //Paginación
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const productosPaginados = productosFiltrados.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        {/* Filtros */}
        <div className="filters-card-container">
          <section className="filters-card">
            <h3>Filtrar productos</h3>
            <div className="filters-grid">
              <input
                type="text"
                placeholder="🔍 Buscar por título..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="input-style search-input"
              />

              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="input-style category-select"
              >
                <option value="">Todas las categorías</option>
                <option value="sports">🏀 Deportes</option>
                <option value="music">🎵 Música</option>
                <option value="movie">🎬 Películas</option>
              </select>

              <div className="price-range-wrapper">
                <label>Rango de precio:</label>
                <div className="range-inputs">
                  <input
                    type="range"
                    min={priceLimits[0]}
                    max={priceLimits[1]}
                    step="0.01"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                  />
                  <input
                    type="range"
                    min={priceLimits[0]}
                    max={priceLimits[1]}
                    step="0.01"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                  />
                </div>
                <div className="range-values">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              <button className="clear-filters-btn" onClick={handleClearFilters}>
                Limpiar filtros
              </button>
            </div>
          </section>
        </div>  

        {/* Productos */}
        {cargando ? (
          <div className="loading-container">
            <img src={loading} alt='loading' />
          </div>
        ) : (
          <>
            {productosFiltrados.length === 0 ? (
              <div className="no-results-message-container">
                <div className='no-results-message'>
                  <p>No se encontraron productos que coincidan con los filtros seleccionados</p>
                </div>  
              </div>
            ) : (
              <>
                <div className="fade-transition">
                  <ProductList productos={productosPaginados} />
                </div>

                {totalPages > 1 && (
                  <div className="pagination-container">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GalleryProducts;
