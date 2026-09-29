import React from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import {
  SearchIcon,
  MicIcon,
  HelpCircleIcon
} from '../../Icons/Icons';
import './NavigationMethod.css';

export const NavigationMethod = () => {



  const { navigateTo, navMethod, setNavMethod, openModal, selectedDestination } = useNavigation();
  const { speakText } = useAccessibility();

  const handleSelectMethod = (method) => {
    // Existing method selection logic remains unchanged
    setNavMethod(method);

    if (method === 'manual') {
      speakText('Select starting location manually');
      openModal('manual-location');
    } else if (method === 'voice') {
      speakText('Voice command activated. What is your current room or landmark?');
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SpeechRecognition();
        rec.onresult = (e) => {
          const loc = e.results[0][0].transcript;
          speakText(`Starting navigation from ${loc} to ${selectedDestination?.title || 'destination'}`);
          navigateTo('route-navigation');
        };
        rec.start();
      } else {
        setTimeout(() => {
          navigateTo('route-navigation');
        }, 1200);
      }
    }
  };




  return (
    <div className="nav-method-container">
      {/* Top Header */}
      <header className="nav-method-header">
        <h1 className="nav-method-logo serif-heading">Way2Go</h1>
        <button
          className="nav-method-help-btn"
          onClick={() => openModal('help')}
          aria-label="Help & Guide"
          title="Help & Info"
        >
          <HelpCircleIcon size={22} color="#1D273A" />
        </button>
      </header>

      {/* Main Content */}
      <div className="nav-method-body">
        <div className="nav-method-title-group">
          <h2 className="nav-method-title serif-heading">
            How would you like to navigate?
          </h2>
          {selectedDestination && (
            <p className="nav-method-destination-pill">
              Destination: <strong>{selectedDestination.title}</strong>
            </p>
          )}
          {/* Step count display */}
          <p className="step-count">Steps taken: {stepCount}</p>
        </div>

        <div className="nav-method-options-list">
          {/* Option 1: Enter Manually */}
          <button
            className={`nav-method-card ${navMethod === 'manual' ? 'selected' : ''}`}
            onClick={() => handleSelectMethod('manual')}
          >
            <div className="nav-method-icon-circle grey">
              <SearchIcon size={22} color="#1D273A" />
            </div>
            <div className="nav-method-text">
              <h3 className="nav-method-card-title">Enter Manually</h3>
              <p className="nav-method-card-sub">Type or select your location</p>
            </div>
          </button>

          {/* Option 2: Voice Command */}
          <button
            className={`nav-method-card ${navMethod === 'voice' ? 'selected' : ''}`}
            onClick={() => handleSelectMethod('voice')}
          >
            <div className="nav-method-icon-circle grey">
              <MicIcon size={22} color="#1D273A" />
            </div>
            <div className="nav-method-text">
              <h3 className="nav-method-card-title">Voice Command</h3>
              <p className="nav-method-card-sub">Say your current location</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};






// stray cleanup removed

