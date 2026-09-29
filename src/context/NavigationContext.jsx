import React, { createContext, useContext, useState } from 'react';
import { QUICK_ACCESS_ITEMS } from '../data/mockData';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState('login');
  const [history, setHistory] = useState(['login']);

  // Selected navigation destination
  const [selectedDestination, setSelectedDestination] = useState(QUICK_ACCESS_ITEMS[0]);
  
  // Navigation method ('manual' or 'voice')
  const [navMethod, setNavMethod] = useState('manual');

  // Route progression (step 0 to 85)
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // starts at step 34 as shown in figma

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'help' | 'report-obstacle' | 'manual-location'

  // User Profile
  const [userProfile, setUserProfile] = useState({
    email: 'student@campus.edu',
    profileType: 'Wheelchair', // 'Wheelchair' | 'Visually Imp.' | 'Standard'
    isLoggedIn: false
  });

  const navigateTo = (screen) => {
    setHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('destination-selection');
    }
  };

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const startNavigationTo = (dest) => {
    setSelectedDestination(dest);
    navigateTo('navigation-method');
  };

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        navigateTo,
        goBack,
        selectedDestination,
        setSelectedDestination,
        startNavigationTo,
        navMethod,
        setNavMethod,
        currentStepIndex,
        setCurrentStepIndex,
        activeModal,
        openModal,
        closeModal,
        userProfile,
        setUserProfile
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
