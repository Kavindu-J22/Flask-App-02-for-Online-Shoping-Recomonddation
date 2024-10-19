import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/ProductList.css'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch all products on component mount
  useEffect(() => {
    axios.get('/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);  // Initialize filtered products
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Handle search input change to filter products
  const handleSearchInput = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Filter products based on search value in title or category
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchValue.toLowerCase()) || 
      product.category.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  return (
    <div className="product-list">
      <h2>Browse Our Collection</h2>

      <input
        type="text"
        placeholder="Search products by title or category..."
        value={searchTerm}
        onChange={handleSearchInput}
        className="search-input"
      />
      
      <p className="product-count">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found 🔎.
      </p>
      
      <div className="product-grid">
        {filteredProducts.map(product => (
          <div className="product-card" key={product._id}>
            <img src={product.imageUrl} alt={product.title} className="product-image-mn" />
            <div className="product-details-mn">
              <h3 className="product-title-mn">{product.title}</h3>
              <p className="product-category-mn">{product.category}</p>
              <p className="product-description-mn">{product.description}</p>
              <p className="product-price-mn">$ {product.price.toFixed(2)}</p>
              <Link to={`/product/${product._id}`} className="details-btn">Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
