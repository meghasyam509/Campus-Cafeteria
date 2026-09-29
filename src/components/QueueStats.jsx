import React from 'react';
import { getMenuItemMeta } from './MenuSelector';

/**
 * QueueStats Component
 * Modern dashboard statistics row:
 * 1. Currently Serving
 * 2. Waiting Orders
 * 3. Served Today
 * 4. Estimated Wait
 * 5. Total Sales
 */
export default function QueueStats({
  currentOrder,
  waitingCount = 0,
  servedCount = 0,
  totalSales = 0,
  avgWaitMinutes = 3,
}) {
  const currentDisplay = currentOrder ? `#${currentOrder.number}` : 'None';
  const estimatedQueueWait = waitingCount > 0 ? `~${waitingCount * avgWaitMinutes} min` : '0 min';
  const currentOrderMeta = currentOrder ? getMenuItemMeta(currentOrder.foodItem) : null;

  // Format currency with Indian Rupee symbol
  const formattedSales = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalSales || 0);

  return (
    <div className="stats-grid" aria-label="Cafeteria Live Statistics">
      {/* 1. Currently Serving */}
      <div className="stat-card serving-card">
        <div className="stat-card-top">
          <span className="stat-label">Currently Serving</span>
          <div className="stat-icon-badge serving-icon" aria-hidden="true">
            🔔
          </div>
        </div>
        <div className="stat-main-value serving-value">{currentDisplay}</div>
        <div className="stat-subtext">
          {currentOrder ? (
            <span className="truncate-text" title={`${currentOrder.foodItem} • ${currentOrder.pickupCounter || 'Counter 1'}`}>
              {currentOrderMeta?.icon} {currentOrder.foodItem} &bull; {currentOrder.pickupCounter || 'Counter 1'}
            </span>
          ) : (
            'Counter is available'
          )}
        </div>
      </div>

      {/* 2. Waiting Orders */}
      <div className="stat-card waiting-card">
        <div className="stat-card-top">
          <span className="stat-label">Waiting Orders</span>
          <div className="stat-icon-badge waiting-icon" aria-hidden="true">
            ⏳
          </div>
        </div>
        <div className="stat-main-value waiting-value">{waitingCount}</div>
        <div className="stat-subtext">
          {waitingCount === 1 ? '1 order in queue' : `${waitingCount} orders in queue`}
        </div>
      </div>

      {/* 3. Served Today */}
      <div className="stat-card served-card">
        <div className="stat-card-top">
          <span className="stat-label">Served Today</span>
          <div className="stat-icon-badge served-icon" aria-hidden="true">
            ✅
          </div>
        </div>
        <div className="stat-main-value served-value">{servedCount}</div>
        <div className="stat-subtext">Completed meal tokens</div>
      </div>

      {/* 4. Estimated Wait */}
      <div className="stat-card wait-card">
        <div className="stat-card-top">
          <span className="stat-label">Estimated Wait</span>
          <div className="stat-icon-badge wait-icon" aria-hidden="true">
            ⏱️
          </div>
        </div>
        <div className="stat-main-value wait-value">{estimatedQueueWait}</div>
        <div className="stat-subtext">
          {waitingCount > 0
            ? `${waitingCount} in line &times; ~${avgWaitMinutes} min`
            : 'Immediate pickup ready'}
        </div>
      </div>

      {/* 5. Total Sales */}
      <div className="stat-card sales-card">
        <div className="stat-card-top">
          <span className="stat-label">Total Sales</span>
          <div className="stat-icon-badge sales-icon" aria-hidden="true">
            💰
          </div>
        </div>
        <div className="stat-main-value sales-value">{formattedSales}</div>
        <div className="stat-subtext">Revenue from served orders</div>
      </div>
    </div>
  );
}
