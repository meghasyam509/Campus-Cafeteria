import React from 'react';
import { getMenuItemMeta } from './MenuSelector';

/**
 * CurrentOrder Component
 * Visually prominent hero section for the actively called order:
 * - Large order number
 * - "NOW SERVING" status badge
 * - Food item highlighted
 * - Quantity & Unit Price
 * - Emphasized Total Amount
 * - Pickup counter
 * - Called time
 * Empty state: "No order is currently being served"
 */
export default function CurrentOrder({ currentOrder, onMarkServed }) {
  if (!currentOrder) {
    return (
      <section className="current-order-hero empty-hero" aria-live="polite">
        <div className="current-empty-icon" aria-hidden="true">🍲</div>
        <h2 className="current-empty-title">No order is currently being served</h2>
        <p className="current-empty-desc">
          Kitchen staff will call the next order once food preparation is complete. Please have your order receipt ready.
        </p>
      </section>
    );
  }

  const itemMeta = getMenuItemMeta(currentOrder.foodItem);
  const qty = Number(currentOrder.quantity) || 1;
  const unitPrice = Number(currentOrder.price) || itemMeta.price || 0;
  const totalAmount = Number(currentOrder.totalAmount) || unitPrice * qty;
  const counterText = currentOrder.pickupCounter || itemMeta.counter || 'Counter 1';

  return (
    <section className="current-order-hero active-hero" aria-live="assertive">
      <div className="hero-top-bar">
        <div className="now-serving-badge">
          <span className="pulse-beacon" aria-hidden="true"></span>
          <span>NOW SERVING</span>
        </div>
        <span className="hero-counter-tag">📍 {counterText}</span>
      </div>

      {/* Hero Big Order Number */}
      <div
        className="current-order-big-number"
        aria-label={`Currently serving order number ${currentOrder.number}`}
      >
        #{currentOrder.number}
      </div>

      {/* Highlighted Food Item Banner */}
      <div className="current-food-highlight-card">
        <div className="food-main-info">
          <span className="food-hero-icon" aria-hidden="true">
            {itemMeta.icon || '🍽️'}
          </span>
          <div className="food-hero-text">
            <h3 className="food-hero-name">{currentOrder.foodItem || 'Cafeteria Order'}</h3>
            <span className="food-hero-calc">
              {qty} &times; ₹{unitPrice}
            </span>
          </div>
        </div>

        {/* Emphasized Total Amount */}
        <div className="food-hero-total-box">
          <span className="hero-total-label">Total Amount</span>
          <span className="hero-total-amount">₹{totalAmount}</span>
        </div>
      </div>

      {/* Meta tags details */}
      <div className="hero-metadata-grid">
        {currentOrder.studentId && (
          <div className="hero-meta-item">
            <span className="meta-icon" aria-hidden="true">🎓</span>
            <span>Student: <strong>{currentOrder.studentId}</strong></span>
          </div>
        )}

        {currentOrder.calledAt && (
          <div className="hero-meta-item">
            <span className="meta-icon" aria-hidden="true">⏱️</span>
            <span>Called: <strong>{currentOrder.calledAt}</strong></span>
          </div>
        )}

        <div className="hero-meta-item">
          <span className="meta-icon" aria-hidden="true">🏷️</span>
          <span>Counter: <strong>{counterText}</strong></span>
        </div>
      </div>

      {onMarkServed && (
        <div className="hero-action-bar">
          <button
            type="button"
            className="btn-hero-mark-served"
            onClick={() => onMarkServed(currentOrder)}
            title="Mark order as fulfilled and update sales"
          >
            <span>✅ Mark as Served (₹{totalAmount})</span>
          </button>
        </div>
      )}
    </section>
  );
}
