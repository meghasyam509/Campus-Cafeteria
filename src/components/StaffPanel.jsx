import React, { useState } from 'react';
import AddOrderForm from './AddOrderForm';
import OrderCard from './OrderCard';
import { getMenuItemMeta } from './MenuSelector';

/**
 * StaffPanel Component
 * Real-world administration screen for cafeteria staff:
 * - Professional order creation form with auto calculations
 * - Quick action controls: Call Next, Mark Served, Remove Order
 * - Active counter status card with live serving details
 * - Table / Card view switcher for flexible queue monitoring
 * - Search within active queue
 * - Reset queue modal protection
 */
export default function StaffPanel({
  currentOrder,
  queue = [],
  nextSuggestedNumber,
  onAddOrder,
  onCallNext,
  onMarkServed,
  onServeSpecific,
  onRemoveOrder,
  onResetQueue,
  onLoadDemoData,
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [staffSearch, setStaffSearch] = useState('');

  // Filter queue for staff searching
  const filteredQueue = staffSearch.trim()
    ? queue.filter((order) => {
        const query = staffSearch.trim().toLowerCase();
        return (
          String(order.number).toLowerCase().includes(query) ||
          (order.studentId || '').toLowerCase().includes(query) ||
          (order.foodItem || '').toLowerCase().includes(query) ||
          (order.pickupCounter || '').toLowerCase().includes(query)
        );
      })
    : queue;

  return (
    <div className="staff-layout">
      {/* LEFT COLUMN: Order Entry & Command Actions */}
      <aside className="staff-control-card">
        <div className="card-section-header">
          <div className="section-title-icon">📝</div>
          <div>
            <h2 className="control-card-title">Order Entry & Register</h2>
            <p className="control-card-subtitle">Issue tokens and manage kitchen dispatch</p>
          </div>
        </div>

        {/* 1. Add Order Controlled Form */}
        <AddOrderForm
          onAddOrder={onAddOrder}
          currentOrder={currentOrder}
          queue={queue}
          nextSuggestedNumber={nextSuggestedNumber}
        />

        {/* 2. Primary Queue Actions */}
        <div className="staff-quick-actions">
          <span className="quick-action-title">Queue Command Controls</span>

          {/* Call Next Button */}
          <button
            type="button"
            className="btn-serve-next"
            onClick={onCallNext}
            disabled={queue.length === 0}
            title={
              queue.length > 0
                ? `Call #${queue[0].number} (${queue[0].foodItem}) to counter`
                : 'No orders waiting in queue'
            }
          >
            <span className="btn-icon">🔔</span>
            <span className="btn-text">Call Next Order</span>
            {queue.length > 0 && (
              <span className="btn-badge-next">#{queue[0].number}</span>
            )}
          </button>

          {/* Mark Served Button */}
          <button
            type="button"
            className="btn-mark-served"
            onClick={onMarkServed}
            disabled={!currentOrder}
            title={
              currentOrder
                ? `Mark #${currentOrder.number} as fulfilled and record ₹${currentOrder.totalAmount || 0} to sales`
                : 'No order currently serving at counter'
            }
          >
            <span className="btn-icon">✅</span>
            <span className="btn-text">Mark Current Served</span>
            {currentOrder && (
              <span className="btn-badge-amount">₹{currentOrder.totalAmount || 0}</span>
            )}
          </button>

          {/* Secondary Action Row */}
          <div className="action-button-group-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={onLoadDemoData}
              title="Populate realistic demo orders for testing"
            >
              <span>🔄 Load Sample Data</span>
            </button>

            <button
              type="button"
              className="btn-danger-outline"
              onClick={() => setShowResetConfirm(true)}
              title="Clear all active and waiting orders"
            >
              <span>🗑️ Reset Queue</span>
            </button>
          </div>
        </div>

        {/* Currently Serving Live Snapshot */}
        <div className="current-serving-snapshot">
          <div className="snapshot-header">
            <div className="snapshot-header-left">
              <span className="snapshot-dot-beacon" aria-hidden="true"></span>
              <span className="snapshot-label">Active Counter Dispatch</span>
            </div>
            {currentOrder && (
              <span className="snapshot-live-tag">LIVE AT COUNTER</span>
            )}
          </div>

          {currentOrder ? (
            <div className="snapshot-content">
              <div className="snapshot-order-num-row">
                <span className="snapshot-order-num">#{currentOrder.number}</span>
                <span className="order-badge status-serving">Serving</span>
              </div>

              <div className="snapshot-food-row">
                <span className="food-small-icon">{getMenuItemMeta(currentOrder.foodItem).icon}</span>
                <span className="snapshot-food-name">{currentOrder.foodItem}</span>
                <span className="snapshot-qty">&times; {currentOrder.quantity || 1}</span>
              </div>

              <div className="snapshot-amount-row">
                <span className="snapshot-amount-label">Order Total:</span>
                <span className="snapshot-price-tag">₹{currentOrder.totalAmount || 0}</span>
              </div>

              <div className="snapshot-meta-grid">
                <div className="snapshot-meta-chip">
                  <span>👤</span>
                  <span>{currentOrder.studentId || 'STU-GUEST'}</span>
                </div>
                <div className="snapshot-meta-chip">
                  <span>📍</span>
                  <span>{currentOrder.pickupCounter || 'Counter 1'}</span>
                </div>
                {currentOrder.calledAt && (
                  <div className="snapshot-meta-chip">
                    <span>⏱️</span>
                    <span>{currentOrder.calledAt}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-mark-served-inline"
                onClick={() => onMarkServed(currentOrder)}
                title="Mark this order as collected by student"
              >
                <span>✓ Complete & Record ₹{currentOrder.totalAmount || 0}</span>
              </button>
            </div>
          ) : (
            <div className="snapshot-empty">
              <span className="snapshot-empty-icon">🍽️</span>
              <p className="snapshot-empty-text">
                Pickup counter is ready for the next order. Click <strong>"Call Next Order"</strong> to advance the line.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT COLUMN: Active Queue Manager */}
      <section className="staff-orders-manager" aria-label="Staff Active Orders List">
        <div className="section-title-bar">
          <div className="title-and-count">
            <div className="title-row">
              <h2 className="section-title">Active Queue Management</h2>
              <span className="queue-count-tag">{queue.length} in line</span>
            </div>
            <p className="queue-time-estimate">
              FIFO Sequence &bull; Average turnaround ~{queue.length * 3} mins
            </p>
          </div>

          {/* View switcher and Search bar */}
          <div className="staff-table-toolbar">
            <div className="search-input-wrapper staff-search">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="queue-search-input"
                placeholder="Search ticket # or student..."
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                aria-label="Filter staff table"
              />
              {staffSearch && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setStaffSearch('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Table / Cards toggle */}
            <div className="view-toggle-group" role="group" aria-label="View layout switcher">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Compact Table View"
              >
                <span>📋 Table</span>
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
                title="Cards Grid View"
              >
                <span>🃏 Cards</span>
              </button>
            </div>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="empty-queue-container">
            <div className="empty-icon-wrap" aria-hidden="true">
              <span className="empty-icon">📋</span>
            </div>
            <h3 className="empty-title">Queue is Currently Clear</h3>
            <p className="empty-subtitle">
              No orders waiting. Use the form on the left to add a new token, or click <strong>Load Sample Data</strong> to explore queue operations.
            </p>
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '1rem' }}
              onClick={onLoadDemoData}
            >
              Load Sample Cafeteria Orders
            </button>
          </div>
        ) : filteredQueue.length === 0 ? (
          <div className="empty-queue-container filter-empty">
            <div className="empty-icon-wrap" aria-hidden="true">
              <span className="empty-icon">🔎</span>
            </div>
            <h3 className="empty-title">No Orders Matched "{staffSearch}"</h3>
            <p className="empty-subtitle">Check the spelling or order number and try again.</p>
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '0.75rem' }}
              onClick={() => setStaffSearch('')}
            >
              Clear Search
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="table-responsive">
            <table className="queue-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Pos</th>
                  <th style={{ width: '90px' }}>Order #</th>
                  <th>Student ID</th>
                  <th>Food Item</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Counter</th>
                  <th>Status</th>
                  <th>Est. Wait</th>
                  <th style={{ textAlign: 'right', minWidth: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map((order) => {
                  const trueIndex = queue.findIndex(
                    (q) => (q.id && q.id === order.id) || q.number === order.number
                  );
                  const position = trueIndex !== -1 ? trueIndex + 1 : 1;
                  const approxWait = position * 3;
                  const isFirst = position === 1;
                  const itemMeta = getMenuItemMeta(order.foodItem);
                  const unitPrice = order.price || itemMeta.price;
                  const total = order.totalAmount || unitPrice * (order.quantity || 1);

                  return (
                    <tr key={order.id || `order-row-${order.number}`} className={isFirst ? 'row-next-up' : ''}>
                      <td>
                        <span className={`position-badge ${isFirst ? 'first-up' : ''}`}>
                          #{position}
                        </span>
                      </td>
                      <td>
                        <span className="order-num-pill">#{order.number}</span>
                      </td>
                      <td>
                        <span className="student-badge">
                          {order.studentId || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="table-food-item">
                          <span className="table-food-icon">{itemMeta.icon}</span>
                          <span className="table-food-name">{order.foodItem}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {order.quantity || 1}
                      </td>
                      <td>
                        <span className="table-price">₹{unitPrice}</span>
                      </td>
                      <td>
                        <span className="table-total">₹{total}</span>
                      </td>
                      <td>
                        <span className="counter-pill">
                          {order.pickupCounter || itemMeta.counter || 'Counter 1'}
                        </span>
                      </td>
                      <td>
                        <span className={`order-badge ${isFirst ? 'status-next' : 'status-waiting'}`}>
                          {isFirst ? 'Next' : 'Waiting'}
                        </span>
                      </td>
                      <td>
                        <span className="wait-pill">~{approxWait}m</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-action-group">
                          <button
                            type="button"
                            className="action-btn-sm serve"
                            onClick={() => onServeSpecific(order)}
                            title={`Call #${order.number} immediately`}
                          >
                            <span>⚡ Call</span>
                          </button>
                          <button
                            type="button"
                            className="action-btn-sm cancel"
                            onClick={() => onRemoveOrder(order)}
                            title={`Remove #${order.number} from queue`}
                          >
                            <span>✕ Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* CARDS VIEW */
          <div className="orders-grid">
            {filteredQueue.map((order) => {
              const trueIndex = queue.findIndex(
                (q) => (q.id && q.id === order.id) || q.number === order.number
              );
              const position = trueIndex !== -1 ? trueIndex + 1 : 1;

              return (
                <OrderCard
                  key={order.id || `order-${order.number}`}
                  order={order}
                  position={position}
                  isStaff={true}
                  onServe={onServeSpecific}
                  onCancel={onRemoveOrder}
                  waitMinutesPerOrder={3}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Confirmation Modal for Reset Queue */}
      {showResetConfirm && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-reset-title"
          onClick={() => setShowResetConfirm(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-alert-icon">⚠️</span>
              <h3 id="modal-reset-title" className="modal-title">
                Reset Entire Cafeteria Queue?
              </h3>
            </div>
            <p className="modal-desc">
              This action will permanently clear all <strong>{queue.length} waiting orders</strong>, clear the current serving counter, and reset today's order metrics.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel & Keep Queue
              </button>
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={() => {
                  onResetQueue();
                  setShowResetConfirm(false);
                }}
              >
                Yes, Clear All Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
