import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { HelpCircleIcon } from '../../Icons/Icons';
import { ROUTE_STEPS } from '../../../data/mockData';
import { GoogleMapsNav } from './GoogleMapsNav';
import './RouteNavigation.css';
import './GoogleMapsNav.css';

export const RouteNavigation = () => {
  const { navigateTo, openModal, selectedDestination } = useNavigation();
  const { voiceGuidance, setVoiceGuidance, speakText } = useAccessibility();

  // Pedometer state
  const [stepCount, setStepCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const lastStepTimeRef = React.useRef(0);

  // Active step index along the route
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const currentStep = ROUTE_STEPS[activeStepIdx] || ROUTE_STEPS[0];

  // Speak directions whenever step changes if voice guidance is enabled
  useEffect(() => {
    if (voiceGuidance) {
      speakText(`${currentStep.instruction}. ${currentStep.subInstruction}. Step ${currentStep.stepIndex} of ${currentStep.totalSteps}.`);
    }
  }, [activeStepIdx, voiceGuidance]);

  // Handle exiting or completing navigation
  const handleStopNavigation = (target) => {
    if (target === 'destination-reached') {
      navigateTo('destination-reached');
      return;
    }
    if (window.confirm('Are you sure you want to cancel the current navigation route?')) {
      speakText('Navigation cancelled.');
      navigateTo('destination-selection');
    }
  };

  // Pedometer logic
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

  useEffect(() => {
    setIsCounting(true);
  }, []);

  return (
    <div className="route-screen-container gmaps-layout-container">
      {/* Top Status Header Bar */}
      <header className="route-header-bar">
        <div className="route-metric-group">
          <span className="route-metric-label">Campus Navigation</span>
          <span className="route-metric-value">
            {selectedDestination?.title || 'Main Library Block'}
          </span>
        </div>

        <div className="route-metric-group">
          <span className="route-metric-label">Route Status</span>
          <span className="route-metric-value gmaps-status-live">● Live GPS</span>
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

      {/* Google Maps Style Navigation Screen */}
      <GoogleMapsNav
        activeStepIdx={activeStepIdx}
        setActiveStepIdx={setActiveStepIdx}
        routeSteps={ROUTE_STEPS}
        currentStep={currentStep}
        voiceGuidance={voiceGuidance}
        setVoiceGuidance={setVoiceGuidance}
        speakText={speakText}
        stepCount={stepCount}
        onStopNavigation={handleStopNavigation}
      />
    </div>
  );
};

export default RouteNavigation;
