import React from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { NavigationProvider } from './context/NavigationContext';
import { ResponsiveFrame } from './components/Layout/ResponsiveFrame';
import './App.css';

export function App() {
  return (
    <AccessibilityProvider>
      <NavigationProvider>
        <div className="app-root-container">
          <ResponsiveFrame />
        </div>
      </NavigationProvider>
    </AccessibilityProvider>
  );
}

export default App;

