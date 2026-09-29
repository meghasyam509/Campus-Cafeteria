import React from 'react';

/**
 * Header Component
 * Professional dashboard header with modern gradient styling:
 * - Cafeteria logo/icon
 * - "Campus Cafeteria"
 * - "Queue Management System"
 * - Status indicator: "System Online"
 * - Live active count & audio chime toggle
 */
export default function Header({
  activeOrdersCount = 0,
  soundEnabled = true,
  onToggleSound,
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-icon-wrapper" aria-hidden="true">
            <span className="brand-icon">🍽️</span>
          </div>
          <div className="brand-titles">
            <div className="brand-title-row">
              <h1 className="brand-title">Campus Cafeteria</h1>
              <span className="badge-system-online" title="Operational and real-time syncing">
                <span className="pulse-dot-green" aria-hidden="true"></span>
                <span>System Online</span>
              </span>
            </div>
            <p className="brand-subtitle">Queue Management System</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="status-pill-header" title="Active orders in system">
            <span className="queue-metric-num">{activeOrdersCount}</span>
            <span className="queue-metric-label">Active Orders</span>
          </div>

          <button
            type="button"
            className={`sound-toggle-btn ${soundEnabled ? 'active' : ''}`}
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute audio announcements' : 'Enable audio chime on call'}
            aria-label="Toggle chime audio"
          >
            <span className="sound-icon">{soundEnabled ? '🔔' : '🔕'}</span>
            <span className="sound-text">{soundEnabled ? 'Chime On' : 'Chime Off'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
