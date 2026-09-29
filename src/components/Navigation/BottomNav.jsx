import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { HomeIcon, SearchIcon, SettingsIcon,CameraIcon } from '../Icons/Icons';
import './BottomNav.css';

export const BottomNav = () => {
  const { currentScreen, navigateTo } = useNavigation();

  // Don't show bottom nav on Login or the full-screen route navigation view.
  if (currentScreen === 'login' || currentScreen === 'route-navigation') {
    return null;
  }

  return (
    <nav className="bottom-nav-container" aria-label="Bottom Navigation">
      <div className="bottom-nav-bar">
        <button
          className={`bottom-nav-item ${currentScreen === 'destination-selection' ? 'active' : ''}`}
          onClick={() => navigateTo('destination-selection')}
          aria-label="Home"
        >
          <div className="bottom-nav-icon">
            <HomeIcon size={24} />
          </div>
          <span className="bottom-nav-label">Home</span>
        </button>

        <button
          className={`bottom-nav-item ${currentScreen === 'navigation-method' ? 'active' : ''}`}
          onClick={() => navigateTo('navigation-method')}
          aria-label="Search"
        >
          <div className="bottom-nav-icon">
            <SearchIcon size={24} />
          </div>
          <span className="bottom-nav-label">Search</span>
        </button>
        <button
          className={`bottom-nav-item ${currentScreen === 'camerascan' ? 'active' : ''}`}
          onClick={() => navigateTo('camerascan')}
          aria-label="Search"
        >
          <div className="bottom-nav-icon">
            <CameraIcon size={24} />
          </div>
          <span className="bottom-nav-label">camerascan</span>
        </button>

        <button
          className={`bottom-nav-item ${currentScreen === 'settings' ? 'active' : ''}`}
          onClick={() => navigateTo('settings')}
          aria-label="Settings"
        >
          <div className="bottom-nav-icon">
            <SettingsIcon size={24} />
          </div>
          <span className="bottom-nav-label">Settings</span>
        </button>
      </div>

      {/* <div className="home-indicator-bar" /> */}
    </nav>
  );
};
