import React, { useState, useMemo } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import {
  SearchIcon,
  MicIcon,
  BookIcon,
  AdminIcon,
  ScienceIcon,
  AuditoriumIcon,
  HistoryIcon,
  ChevronRightIcon,
  HelpCircleIcon
} from '../../Icons/Icons';

//mockData
import { QUICK_ACCESS_ITEMS, RECENT_DESTINATIONS, ALL_DESTINATIONS } from '../../../data/mockData';
import './DestinationSelection.css';

export const DestinationSelection = () => {
  const { startNavigationTo, openModal } = useNavigation();  
  const { speakText } = useAccessibility();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Filter destinations based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return ALL_DESTINATIONS.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.subtitle.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Voice Search handler
  const handleVoiceSearch = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        speakText(`Searching for ${transcript}`);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      // Mock voice recognition prompt if browser doesn't support Web Speech
      setIsListening(true);
      setTimeout(() => {
        setSearchQuery('Library');
        speakText('Searching for Library');
        setIsListening(false);
      }, 1200);
    }
  };

  const getQuickIcon = (type) => {
    switch (type) {
      case 'library':
        return <BookIcon size={30} color="#7B2837" />;
      case 'admin':
        return <AdminIcon size={30} color="#7B2837" />;
      case 'science':
        return <ScienceIcon size={30} color="#7B2837" />;
      case 'auditorium':
        return <AuditoriumIcon size={30} color="#7B2837" />;
      default:
        return <BookIcon size={30} color="#7B2837" />;
    }
  };

  return (
    <div className="dest-screen-container">
      {/* Top Search Bar */}
      <div className="search-bar-wrapper">
        <div className="search-bar-input-box">
          <span className="search-bar-icon">
            <SearchIcon size={20} color="#1D273A" />
          </span>
          <input
            type="text"
            className="search-bar-input"
            placeholder={isListening ? "Listening... speak now" : "Where do you want to go?"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search destinations"
          />
          <button
            type="button"
            className={`search-bar-mic ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceSearch}
            title="Search by voice"
            aria-label="Voice search"
          >
            <MicIcon size={20} color="#7B2837" />
          </button>
        </div>
      </div>

      <div className="dest-scroll-content">
        {/* If searching, show search results */}
        {searchQuery.trim() ? (
          <section className="dest-section">
            <h2 className="dest-section-title serif-heading">
              Matching Destinations ({searchResults.length})
            </h2>
            {searchResults.length > 0 ? (
              <div className="dest-list">
                {searchResults.map((dest) => (
                  <button
                    key={dest.id}
                    className="dest-list-card"
                    onClick={() => startNavigationTo(dest)}
                  >
                    <div className="dest-list-icon">
                      <HistoryIcon size={20} color="#64748B" />
                    </div>
                    <div className="dest-list-info">
                      <h3 className="dest-item-title">{dest.title}</h3>
                      <p className="dest-item-sub">{dest.subtitle} • {dest.distance}</p>
                    </div>
                    <div className="dest-list-arrow">
                      <ChevronRightIcon size={20} color="#64748B" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="dest-empty-state">
                <p>No accessible destinations found for "{searchQuery}".</p>
                <button
                  className="dest-clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Quick Access Section */}
            <section className="dest-section">
              <h2 className="dest-section-title serif-heading">Quick Access</h2>
              <div className="quick-access-grid">
                {QUICK_ACCESS_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    className="quick-access-card"
                    onClick={() => startNavigationTo(item)}
                  >
                    <div className="quick-access-icon-box">
                      {getQuickIcon(item.iconType)}
                    </div>
                    <span className="quick-access-label">{item.title}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Recent Destinations Section */}
            <section className="dest-section">
              <h2 className="dest-section-title serif-heading">Recent Destinations</h2>
              <div className="dest-list">
                {RECENT_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.id}
                    className="dest-list-card"
                    onClick={() => startNavigationTo(dest)}
                  >
                    <div className="dest-list-icon">
                      <HistoryIcon size={20} color="#64748B" />
                    </div>
                    <div className="dest-list-info">
                      <h3 className="dest-item-title">{dest.title}</h3>
                      <p className="dest-item-sub">{dest.subtitle}</p>
                    </div>
                    <div className="dest-list-arrow">
                      <ChevronRightIcon size={20} color="#64748B" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Floating Action Button (Help '?') */}
      <button
        className="dest-help-fab"
        onClick={() => openModal('help')}
        aria-label="Help & Accessibility FAQ"
        title="Help & Info"
      >
        <HelpCircleIcon size={24} color="#FFFFFF" />
      </button>
    </div>
  );
};

