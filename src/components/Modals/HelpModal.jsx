import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { HelpCircleIcon, SearchIcon, WheelchairIcon } from '../Icons/Icons';
import './HelpModal.css';

export const HelpModal = () => {
  const { activeModal, closeModal } = useNavigation();

  if (activeModal !== 'help') return null;

  return (
    <div className="modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-badge">
            <HelpCircleIcon size={24} color="#7B2837" />
          </div>
          <h2 className="modal-title serif-heading">Way2Go Help & Guide</h2>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="help-section">
            <div className="help-item">
              <div className="help-item-icon">
                <SearchIcon size={20} color="#7B2837" />
              </div>
              <div className="help-item-text">
                <h3>Set Your Starting Location</h3>
                <p>Select your building, floor, and nearest landmark before starting a route.</p>
              </div>
            </div>

            <div className="help-item">
              <div className="help-item-icon">
                <WheelchairIcon size={20} color="#7B2837" />
              </div>
              <div className="help-item-text">
                <h3>Wheelchair & Accessible Routing</h3>
                <p>All routes prioritize flat walkways, automated elevators, and compliant ramps while bypassing stairs and narrow construction zones.</p>
              </div>
            </div>
          </div>

          <div className="help-emergency-box">
            <h4>Need Campus Security Escort?</h4>
            <p>If you encounter an obstacle or require physical assistance, call campus accessibility dispatch:</p>
            <button className="help-call-btn" onClick={() => alert('Dialing Campus Accessibility Assistance: (555) 019-2834')}>
              📞 Call Security Dispatch
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-action-btn primary" onClick={closeModal}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
