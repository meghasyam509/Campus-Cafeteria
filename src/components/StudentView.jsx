import React, { useState } from 'react';
import CurrentOrder from './CurrentOrder';
import UpcomingQueue from './UpcomingQueue';
import { getMenuItemMeta } from './MenuSelector';

/**
 * StudentView Component
 * The main display screen visible to students in the dining hall and waiting area.
 * Displays:
 * 1. CURRENTLY SERVING (Order #, Student ID, Food Item, Quantity, Total Amount, Pickup Counter, Called Time, Serving Status)
 * 2. UPCOMING QUEUE (Cards with Position, Order #, Food Item, Quantity, Total Amount, Counter, Estimated Wait)
 * 3. Food item filter dropdown (All Items, Veg Meals, Chicken Biryani, ...)
 * 4. Recently Served trays history
 */
export default function StudentView({
  currentOrder,
  queue = [],
  servedOrders = [],
}) {
  const [filterItem, setFilterItem] = useState('');
  const [showServedHistory, setShowServedHistory] = useState(false);

  return (
    <div className="student-view-layout">
      {/* 1. Large Highlighted Current Serving Order ("Now Serving" Status) */}
      <CurrentOrder currentOrder={currentOrder} />

      {/* 2. Upcoming Waiting Orders in Queue with Food Item Filter */}
      <UpcomingQueue
        queue={queue}
        filterItem={filterItem}
        onFilterChange={setFilterItem}
        isStaff={false}
      />

      {/* 3. Recently Served Section ("Served" Status) */}
      {servedOrders.length > 0 && (
        <section className="served-history-section" aria-label="Recently Served Orders">
          <div className="served-history-header">
            <div className="history-title-group">
              <span className="history-icon" aria-hidden="true">✅</span>
              <h3 className="history-title">Recently Served Orders</h3>
              <span className="served-count-pill">{servedOrders.length} Completed</span>
            </div>
            <button
              type="button"
              className="toggle-served-btn"
              onClick={() => setShowServedHistory((prev) => !prev)}
              aria-expanded={showServedHistory}
            >
              {showServedHistory ? '▲ Hide Completed' : '▼ View Completed Orders'}
            </button>
          </div>

          {showServedHistory && (
            <div className="served-orders-grid">
              {servedOrders.slice(0, 8).map((order) => {
                const itemMeta = getMenuItemMeta(order.foodItem);
                const unitPrice = order.price || itemMeta.price;
                const total = order.totalAmount || unitPrice * (order.quantity || 1);

                return (
                  <div key={order.id || `served-${order.number}`} className="served-order-card">
                    <div className="served-card-top">
                      <span className="served-order-number">#{order.number}</span>
                      <span className="order-badge status-served">Served</span>
                    </div>
                    <div className="served-food-line">
                      <span>{itemMeta.icon}</span>
                      <span className="served-food-name">{order.foodItem}</span>
                      <span className="served-qty">&times; {order.quantity || 1}</span>
                    </div>
                    <div className="served-price-line">
                      <span>Amount: <strong>₹{total}</strong> (₹{unitPrice} each)</span>
                    </div>
                    <div className="served-meta-line">
                      <span>👤 {order.studentId || 'Student'}</span>
                      <span>📍 {order.pickupCounter || 'Counter 1'}</span>
                      {order.servedAt && <span>⏱️ {order.servedAt}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 4. Helpful Cafeteria Tips for Students */}
      <div className="cafeteria-info-banner">
        <div className="info-item">
          <span>🧾</span>
          <span>Check the order number printed on your token or register receipt.</span>
        </div>
        <div className="info-item">
          <span>🔔</span>
          <span>A dining chime sounds automatically when the next order is called.</span>
        </div>
        <div className="info-item">
          <span>📍</span>
          <span>Please collect your hot food tray at the designated pickup counter.</span>
        </div>
      </div>
    </div>
  );
}
