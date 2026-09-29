import React from 'react';
import { getMenuItemMeta } from './MenuSelector';

/**
 * OrderCard Component
 * Modern order card with emphasized total amount:
 * - Queue position
 * - Order number
 * - Student ID
 * - Food item
 * - Quantity & Price (e.g. 2 × ₹120)
 * - Visually prominent Total Amount (e.g. Total ₹240)
 * - Pickup counter
 * - Estimated wait
 * - Status badge
 */
export default function OrderCard({
  order,
  position,
  isStaff = false,
  onServe,
  onCancel,
  waitMinutesPerOrder = 3,
}) {
  const isFirst = position === 1;
  const approxWait = position ? position * waitMinutesPerOrder : 0;
  const itemMeta = getMenuItemMeta(order.foodItem);

  const qty = Number(order.quantity) || 1;
  const unitPrice = Number(order.price) || itemMeta.price || 0;
  const total = Number(order.totalAmount) || unitPrice * qty;
  const counter = order.pickupCounter || itemMeta.counter || 'Counter 1';
  const status = order.status || (isFirst ? 'Waiting' : 'Waiting');

  // Status visual badge
  const getStatusBadge = () => {
    const s = String(status).toLowerCase();
    if (s.includes('serv') && !s.includes('served')) {
      return <span className="order-badge status-serving">Serving</span>;
    }
    if (s.includes('served')) {
      return <span className="order-badge status-served">Served</span>;
    }
    if (isFirst) {
      return <span className="order-badge status-next">Next</span>;
    }
    return <span className="order-badge status-waiting">Waiting</span>;
  };

  return (
    <article className={`order-card-modern ${isFirst ? 'first-order-card' : ''}`}>
      {/* Card Header */}
      <div className="card-header-row">
        <div className="order-title-group">
          <span className="order-label-tag">Order</span>
          <span className="order-number-title">#{order.number}</span>
        </div>

        {position ? (
          <span className={`queue-pos-badge ${isFirst ? 'pos-first' : ''}`}>
            {isFirst ? '★ Next' : `#${position}`}
          </span>
        ) : (
          getStatusBadge()
        )}
      </div>

      {/* Student ID row */}
      <div className="student-id-row">
        <span className="student-avatar-icon" aria-hidden="true">👤</span>
        <span className="student-name-text">
          Student: <strong>{order.studentId || 'STU-GUEST'}</strong>
        </span>
      </div>

      {/* Food Item & Calculation Box */}
      <div className="card-food-box">
        <div className="food-name-row">
          <span className="food-small-icon" aria-hidden="true">
            {itemMeta.icon || '🍽️'}
          </span>
          <span className="food-title-bold">
            {order.foodItem || 'Menu Item'}
          </span>
        </div>
        <div className="food-calc-row">
          <span className="calc-qty-price">{qty} &times; ₹{unitPrice}</span>
        </div>
      </div>

      {/* Visually Prominent Total Amount Display */}
      <div className="card-total-row">
        <span className="total-label-text">Total</span>
        <span className="total-price-large">₹{total}</span>
      </div>

      {/* Meta grid: Pickup Counter, Status, Wait Time */}
      <div className="card-details-list">
        <div className="detail-item">
          <span className="detail-key">Pickup:</span>
          <span className="detail-badge counter-tag">📍 {counter}</span>
        </div>

        <div className="detail-item">
          <span className="detail-key">Status:</span>
          {getStatusBadge()}
        </div>

        {position ? (
          <div className="detail-item">
            <span className="detail-key">Est. Wait:</span>
            <span className="detail-badge wait-tag">⏱️ ~{approxWait} min</span>
          </div>
        ) : null}
      </div>

      {/* Staff Actions */}
      {isStaff && (
        <div className="card-actions-footer">
          <button
            type="button"
            className="btn-card-call"
            onClick={() => onServe(order)}
            title={`Call #${order.number} to counter now`}
          >
            <span>⚡ Call</span>
          </button>
          <button
            type="button"
            className="btn-card-remove"
            onClick={() => onCancel(order)}
            title={`Remove #${order.number} from queue`}
          >
            <span>✕ Remove</span>
          </button>
        </div>
      )}
    </article>
  );
}
