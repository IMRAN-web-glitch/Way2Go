import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { AlertTriangleIcon } from '../Icons/Icons';
import './ReportObstacleModal.css';

export const ReportObstacleModal = () => {
  const { activeModal, closeModal, selectedDestination } = useNavigation();
  const [obstacleType, setObstacleType] = useState('Elevator Out of Service');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (activeModal !== 'report-obstacle') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeModal();
    }, 1600);
  };

  return (
    <div className="modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
      <div className="modal-card obstacle-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-badge obstacle">
            <AlertTriangleIcon size={24} color="#ea580c" />
          </div>
          <h2 className="modal-title serif-heading">Report an Obstacle</h2>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close">
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="obstacle-success-view">
            <div className="success-icon">✓</div>
            <h3>Obstacle Flagged</h3>
            <p>Thank you! Campus Facilities and routing algorithms have been updated to divert accessible paths away from this area.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <p className="obstacle-desc">
              Flag physical barriers or broken accessibility equipment along your route to update real-time navigation for all students.
            </p>

            <div className="form-group">
              <label htmlFor="obstacle-location">Location</label>
              <input
                id="obstacle-location"
                type="text"
                className="modal-input"
                defaultValue={selectedDestination ? `${selectedDestination.title} Corridor` : 'Library — Ground Floor'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="obstacle-type">Type of Obstacle</label>
              <select
                id="obstacle-type"
                className="modal-select"
                value={obstacleType}
                onChange={(e) => setObstacleType(e.target.value)}
              >
                <option value="Elevator Out of Service">🛗 Elevator Out of Service</option>
                <option value="Construction or Barrier">🚧 Construction or Blocked Hallway</option>
                <option value="Broken Automatic Door">🚪 Broken Automatic Sensor Door</option>
                <option value="Wet Floor or Slippery Surface">⚠️ Wet Floor / Slippery Surface</option>
                <option value="Steep Ramp or Steps">🪜 Unexpected Steps / Inaccessible Incline</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="obstacle-details">Additional Notes (Optional)</label>
              <textarea
                id="obstacle-details"
                className="modal-textarea"
                rows="3"
                placeholder="e.g. Yellow caution tape blocking elevator door"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div className="modal-footer modal-actions-row">
              <button type="button" className="modal-action-btn cancel" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="modal-action-btn submit">
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

