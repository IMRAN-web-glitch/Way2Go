import React, { useState } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { MailIcon, LockIcon } from '../../Icons/Icons';
import './LoginScreen.css';

export const LoginScreen = () => {
  const { navigateTo, userProfile, setUserProfile } = useNavigation();
  const [email, setEmail] = useState(userProfile.email || 'student@campus.edu');
  const [password, setPassword] = useState('password123');
  const [selectedProfile, setSelectedProfile] = useState(userProfile.profileType || 'Wheelchair');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your college email address');
      return;
    }
    setUserProfile({
      email,
      profileType: selectedProfile,
      isLoggedIn: true
    });
    navigateTo('destination-selection');
  };

  return (
    <div className="login-screen-container">
      {/* Top Navy Branding Header */}
      <div className="login-header-area">
        <h1 className="login-brand-logo serif-heading">Way2Go</h1>
      </div>

      {/* Bottom Sheet Modal Form */}
      <div className="login-sheet-card">
        <h2 className="login-sheet-title serif-heading">Sign In</h2>

        {errorMessage && (
          <div className="login-error-toast" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          {/* Email input */}
          <div className="login-input-group">
            <label className="login-input-label" htmlFor="login-email">
              Email Address
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
                <MailIcon size={18} color="#475569" />
              </span>
              <input
                id="login-email"
                type="email"
                className="login-input-field"
                placeholder="Enter your college email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="login-input-group">
            <label className="login-input-label" htmlFor="login-password">
              Password
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
                <LockIcon size={18} color="#475569" />
              </span>

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="login-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Accessibility Profile Segmented Control */}
          <div className="login-input-group">
            <label className="login-input-label">
              Accessibility Profile
            </label>
            <div className="accessibility-segmented-control" role="radiogroup">
              {['Wheelchair', 'Visually Imp.', 'Standard'].map((profile) => (
                <button
                  key={profile}
                  type="button"
                  role="radio"
                  aria-checked={selectedProfile === profile}
                  className={`segmented-tab ${selectedProfile === profile ? 'active' : ''}`}
                  onClick={() => setSelectedProfile(profile)}
                >
                  {profile}
                </button>
              ))}
            </div>
          </div>

          {/* Burgundy Log In Button */}
          <button type="submit" className="login-submit-button">
            Log In
          </button>
        </form>

        {/* <div className="home-indicator-bar" /> */}
      </div>
    </div>
  );
};

