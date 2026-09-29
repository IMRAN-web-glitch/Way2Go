import React, { useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import {
  CheckIcon,
  StarIcon,
  AlertTriangleIcon,
  ChevronRightIcon
} from '../../Icons/Icons';
import './DestinationReached.css';

export const DestinationReached = () => {
  const { navigateTo, openModal, selectedDestination } = useNavigation();
  const { speakText } = useAccessibility();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratedToast, setRatedToast] = useState(false);

  const handleRate = (star) => {
    setRating(star);
    setRatedToast(true);
    speakText(`Thank you for rating the accessibility ${star} out of 5 stars.`);
    setTimeout(() => setRatedToast(false), 2500);
  };

  const handleBackHome = () => {
    navigateTo('destination-selection');
  };

  return (
    <div className="reached-screen-container">
      <div className="reached-content-card">
        {/* Success Icon Badge */}
        <div className="reached-badge-circle">
          <CheckIcon size={46} color="#15803D" />
        </div>

        {/* Arrival Titles */}
        <div className="reached-titles-group">
          <h1 className="reached-main-title serif-heading">
            You have arrived!
          </h1>
          <p className="reached-destination-name">
            {selectedDestination?.title || 'Library'} — {selectedDestination?.subtitle?.split('—')[0] || 'Ground Floor'}
          </p>
          <p className="reached-stats-line">
            {selectedDestination?.steps || 85} steps completed successfully
          </p>
        </div>

        {/* Rating Card */}
        <div className="reached-rating-card">
          <h2 className="reached-card-title">
            Rate the accessibility of this route
          </h2>
          <div className="stars-row" role="radiogroup" aria-label="Accessibility Rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="star-btn"
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${star} star`}
              >
                <StarIcon
                  size={32}
                  filled={(hoverRating || rating) >= star}
                  color="#7B2837"
                />
              </button>
            ))}
          </div>

          {ratedToast && (
            <p className="rating-feedback-toast">
              ✓ Rating saved! Thank you for contributing to campus accessibility.
            </p>
          )}
        </div>

        {/* Report Obstacle Card */}
        <button
          className="reached-obstacle-card"
          onClick={() => openModal('report-obstacle')}
          aria-label="Report an Obstacle"
        >
          <div className="obstacle-icon-box">
            <AlertTriangleIcon size={22} color="#7B2837" />
          </div>
          <div className="obstacle-text-info">
            <h3 className="obstacle-title">Report an Obstacle</h3>
            <p className="obstacle-sub">
              Help others by flagging construction or barriers
            </p>
          </div>
          <div className="obstacle-arrow">
            <ChevronRightIcon size={20} color="#64748B" />
          </div>
        </button>
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="reached-bottom-action-area">
        <button
          className="reached-home-button"
          onClick={handleBackHome}
        >
          Back to Home
        </button>

        {/* <div className="home-indicator-bar" /> */}
      </div>
    </div>
  );
};

