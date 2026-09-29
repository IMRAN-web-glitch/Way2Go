import React, { useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import {
  ArrowLeftIcon,
  Volume2Icon,
  WheelchairIcon,
  ChevronDownIcon
} from '../../Icons/Icons';
import './SettingsProfile.css';

export const SettingsProfile = () => {
  const { goBack } = useNavigation();
  const {
    voiceGuidance,
    setVoiceGuidance,
    highContrast,
    setHighContrast,
    textScale,
    setTextScale,
    routingProfile,
    setRoutingProfile,
    speakText
  } = useAccessibility();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const routingOptions = [
    'Wheelchair Accessible',
    'Standard Walking',
    'Visually Impaired Assisted',
    'Avoid Stairs & Escalators'
  ];

  const handleVoiceToggle = (checked) => {
    setVoiceGuidance(checked);
    if (checked) {
      speakText('Voice guidance is now turned on');
    }
  };

  const handleHighContrastToggle = (checked) => {
    setHighContrast(checked);
    if (voiceGuidance) {
      speakText(checked ? 'High contrast mode enabled' : 'High contrast mode disabled');
    }
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setTextScale(val);
  };

  const handleSelectRouting = (option) => {
    setRoutingProfile(option);
    setIsDropdownOpen(false);
    if (voiceGuidance) {
      speakText(`Default routing profile set to ${option}`);
    }
  };

  return (
    <div className="settings-screen-container">
      {/* Top Header */}
      <header className="settings-header">
        <button
          className="settings-back-btn"
          onClick={goBack}
          aria-label="Back"
        >
          <ArrowLeftIcon size={20} color="#1D273A" />
          <span className="settings-back-text">Back</span>
        </button>
        <h1 className="settings-header-title serif-heading">
          Accessibility Settings
        </h1>
      </header>

      {/* Settings Scrollable Content */}
      <div className="settings-scroll-body">
        {/* Section 1: Feedback Preferences */}
        <section className="settings-section">
          <h2 className="settings-section-title serif-heading">
            Feedback Preferences
          </h2>

          <div className="settings-cards-list">
            {/* Voice Guidance Toggle */}
            <div className="settings-item-card">
              <div className="settings-item-left">
                <div className="settings-icon-circle">
                  <Volume2Icon size={20} color="#1D273A" />
                </div>
                <span className="settings-item-label">Voice Guidance</span>
              </div>

              <label className="toggle-switch" aria-label="Toggle Voice Guidance">
                <input
                  type="checkbox"
                  checked={voiceGuidance}
                  onChange={(e) => handleVoiceToggle(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="settings-item-card">
              <div className="settings-item-left">
                <div className="settings-icon-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D273A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3v18" />
                    <path d="M12 3a9 9 0 0 1 0 18z" fill="#1D273A" />
                  </svg>
                </div>
                <span className="settings-item-label">High Contrast Mode</span>
              </div>

              <label className="toggle-switch" aria-label="Toggle High Contrast Mode">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => handleHighContrastToggle(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </section>

        {/* Section 2: Text Size Adjustment */}
        <section className="settings-section">
          <h2 className="settings-section-title serif-heading">
            Text Size Adjustment
          </h2>

          <div className="settings-slider-card">
            <div className="slider-labels-row">
              <span className="slider-label-small">A</span>
              <span className="slider-label-large">A</span>
            </div>

            <div className="slider-track-wrapper">
              <input
                type="range"
                min="0.85"
                max="1.35"
                step="0.05"
                value={textScale}
                onChange={handleSliderChange}
                className="text-size-range-input"
                aria-label="Adjust text size scale"
              />
            </div>
            <p className="slider-scale-indicator">
              Current Text Scale: <strong>{Math.round(textScale * 100)}%</strong>
            </p>
          </div>
        </section>

        {/* Section 3: Default Routing Profile */}
        <section className="settings-section">
          <h2 className="settings-section-title serif-heading">
            Default Routing Profile
          </h2>

          <div className="dropdown-container">
            <button
              type="button"
              className="settings-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <div className="settings-item-left">
                <div className="settings-icon-circle">
                  <WheelchairIcon size={20} color="#1D273A" />
                </div>
                <span className="settings-dropdown-value">{routingProfile}</span>
              </div>
              <div className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`}>
                <ChevronDownIcon size={20} color="#1D273A" />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="settings-dropdown-menu" role="listbox">
                {routingOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`dropdown-item ${routingProfile === opt ? 'selected' : ''}`}
                    onClick={() => handleSelectRouting(opt)}
                    role="option"
                    aria-selected={routingProfile === opt}
                  >
                    <span>{opt}</span>
                    {routingProfile === opt && <span className="dropdown-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

