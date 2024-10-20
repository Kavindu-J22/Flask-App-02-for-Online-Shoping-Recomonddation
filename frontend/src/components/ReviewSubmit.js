import React, { useState } from 'react';
import axios from 'axios';
import './styles/ReviewSubmit.css';

const ReviewForm = ({ productId }) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure title and review are provided
    if (!reviewTitle || !reviewText) {
      setFeedbackMessage("Title and review are required.");
      setLoading(false);
      return;
    }

    try {
      // Make a POST request to the Flask API to get the prediction
      const response = await axios.post('http://127.0.0.1:5001/predict', {
        title: reviewTitle,
        review: reviewText,
      });

      // Get the recommendation from the response
      const prediction = response.data.prediction;

      // Set the recommendation
      setRecommendation(prediction);

      const reviewData = {
        title: reviewTitle,
        description: reviewText,
        rating: prediction, // Use the model's prediction as the recommendation
      };

      // Send POST request to submit review for the specific product
      await axios.post(`/api/products/${productId}/review`, reviewData);
      alert('Review successfully added!');

      // Reset form fields
      setReviewTitle('');
      setReviewText('');
      setRecommendation(null);
      setFeedbackMessage('');

    } catch (error) {
      console.error(error);
      alert('Failed to submit the review.');
    } finally {
      setLoading(false);
    }
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
      {feedbackMessage && <p className="error-message">{feedbackMessage}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
