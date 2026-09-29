import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState(1.0); // 0.85 to 1.3
  const [routingProfile, setRoutingProfile] = useState('Wheelchair Accessible');

  // Toggle high contrast theme on body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('theme-high-contrast');
    } else {
      document.body.classList.remove('theme-high-contrast');
    }
  }, [highContrast]);

  // Adjust root font scale
  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-scale', textScale.toString());
  }, [textScale]);

  // Text-to-speech narration
  const speakText = (text) => {
    if (!voiceGuidance || typeof window === 'undefined') return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis not available', e);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        voiceGuidance,
        setVoiceGuidance,
        highContrast,
        setHighContrast,
        textScale,
        setTextScale,
        routingProfile,
        setRoutingProfile,
        speakText
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

