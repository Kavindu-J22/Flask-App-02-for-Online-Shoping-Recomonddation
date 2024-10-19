import React, { useState } from 'react';
import axios from 'axios';
import './styles/ReviewSubmit.css';

const ReviewForm = ({ productId }) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const submitReview = (e) => {
    e.preventDefault();

    if (recommendation === null) {
      setFeedbackMessage("Please provide a recommendation.");
      return;
    }

    const reviewData = {
      title: reviewTitle,
      description: reviewText,
      rating: recommendation
    };

    // Send POST request to submit review for the specific product
    axios.post(`/api/products/${productId}/review`, reviewData)
      .then(res => {
        alert('Review successfully added!');
        setReviewTitle('');  // Reset form fields
        setReviewText('');
        setRecommendation(null);
        setFeedbackMessage('');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to submit the review.');
      });
  };

  return (
    <form onSubmit={submitReview} className="review-form">
      <h3>Leave a Review</h3>
      <input
        type="text"
        value={reviewTitle}
        onChange={(e) => setReviewTitle(e.target.value)}
        placeholder="Review Title"
        required
      />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Describe your experience..."
        required
      />
      <div className="recommendation-selection">
        <p>Do you recommend this product?</p>

        <span
          className={`rating-choice ${recommendation === 1 ? 'selected' : ''}`}
          onClick={() => setRecommendation(1)}
          role="button"
          aria-label="Recommend"
        >
          😊 Yes
        </span>
        <span
          className={`rating-choice ${recommendation === 0 ? 'selected' : ''}`}
          onClick={() => setRecommendation(0)}
          role="button"
          aria-label="Not Recommend"
        >
          😞 No
        </span>
      </div>
      {feedbackMessage && <p className="error-message">{feedbackMessage}</p>}
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
