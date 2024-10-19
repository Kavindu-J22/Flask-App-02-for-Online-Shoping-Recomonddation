import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewSubmit from './ReviewSubmit';
import './styles/productDetails.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Could not fetch product details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="loading-text">Loading product details...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="product-details">
      {product ? (
        <>
          <h2 className="product-title">{product.title}</h2>
          <img src={product.imageUrl} alt={product.title} className="product-image" />
          <p className="product-description">{product.description}</p>
          <p className="product-price">LKR {product.price.toFixed(2)}</p>
          
          <button className="add-to-cart-btn">
            <i className="fa fa-shopping-cart" aria-hidden="true"></i> Add to Cart
          </button>
          
          <h3>Reviews 🗣</h3>
          {product.reviews.length > 0 ? (
            <ul className="reviews-list">
              {product.reviews.map(review => (
                <li key={review._id} className="review-product">
                  <p className="review-title"><strong>Title:</strong> {review.title}</p>
                  <p className="review-description"><strong>Review:</strong> {review.description}</p>
                  <p className="review-rating">
                    <strong>Rating:</strong> 
                    {review.rating === 1 ? (
                      <span className="rating-icon" aria-label="Recommended">
                        😊 {/* Happy face emoji for recommended */}
                      </span>
                    ) : (
                      <span className="rating-icon" aria-label="Not Recommended">
                        😞 {/* Sad face emoji for not recommended */}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
          
          <ReviewSubmit productId={id} />
        </>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default ProductDetails;
