import React, { useState, useRef, useEffect } from 'react';
import userGraph from '../../../data/userFloorGraph.json';
import {
  TurnLeftIcon,
  TurnRightIcon,
  StraightIcon,
  CheckIcon,
  Volume2Icon
} from '../../Icons/Icons';

export const GoogleMapsNav = ({
  activeStepIdx,
  setActiveStepIdx,
  routeSteps,
  currentStep,
  voiceGuidance,
  setVoiceGuidance,
  speakText,
  stepCount,
  onStopNavigation
}) => {
  // Map theme: 'map' (Google Maps vector), 'satellite' (Nocturnal dark), 'blueprint' (Raw SVG)
  const [mapStyle, setMapStyle] = useState('map');
  const [activeFloor, setActiveFloor] = useState('G');
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showStepList, setShowStepList] = useState(false);
  const [compassBearing, setCompassBearing] = useState(0);

  const containerRef = useRef(null);

  // Exact waypoints following corridors on user's architectural graph
  const WAYPOINTS = [
    { x: 5850, y: 10450, name: 'South Entrance & Reception', heading: 0 },
    { x: 5850, y: 7500, name: 'South Central Corridor', heading: 0 },
    { x: 4300, y: 3800, name: 'Central Skywalk Hub', heading: 330 },
    { x: 5550, y: 550, name: 'Room 204 Corridor', heading: 30 },
    { x: 7800, y: -600, name: 'North-East Access Corridor', heading: 340 },
    { x: 7100, y: -4200, name: 'North Library Complex', heading: 0 }
  ];

  const currentWp = WAYPOINTS[activeStepIdx] || WAYPOINTS[0];

  // Auto-center camera onto current GPS waypoint when step progresses
  useEffect(() => {
    recenterMap();
  }, [activeStepIdx]);

  const recenterMap = () => {
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag / Pan handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.x) * (6.5 / zoom);
    const dy = (e.clientY - dragStart.y) * (6.5 / zoom);
    setPanOffset((prev) => ({ x: prev.x - dx, y: prev.y - dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = (e.touches[0].clientX - dragStart.x) * (6.5 / zoom);
    const dy = (e.touches[0].clientY - dragStart.y) * (6.5 / zoom);
    setPanOffset((prev) => ({ x: prev.x - dx, y: prev.y - dy }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(Number((z + 0.25).toFixed(2)), 2.8));
  const handleZoomOut = () => setZoom((z) => Math.max(Number((z - 0.25).toFixed(2)), 0.55));

  // Maneuver icon helper
  const renderManeuverIcon = () => {
    switch (currentStep.turnType) {
      case 'turn-left':
        return <TurnLeftIcon size={32} color="#FFFFFF" />;
      case 'turn-right':
        return <TurnRightIcon size={32} color="#FFFFFF" />;
      case 'arrived':
        return <CheckIcon size={32} color="#FFFFFF" />;
      default:
        return <StraightIcon size={32} color="#FFFFFF" />;
    }
  };

  // Full route path
  const fullPathD = WAYPOINTS.map((wp, i) => `${i === 0 ? 'M' : 'L'} ${wp.x} ${wp.y}`).join(' ');

  // Traveled portion of the path (up to current waypoint)
  const traveledPathD = WAYPOINTS.slice(0, activeStepIdx + 1)
    .map((wp, i) => `${i === 0 ? 'M' : 'L'} ${wp.x} ${wp.y}`)
    .join(' ');

  // Upcoming portion of the path (from current waypoint to destination)
  const upcomingPathD = WAYPOINTS.slice(activeStepIdx)
    .map((wp, i) => `${i === 0 ? 'M' : 'L'} ${wp.x} ${wp.y}`)
    .join(' ');

  // Dynamic Google Maps Camera ViewBox centered around current GPS position
  const baseViewWidth = 6800 / zoom;
  const baseViewHeight = 5800 / zoom;
  const cameraX = currentWp.x - baseViewWidth / 2 + panOffset.x;
  const cameraY = currentWp.y - baseViewHeight / 2 + panOffset.y;

  return (
    <div className={`google-maps-container ${mapStyle}-mode`}>
      {/* 1. Google Maps Navigation Header (Maneuver Bar) */}
      <div className="gmaps-nav-header">
        <div className="gmaps-maneuver-box">
          {renderManeuverIcon()}
        </div>
        <div className="gmaps-maneuver-info">
          <div className="gmaps-distance-countdown">
            {currentStep.turnType === 'arrived' ? 'Destination' : `In ${currentStep.remainingDistance}`}
          </div>
          <div className="gmaps-maneuver-text">
            {currentStep.instruction}
          </div>
          <div className="gmaps-maneuver-subtext">
            {currentStep.subInstruction}
          </div>
        </div>
        <button
          className="gmaps-voice-pill"
          onClick={() => {
            const next = !voiceGuidance;
            setVoiceGuidance(next);
            if (next) speakText('Voice navigation on');
          }}
          aria-label={voiceGuidance ? 'Mute Voice' : 'Unmute Voice'}
          title={voiceGuidance ? 'Mute Voice' : 'Unmute Voice'}
        >
          <Volume2Icon size={18} color={voiceGuidance ? '#FFFFFF' : '#94a3b8'} />
        </button>
      </div>

      {/* 2. Interactive Map Viewport */}
      <div
        className="gmaps-viewport"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* If user toggled to Raw Blueprint mode */}
        {mapStyle === 'blueprint' ? (
          <div className="gmaps-blueprint-wrapper">
            <img
              src="/Untitled-2026-09-05-2253.svg"
              alt="Raw Architectural Blueprint"
              className="gmaps-blueprint-raw-svg"
            />
          </div>
        ) : (
          /* Google Maps Vector Canvas rendering user's architectural graph */
          <svg
            className="gmaps-svg-surface"
            viewBox={`${cameraX} ${cameraY} ${baseViewWidth} ${baseViewHeight}`}
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: `rotate(${compassBearing}deg)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'viewBox 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <defs>
              {/* Google Maps Route Gradient */}
              <linearGradient id="gmapsRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>

              {/* Radar pulse gradient */}
              <radialGradient id="gmapsRadarGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4285f4" stopOpacity="0.45" />
                <stop offset="80%" stopColor="#4285f4" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#4285f4" stopOpacity="0" />
              </radialGradient>

              {/* GPS Beacon Flashlight Cone */}
              <radialGradient id="gmapsBeamGrad" cx="50%" cy="100%" r="90%">
                <stop offset="0%" stopColor="#4285f4" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#4285f4" stopOpacity="0" />
              </radialGradient>

              {/* Drop shadow for pins & major building blocks */}
              <filter id="gmapsShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="25" stdDeviation="25" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* 1. Surrounding Campus Ground */}
            <rect x="-3000" y="-7000" width="18000" height="26000" fill="var(--gm-bg-base, #eef2f6)" />

            {/* Exterior Walkways & Access Roads */}
            <path
              d="M -1000 11200 L 13000 11200 M 5850 11200 L 5850 10200 M 6839 -5200 L 13000 -5200"
              stroke="var(--gm-road, #cbd5e1)"
              strokeWidth="180"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M -1000 11200 L 13000 11200 M 5850 11200 L 5850 10200 M 6839 -5200 L 13000 -5200"
              stroke="var(--gm-road-inner, #ffffff)"
              strokeWidth="130"
              strokeLinecap="round"
              fill="none"
            />

            {/* 2. User's Architectural Building Wings & Structural Blocks */}
            <g id="userWingsLayer">
              {userGraph.wings.map((wing) => {
                const isCorridor = (wing.w > 3000 && wing.h < 2000) || (wing.h > 3000 && wing.w < 2000);
                const isMainBlock = wing.w > 7000;
                return (
                  <rect
                    key={wing.id}
                    x={wing.x}
                    y={wing.y}
                    width={wing.w}
                    height={wing.h}
                    rx={isCorridor ? 60 : 120}
                    fill={
                      isMainBlock
                        ? 'var(--gm-building-bg, #ffffff)'
                        : isCorridor
                        ? 'var(--gm-corridor, #f8fafc)'
                        : 'var(--gm-building-accent, #f1f5f9)'
                    }
                    stroke={isMainBlock ? 'var(--gm-building-stroke, #94a3b8)' : 'var(--gm-corridor-stroke, #cbd5e1)'}
                    strokeWidth={isMainBlock ? 28 : 16}
                    filter={isMainBlock ? 'url(#gmapsShadow)' : undefined}
                  />
                );
              })}
            </g>

            {/* 3. Internal Corridor Grid Lines & Tactile Paving */}
            <g id="userCorridorLinesLayer" stroke="var(--gm-tactile, #fed7aa)" strokeWidth="32" strokeDasharray="30 40">
              {userGraph.lines.map((line, idx) => (
                <line
                  key={idx}
                  x1={line.x}
                  y1={line.y}
                  x2={line.x + line.dx}
                  y2={line.y + line.dy}
                />
              ))}
            </g>

            {/* 4. User's 75 Architectural Rooms */}
            <g id="userRoomsLayer">
              {userGraph.rooms.map((room, idx) => {
                // Highlight key destination and reference rooms
                const isRoom204 = room.x > 5000 && room.x < 5900 && room.y > -200 && room.y < 800;
                const isLibraryZone = room.y < -2500;
                const isSouthEntranceZone = room.y > 9000;

                const fillColor = isRoom204
                  ? '#fef3c7'
                  : isLibraryZone
                  ? '#fdf4ff'
                  : isSouthEntranceZone
                  ? '#ecfdf5'
                  : idx % 3 === 0
                  ? '#f0fdf4'
                  : idx % 3 === 1
                  ? '#eff6ff'
                  : '#f8fafc';

                const strokeColor = isRoom204
                  ? '#f59e0b'
                  : isLibraryZone
                  ? '#d946ef'
                  : isSouthEntranceZone
                  ? '#10b981'
                  : '#cbd5e1';

                const labelColor = isRoom204
                  ? '#b45309'
                  : isLibraryZone
                  ? '#86198f'
                  : isSouthEntranceZone
                  ? '#047857'
                  : '#334155';

                return (
                  <g key={room.id} transform={`translate(${room.x}, ${room.y})`}>
                    <rect
                      x="0"
                      y="0"
                      width={room.w}
                      height={room.h}
                      rx="45"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isRoom204 || isLibraryZone ? 16 : 8}
                    />
                    <text
                      x={room.w / 2}
                      y={room.h / 2 + 35}
                      fill={labelColor}
                      fontSize="95"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {isRoom204 ? '204' : room.num}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Highlighted Landmark Labels on the Architectural Layout */}
            <g id="landmarkBadges">
              {/* South Entrance Landmark */}
              <g transform="translate(5850, 10700)">
                <rect x="-420" y="-120" width="840" height="240" rx="120" fill="#047857" filter="url(#gmapsShadow)" />
                <text x="0" y="35" fill="#ffffff" fontSize="90" fontWeight="bold" textAnchor="middle">
                  🚪 SOUTH ENTRANCE
                </text>
              </g>

              {/* Central Skywalk Atrium Landmark */}
              <g transform="translate(4300, 3400)">
                <rect x="-450" y="-110" width="900" height="220" rx="110" fill="#0284c7" filter="url(#gmapsShadow)" />
                <text x="0" y="30" fill="#ffffff" fontSize="85" fontWeight="bold" textAnchor="middle">
                  🌿 CENTRAL SKYWALK
                </text>
              </g>

              {/* Room 204 Special Marker */}
              <g transform="translate(5550, 100)">
                <rect x="-380" y="-100" width="760" height="200" rx="100" fill="#d97706" filter="url(#gmapsShadow)" />
                <text x="0" y="28" fill="#ffffff" fontSize="80" fontWeight="bold" textAnchor="middle">
                  ★ ROOM 204 HALL
                </text>
              </g>

              {/* North Library Complex Landmark */}
              <g transform="translate(7100, -4700)">
                <rect x="-450" y="-120" width="900" height="240" rx="120" fill="#7e22ce" filter="url(#gmapsShadow)" />
                <text x="0" y="35" fill="#ffffff" fontSize="90" fontWeight="bold" textAnchor="middle">
                  📚 NORTH LIBRARY
                </text>
              </g>
            </g>

            {/* 5. Google Maps Turn-by-Turn Route Polyline */}
            {/* Outer Route Soft Shadow */}
            <path
              d={fullPathD}
              fill="none"
              stroke="var(--gm-route-shadow, rgba(29, 78, 216, 0.25))"
              strokeWidth="260"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Traveled Route Segment (Subtle Dimmed) */}
            {activeStepIdx > 0 && (
              <path
                d={traveledPathD}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="110"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60 90"
              />
            )}

            {/* Active Upcoming Route Segment (Vibrant Google Maps Blue) */}
            <path
              d={upcomingPathD}
              fill="none"
              stroke="url(#gmapsRouteGrad)"
              strokeWidth="140"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Animated Inner White Chevrons along Upcoming Path */}
            <path
              d={upcomingPathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="45"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60 260"
              className="gmaps-animated-chevrons"
            />

            {/* 6. Origin Marker (A - South Entrance) */}
            <g transform="translate(5850, 10450)">
              <circle cx="0" cy="0" r="160" fill="#16a34a" stroke="#ffffff" strokeWidth="32" filter="url(#gmapsShadow)" />
              <text x="0" y="60" fill="#ffffff" fontSize="140" fontWeight="bold" textAnchor="middle">A</text>
              <rect x="-320" y="-360" width="640" height="180" rx="90" fill="#16a34a" />
              <text x="0" y="-235" fill="#ffffff" fontSize="95" fontWeight="bold" textAnchor="middle">START</text>
            </g>

            {/* 7. Destination Marker (B - Red Google Teardrop Pin at North Library) */}
            <g transform="translate(7100, -4200)" filter="url(#gmapsShadow)">
              <path
                d="M 0 0 C -120 -120 -180 -240 -180 -340 A 180 180 0 0 1 180 -340 C 180 -240 120 -120 0 0 Z"
                fill="#ea4335"
                stroke="#ffffff"
                strokeWidth="24"
              />
              <circle cx="0" cy="-340" r="65" fill="#ffffff" />
              <rect x="-420" y="-620" width="840" height="200" rx="100" fill="#1e293b" />
              <text x="0" y="-485" fill="#ffffff" fontSize="90" fontWeight="bold" textAnchor="middle">
                📚 DESTINATION
              </text>
            </g>

            {/* 8. Live GPS User Puck (Google Maps Blue Beacon) */}
            <g
              transform={`translate(${currentWp.x}, ${currentWp.y})`}
              style={{ transition: 'transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)' }}
            >
              {/* Directional Flashlight / Heading Cone */}
              <g transform={`rotate(${currentWp.heading})`}>
                <path
                  d="M 0 0 L -300 -800 A 850 850 0 0 1 300 -800 Z"
                  fill="url(#gmapsBeamGrad)"
                />
              </g>

              {/* Pulsating Radar Ripple Ring */}
              <circle cx="0" cy="0" r="320" fill="url(#gmapsRadarGrad)" className="gmaps-radar-pulse" />

              {/* GPS Outer White Ring */}
              <circle cx="0" cy="0" r="140" fill="#ffffff" filter="url(#gmapsShadow)" />

              {/* GPS Inner Core Blue Dot */}
              <circle cx="0" cy="0" r="95" fill="#4285f4" />
              <circle cx="0" cy="0" r="35" fill="#ffffff" />
            </g>
          </svg>
        )}

        {/* 3. Floating Google Maps Control Buttons */}
        {/* Layer Selector Pill */}
        <div className="gmaps-floating-layers">
          <button
            className={`gmaps-layer-btn ${mapStyle === 'map' ? 'active' : ''}`}
            onClick={() => setMapStyle('map')}
            title="Google Map Vector Mode"
          >
            🗺️ Map
          </button>
          <button
            className={`gmaps-layer-btn ${mapStyle === 'satellite' ? 'active' : ''}`}
            onClick={() => setMapStyle('satellite')}
            title="Night Satellite Mode"
          >
            🛰️ Dark
          </button>
          <button
            className={`gmaps-layer-btn ${mapStyle === 'blueprint' ? 'active' : ''}`}
            onClick={() => setMapStyle('blueprint')}
            title="Architectural SVG Blueprint"
          >
            📐 Blueprint
          </button>
        </div>

        {/* Floor Level Picker (Vertical Pill) */}
        <div className="gmaps-floor-picker" aria-label="Floor Level">
          {['2', '1', 'G'].map((lvl) => (
            <button
              key={lvl}
              className={`gmaps-floor-btn ${activeFloor === lvl ? 'active' : ''}`}
              onClick={() => setActiveFloor(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Floating Right Actions: Compass, Recenter, Zoom */}
        <div className="gmaps-floating-actions">
          {/* Compass */}
          <button
            className="gmaps-round-btn compass"
            onClick={() => setCompassBearing((b) => (b === 0 ? 45 : 0))}
            title="Reset Compass North"
            aria-label="Compass"
          >
            <span
              className="gmaps-compass-needle"
              style={{ transform: `rotate(${-compassBearing}deg)` }}
            >
              ▲
            </span>
          </button>

          {/* Re-center / GPS target button */}
          <button
            className="gmaps-round-btn recenter"
            onClick={recenterMap}
            title="Re-center on My Location"
            aria-label="Re-center"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5">
              <circle cx="12" cy="12" r="7" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          </button>

          {/* Zoom controls pill */}
          <div className="gmaps-zoom-pill">
            <button className="gmaps-zoom-btn" onClick={handleZoomIn} title="Zoom In" aria-label="Zoom In">
              +
            </button>
            <div className="gmaps-zoom-divider" />
            <button className="gmaps-zoom-btn" onClick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out">
              −
            </button>
          </div>
        </div>

        {/* Live Location Tracking Badge */}
        <div className="gmaps-location-chip">
          <span className="gmaps-live-dot" />
          <span className="gmaps-live-text">{currentWp.name} • Floor {currentStep.floor.includes('FIRST') ? '1' : 'G'}</span>
        </div>
      </div>

      {/* 4. Bottom Google Maps Navigation Dashboard */}
      <div className="gmaps-bottom-sheet">
        {/* Main ETA and Route Metrics Bar */}
        <div className="gmaps-eta-row">
          <div className="gmaps-eta-left">
            <span className="gmaps-eta-time">{currentStep.remainingTime}</span>
            <span className="gmaps-eta-dist">
              {currentStep.remainingDistance} • Step {currentStep.stepIndex} of {currentStep.totalSteps}
            </span>
          </div>

          <div className="gmaps-eta-right">
            <button
              className="gmaps-steps-drawer-toggle"
              onClick={() => setShowStepList(!showStepList)}
              aria-label="Toggle Directions List"
            >
              {showStepList ? 'Hide Steps' : 'Route Steps 📋'}
            </button>
          </div>
        </div>

        {/* Step-by-Step Directions Expandable List */}
        {showStepList && (
          <div className="gmaps-step-list-drawer">
            <h4 className="gmaps-step-drawer-title">Upcoming Turns on Campus</h4>
            {routeSteps.map((step, idx) => (
              <div
                key={idx}
                className={`gmaps-step-row ${idx === activeStepIdx ? 'active-step' : ''} ${idx < activeStepIdx ? 'done-step' : ''}`}
                onClick={() => setActiveStepIdx(idx)}
              >
                <div className="gmaps-step-row-num">
                  {idx < activeStepIdx ? '✓' : idx + 1}
                </div>
                <div className="gmaps-step-row-content">
                  <div className="gmaps-step-row-inst">{step.instruction}</div>
                  <div className="gmaps-step-row-sub">{step.subInstruction} • {step.remainingDistance}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Turn-by-Turn Navigation Control Buttons */}
        <div className="gmaps-nav-buttons-row">
          <button
            className="gmaps-btn-nav secondary"
            onClick={() => setActiveStepIdx((prev) => Math.max(prev - 1, 0))}
            disabled={activeStepIdx === 0}
            aria-label="Previous step"
          >
            ← Previous
          </button>

          <button
            className="gmaps-btn-nav primary"
            onClick={() => {
              if (activeStepIdx < routeSteps.length - 1) {
                setActiveStepIdx((prev) => prev + 1);
              } else {
                onStopNavigation('destination-reached');
              }
            }}
            aria-label="Next step"
          >
            {activeStepIdx < routeSteps.length - 1 ? 'Next Turn →' : 'Arrived at Destination ✓'}
          </button>
        </div>

        {/* Pedometer & Exit Navigation Bar */}
        <div className="gmaps-footer-bar">
          <span className="gmaps-pedometer-tag">
            👣 {stepCount} steps taken
          </span>

          <button
            className="gmaps-exit-btn"
            onClick={onStopNavigation}
            aria-label="Exit Navigation"
          >
            Exit Navigation
          </button>
        </div>
      </div>
    </div>
  );
};
