import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { LoginScreen } from '../Screens/LoginScreen/LoginScreen';
import { DestinationSelection } from '../Screens/DestinationSelection/DestinationSelection';
import { NavigationMethod } from '../Screens/NavigationMethod/NavigationMethod';
import { RouteNavigation } from '../Screens/RouteNavigation/RouteNavigation';
import { DestinationReached } from '../Screens/DestinationReached/DestinationReached';
import { SettingsProfile } from '../Screens/SettingsProfile/SettingsProfile';
import { BottomNav } from '../Navigation/BottomNav';
import { HelpModal } from '../Modals/HelpModal';
import { ReportObstacleModal } from '../Modals/ReportObstacleModal';
import { ManualLocationModal } from '../Modals/ManualLocationModal';
import { CameraScan } from '../Screens/CameraScan/CameraScan';
import './ResponsiveFrame.css';
 
export const ResponsiveFrame = () => {
  const { currentScreen } = useNavigation();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen />;
      case 'destination-selection':
        return <DestinationSelection />;
      case 'navigation-method':
        return <NavigationMethod />;
      case 'route-navigation':
        return <RouteNavigation />;
      case 'destination-reached':
        return <DestinationReached />;
      case 'settings':
        return <SettingsProfile />;
      case 'camerascan':
        return <CameraScan />;
      default:
        return <DestinationSelection />;
    }
  };

  return (
    <div className="responsive-outer-container">
      <main className="app-device-wrapper">
        <div className="app-screen-viewport">
          {renderActiveScreen()}
        </div>
        <BottomNav />
      </main>

      <HelpModal />
      <ReportObstacleModal />
      <ManualLocationModal />
    </div>
  );
};
