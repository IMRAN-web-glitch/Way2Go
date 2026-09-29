import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import {
  HelpCircleIcon,
  TurnLeftIcon,
  TurnRightIcon,
  StraightIcon,
  Volume2Icon,
  CheckIcon
} from '../../Icons/Icons';
import { ROUTE_STEPS } from '../../../data/mockData';
import './RouteNavigation.css';

export const RouteNavigation = () => {
  const { navigateTo, openModal, selectedDestination, currentStepIndex, setCurrentStepIndex } = useNavigation();
  const { voiceGuidance, setVoiceGuidance, speakText } = useAccessibility();
  // Pedometer state
  const [stepCount, setStepCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const lastStepTimeRef = React.useRef(0);
  // Local step index in the simulated steps array (default 2 -> Step 34)
  const [activeStepIdx, setActiveStepIdx] = useState(2);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);

  const currentStep = ROUTE_STEPS[activeStepIdx] || ROUTE_STEPS[0];

  // Speak directions whenever step changes if voice guidance is enabled
  useEffect(() => {
    if (voiceGuidance) {
      speakText(`${currentStep.instruction}. ${currentStep.subInstruction}. Step ${currentStep.stepIndex} of ${currentStep.totalSteps}.`);
    }
  }, [activeStepIdx, voiceGuidance]);

  // Simulated walking auto-progression
  useEffect(() => {
    let interval = null;
    if (isSimulatingWalk) {
      interval = setInterval(() => {
        setActiveStepIdx((prev) => {
          if (prev < ROUTE_STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsSimulatingWalk(false);
            navigateTo('destination-reached');
            return prev;
          }
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isSimulatingWalk]);

  const handleNextStep = () => {
    if (activeStepIdx < ROUTE_STEPS.length - 1) {
      setActiveStepIdx((prev) => prev + 1);
    } else {
      navigateTo('destination-reached');
    }
  };

  const handlePrevStep = () => {
    if (activeStepIdx > 0) {
      setActiveStepIdx((prev) => prev - 1);
    }
  };

  const handleStopNavigation = () => {
    if (window.confirm('Are you sure you want to cancel the current navigation route?')) {
      speakText('Navigation cancelled.');
      navigateTo('destination-selection');
    }
  };

  // Pedometer logic (reuse from NavigationMethod)
  const motionHandler = (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    const { x = 0, y = 0, z = 0 } = acc;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();
    if (magnitude > 12 && now - lastStepTimeRef.current > 300) {
      setStepCount((c) => c + 1);
      lastStepTimeRef.current = now;
    }
  };

  useEffect(() => {
    if (isCounting) {
      window.addEventListener('devicemotion', motionHandler);
      return () => {
        window.removeEventListener('devicemotion', motionHandler);
      };
    }
  }, [isCounting]);

  // Auto‑start pedometer on mount
  useEffect(() => {
    setIsCounting(true);
  }, []);

  // Get directional icon based on current step
  const renderTurnIcon = () => {
    switch (currentStep.turnType) {
      case 'turn-left':
        return <TurnLeftIcon size={28} color="#7B2837" />;
      case 'turn-right':
        return <TurnRightIcon size={28} color="#7B2837" />;
      case 'arrived':
        return <CheckIcon size={28} color="#16A34A" />;
      default:
        return <StraightIcon size={28} color="#7B2837" />;
    }
  };

  return (
    <div className="route-screen-container">
      {/* Top Navy Metric Header Bar */}
      <header className="route-header-bar">
        <div className="route-metric-group">
          <span className="route-metric-label">Remaining</span>
          <span className="route-metric-value">
            {currentStep.remainingDistance} • {currentStep.remainingTime}
          </span>
        </div>

        <div className="route-metric-group">
          <span className="route-metric-label">Total Journey</span>
          <span className="route-metric-value">{currentStep.totalSteps} steps</span>
        </div>

        <button
          className="route-help-btn"
          onClick={() => openModal('help')}
          aria-label="Help and Info"
          title="Emergency Assist & Help"
        >
          <HelpCircleIcon size={22} color="#FFFFFF" />
        </button>
      </header>

      {/* Main Scrollable Navigation Body */}
      <div className="route-scroll-body">
        {/* Turn Direction Card */}
        <div className="route-turn-card">
          <div className={`turn-icon-box ${currentStep.turnType === 'arrived' ? 'success' : ''}`}>
            {renderTurnIcon()}
          </div>
          <div className="turn-text-info">
            <h2 className="turn-instruction-title serif-heading">
              {currentStep.instruction}
            </h2>
            <p className="turn-step-count">
              Step {currentStep.stepIndex} of {currentStep.totalSteps}
            </p>
          </div>
        </div>

        {/* Floor Map Path Section */}
        <section className="floor-map-section">
          <div className="floor-map-header-row">
            <h3 className="floor-map-title serif-heading">Floor Map Path</h3>
            <span className="floor-badge-tag">
              {currentStep.floor}
            </span>
          </div>

          {/* Interactive Architectural Blueprint Floor Plan */}
          <div className="blueprint-map-card">
            <svg
              className="blueprint-svg"
              viewBox="0 0 400 280"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Architectural Wall */}
              <rect x="30" y="20" width="340" height="235" fill="#ffffff" stroke="#1d4ed8" strokeWidth="4" rx="4" />

              {/* Interior Room Partitions */}
              <line x1="160" y1="20" x2="160" y2="120" stroke="#1e40af" strokeWidth="2.5" />
              <line x1="240" y1="20" x2="240" y2="120" stroke="#1e40af" strokeWidth="2.5" />
              <line x1="30" y1="120" x2="180" y2="120" stroke="#1e40af" strokeWidth="2.5" />
              <line x1="220" y1="120" x2="370" y2="120" stroke="#1e40af" strokeWidth="2.5" />

              {/* Central Hallway & Rooms */}
              <rect x="180" y="70" width="40" height="48" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
              <rect x="80" y="165" width="80" height="45" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
              <line x1="80" y1="180" x2="160" y2="180" stroke="#93c5fd" strokeWidth="1" />
              <line x1="80" y1="195" x2="160" y2="195" stroke="#93c5fd" strokeWidth="1" />

              {/* Staircases / Elevators symbol */}
              <g stroke="#60a5fa" strokeWidth="1.2">
                <line x1="185" y1="80" x2="215" y2="80" />
                <line x1="185" y1="88" x2="215" y2="88" />
                <line x1="185" y1="96" x2="215" y2="96" />
                <line x1="185" y1="104" x2="215" y2="104" />
              </g>

              {/* Room Text Labels */}
              <text x="60" y="45" fill="#1e3a8a" fontSize="9" fontWeight="600" fontFamily="sans-serif">BRAP HM</text>
              <text x="185" y="45" fill="#1e3a8a" fontSize="8" fontWeight="600" fontFamily="sans-serif">ELEV</text>
              <text x="275" y="45" fill="#1e3a8a" fontSize="9" fontWeight="600" fontFamily="sans-serif">NADCAT</text>
              <text x="155" y="145" fill="#3b82f6" fontSize="8" fontWeight="bold" fontFamily="sans-serif">GROUND CORRIDOR</text>
              <text x="75" y="235" fill="#1e3a8a" fontSize="9" fontWeight="600" fontFamily="sans-serif">GROUND FLOOR</text>
              <text x="260" y="225" fill="#1e3a8a" fontSize="9" fontWeight="600" fontFamily="sans-serif">AUDITORY</text>

              {/* Room 204 marker */}
              <rect x="145" y="105" width="28" height="15" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" rx="2" />
              <text x="148" y="116" fill="#991b1b" fontSize="7" fontWeight="bold" fontFamily="sans-serif">204</text>

              {/* Dotted Red Turn-by-Turn Route Line */}
              <path
                d="M 60 50 L 150 50 L 150 145 L 310 145"
                fill="none"
                stroke="#dc2626"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                className="animated-route-line"
              />

              {/* Origin Marker (Point A) */}
              <circle cx="60" cy="50" r="12" fill="#1e3a8a" />
              <text x="60" y="54" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">A</text>
              <text x="40" y="42" fill="#1e3a8a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">START</text>

              {/* Animated Current User Position Marker */}
              <g transform={`translate(${
                activeStepIdx === 0 ? '60, 50' :
                activeStepIdx === 1 ? '110, 50' :
                activeStepIdx === 2 ? '150, 95' :
                activeStepIdx === 3 ? '150, 145' :
                activeStepIdx === 4 ? '230, 145' : '310, 145'
              })`}>
                <circle cx="0" cy="0" r="16" fill="#fee2e2" opacity="0.6">
                  <animate attributeName="r" values="12;20;12" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="8" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
              </g>

              {/* Destination Marker (Point B) */}
              <circle cx="310" cy="145" r="12" fill="#1e3a8a" />
              <text x="310" y="149" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">B</text>
              <text x="326" y="140" fill="#1e3a8a" fontSize="8" fontWeight="bold" fontFamily="sans-serif">USER LOCATION</text>
              <text x="326" y="152" fill="#64748b" fontSize="8" fontFamily="sans-serif">B (Destination)</text>
            </svg>
          </div>
        </section>

        {/* Interactive Step Simulator Controls */}
        <div className="route-sim-controls">
          <div className="sim-buttons-group">
            <button
              className="sim-btn secondary"
              onClick={handlePrevStep}
              disabled={activeStepIdx === 0}
              aria-label="Previous step"
            >
              ← Prev
            </button>

            <button
              className={`sim-btn ${isSimulatingWalk ? 'active' : 'primary'}`}
              onClick={() => setIsSimulatingWalk(!isSimulatingWalk)}
            >
              {isSimulatingWalk ? '⏸ Pause Walk' : '🚶 Simulate Walk'}
            </button>

            <button
              className="sim-btn secondary"
              onClick={handleNextStep}
              aria-label="Next step"
            >
              {activeStepIdx < ROUTE_STEPS.length - 1 ? 'Next →' : 'Arrive ✓'}
            </button>
          </div>
        </div>

        {/* Voice Assist Toggle Card */}
        <div className="voice-assist-card">
          <div className="voice-assist-info">
            <span className="voice-assist-icon">
              <Volume2Icon size={22} color="#7B2837" />
            </span>
            <span className="voice-assist-label">Voice Assist</span>
          </div>

          <label className="toggle-switch" aria-label="Toggle Voice Assist">
            <input
              type="checkbox"
              checked={voiceGuidance}
              onChange={(e) => {
                setVoiceGuidance(e.target.checked);
                if (e.target.checked) {
                  speakText('Voice assistance enabled');
                }
              }}
            />
            <span className="toggle-slider" />
          </label>
            <p className="step-count">Steps taken: {stepCount}</p>
        </div>

        {/* Stop Navigation Button */}
        <button
          className="stop-nav-button"
          onClick={handleStopNavigation}
        >
          Stop Navigation
        </button>

        {/* <div className="home-indicator-bar" /> */}
      </div>
    </div>
  );
};

