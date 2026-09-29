import React from 'react';

/**
 * Navigation Component
 * Attractive segmented control navigation tabs:
 * - Student View
 * - Staff Panel
 * - Split / Kiosk Mode
 * Active tab has a clearly visible, elevated selected state.
 */
export default function Navigation({ activeTab, onTabChange, waitingCount = 0 }) {
  return (
    <nav className="nav-container" aria-label="Dashboard Navigation">
      <div className="nav-segmented-control" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'student'}
          className={`nav-tab-item ${activeTab === 'student' ? 'active' : ''}`}
          onClick={() => onTabChange('student')}
        >
          <span className="nav-tab-icon" aria-hidden="true">👀</span>
          <span className="nav-tab-label">Student View</span>
          {waitingCount > 0 && (
            <span className="nav-tab-counter" title={`${waitingCount} orders in queue`}>
              {waitingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'staff'}
          className={`nav-tab-item ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => onTabChange('staff')}
        >
          <span className="nav-tab-icon" aria-hidden="true">⚙️</span>
          <span className="nav-tab-label">Staff Panel</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'both'}
          className={`nav-tab-item ${activeTab === 'both' ? 'active' : ''}`}
          onClick={() => onTabChange('both')}
          title="Dual display for counter staff and public monitors"
        >
          <span className="nav-tab-icon" aria-hidden="true">🖥️</span>
          <span className="nav-tab-label">Split / Kiosk</span>
        </button>
      </div>
    </nav>
  );
}
