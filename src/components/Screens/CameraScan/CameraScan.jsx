import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { ArrowLeftIcon, CheckIcon } from '../../Icons/Icons';
import './CameraScan.css';

export const CameraScan = () => {
  const { navigateTo, goBack, openModal, selectedDestination } = useNavigation();
  const { speakText } = useAccessibility();
  const videoRef = useRef(null);

  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize camera or fallback
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCamera(true);
            // Some browsers need an explicit play call even with autoPlay enabled.
            await videoRef.current.play().catch(() => {});
          }
        } else {
          setCameraError('Camera API unavailable in this browser');
        }
      } catch (err) {
        console.log('Webcam permission not granted or unavailable, using simulation view:', err.message);
        setCameraError(err.message);
        setHasCamera(false);
      }
    };

    startCamera();

    // Trigger tag lock after 1.5s
    const lockTimer = setTimeout(() => {
      setIsLocked(true);
      speakText('AprilTag 47 detected. Library Entry Floor locked. Ready to navigate.');
    }, 1500);

    return () => {
      clearTimeout(lockTimer);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartRoute = () => {
    navigateTo('route-navigation');
  };

  return (
    <div className="camera-screen-container">
      {/* Dark Navy Top Header */}
      <header className="camera-header">
        <button
          className="camera-back-btn"
          onClick={goBack}
          aria-label="Back to navigation methods"
        >
          <ArrowLeftIcon size={20} color="#FFFFFF" />
        </button>
        <h1 className="camera-title serif-heading">Floor AprilTag Scan</h1>
        <div className="camera-header-spacer" />
      </header>

      {/* Black Subheader Instruction Banner */}
      <div className="camera-instruction-banner">
        <span>Point camera DOWNWARD at the floor tile marker</span>
      </div>

      {/* Viewfinder Area */}
      <div className="camera-viewfinder-area">
        {/* Keep the video mounted from the first render so the camera stream can attach to it. */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-live-video"
        />

        {!hasCamera && (
          /* Simulated Floor Tiles Background (Figma matching) */
          <div className="camera-simulated-floor">
            <div className="simulated-tile-grid" />
            <div className="simulated-light-glare" />
          </div>
        )}

        {/* Scan Reticle & AprilTag Marker */}
        <div className="camera-reticle-box">
          {/* Scanning radar line */}
          <div className="camera-scan-line" />

          {/* Center AprilTag Target */}
          <div className={`camera-apriltag-marker ${isLocked ? 'locked' : ''}`}>
            {/* AprilTag matrix pattern representation */}
            <div className="apriltag-pattern">
              <div className="tag-pixel p1" />
              <div className="tag-pixel p2" />
              <div className="tag-pixel p3" />
              <div className="tag-pixel p4" />
            </div>

            {/* Centered Green Checkmark Badge when locked */}
            {isLocked && (
              <div className="tag-lock-badge" title="Tag 47 Locked">
                <CheckIcon size={28} color="#FFFFFF" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Dark Sheet with Tag Lock Status */}
      <div className="camera-bottom-sheet">
        <div className="camera-tag-status">
          <span className={`status-indicator-dot ${isLocked ? 'active' : 'scanning'}`} />
          <span className="status-tag-text">
            {isLocked ? 'Tag 47 Lock: Library Entry Floor' : 'Scanning floor markers...'}
          </span>
        </div>

        {isLocked && (
          <button
            className="camera-proceed-btn"
            onClick={handleStartRoute}
          >
            Start Route to {selectedDestination?.title || 'Library'} →
          </button>
        )}

        <div className="camera-manual-fallback">
          <button
            type="button"
            className="camera-manual-link"
            onClick={() => openModal('manual-location')}
          >
            Select location manually
          </button>
          <span className="camera-fallback-subtext">If marker cannot be detected</span>
        </div>

        {/* <div className="home-indicator-bar camera-indicator" /> */}
      </div>
    </div>
  );
};
