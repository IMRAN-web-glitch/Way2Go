import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { SearchIcon } from '../Icons/Icons';
import './ManualLocationModal.css';

export const ManualLocationModal = () => {
  const { activeModal, closeModal, navigateTo } = useNavigation();
  const [building, setBuilding] = useState('Main Academic Block');
  const [floor, setFloor] = useState('Ground Floor');
  const [nearestRoom, setNearestRoom] = useState('Room 101 / Main Atrium');

  if (activeModal !== 'manual-location') return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    closeModal();
    navigateTo('route-navigation');
  };

  return (
    <div className="modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
      <div className="modal-card manual-loc-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-badge manual">
            <SearchIcon size={22} color="#7B2837" />
          </div>
          <h2 className="modal-title serif-heading">Manual Location Setup</h2>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleConfirm} className="modal-body">
          <p className="manual-desc">
            Select your current landmark or room to set your starting coordinates.
          </p>

          <div className="form-group">
            <label htmlFor="manual-building">Building</label>
            <select
              id="manual-building"
              className="modal-select"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            >
              <option value="Main Academic Block">Main Academic Block</option>
              <option value="Science & Research Complex">Science & Research Complex</option>
              <option value="Administrative Center">Administrative Center</option>
              <option value="Library Building">Central Library Building</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="manual-floor">Floor Level</label>
            <select
              id="manual-floor"
              className="modal-select"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            >
              <option value="Ground Floor">Ground Floor (Wheelchair Accessible)</option>
              <option value="First Floor">First Floor (Elevator A/B Access)</option>
              <option value="Second Floor">Second Floor (Elevator Access)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="manual-room">Nearest Landmark</label>
            <select
              id="manual-room"
              className="modal-select"
              value={nearestRoom}
              onChange={(e) => setNearestRoom(e.target.value)}
            >
              <option value="Room 101 / Main Atrium">Room 101 / Main Atrium Entrance</option>
              <option value="Campus Help Desk">Central Campus Help Desk</option>
              <option value="Elevator Bank A">North Wing Elevator Bank A</option>
            </select>
          </div>

          <div className="modal-footer modal-actions-row">
            <button type="button" className="modal-action-btn cancel" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="modal-action-btn submit">
              Start Route from Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
