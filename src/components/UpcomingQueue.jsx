import React, { useState } from 'react';
import OrderCard from './OrderCard';
import MenuSelector from './MenuSelector';

/**
 * UpcomingQueue Component
 * Displays waiting orders in queue with:
 * - Order Number, Student ID, Food Item, Quantity, Price, Total Amount, Pickup Counter, Queue Position, Estimated Wait Time
 * - Search by Order # or Student ID
 * - Filter by Food Item (All Items, Veg Meals, Chicken Biryani, ...)
 * - Empty states for clear queue and no-match search
 */
export default function UpcomingQueue({
  queue = [],
  filterItem = '',
  onFilterChange,
  isStaff = false,
  onServeOrder,
  onCancelOrder,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter queue orders by both food item AND search query (order # or student ID)
  const filteredQueue = queue.filter((order) => {
    // 1. Food item filter
    if (filterItem && (order.foodItem || '').toLowerCase() !== filterItem.toLowerCase()) {
      return false;
    }
    // 2. Search query filter (Order number or student name/ID)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const numMatch = String(order.number).toLowerCase().includes(q);
      const studentMatch = (order.studentId || '').toLowerCase().includes(q);
      const itemMatch = (order.foodItem || '').toLowerCase().includes(q);
      if (!numMatch && !studentMatch && !itemMatch) {
        return false;
      }
    }
    return true;
  });

  const hasActiveFilters = Boolean(filterItem || searchQuery.trim());

  const handleClearAllFilters = () => {
    if (onFilterChange) onFilterChange('');
    setSearchQuery('');
  };

  return (
    <section className="upcoming-section" aria-label="Upcoming Order Queue">
      {/* Title & Filter Bar */}
      <div className="section-title-bar">
        <div className="title-and-count">
          <div className="title-row">
            <h2 className="section-title">Upcoming Orders</h2>
            <span className="queue-count-tag">
              {queue.length} {queue.length === 1 ? 'order' : 'orders'} waiting
            </span>
          </div>
          {queue.length > 0 && (
            <p className="queue-time-estimate">
              FIFO Dispatch &bull; ~3 min prep time per order &bull; Total wait ~{queue.length * 3} mins
            </p>
          )}
        </div>

        {/* Search & Food Filter Controls */}
        <div className="queue-filter-controls">
          {/* Search by Order # or Student */}
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="queue-search-input"
              placeholder="Search #order or student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search queue by order number or student ID"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search text"
              >
                ✕
              </button>
            )}
          </div>

          {/* Food Item Dropdown Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="filter-by-item" className="sr-only">
              Filter by Food Item:
            </label>
            <MenuSelector
              id="filter-by-item"
              value={filterItem}
              onChange={(e) => onFilterChange(e.target.value)}
              includeAllOption={true}
              allLabel="All Menu Items"
              className="filter-select"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-all-filter-btn"
              onClick={handleClearAllFilters}
              title="Reset search and filters"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Notification Banner */}
      {hasActiveFilters && (
        <div className="filter-active-banner">
          <div className="filter-active-text">
            <span>Filtering by:</span>
            {filterItem && <span className="filter-chip">Item: "{filterItem}"</span>}
            {searchQuery.trim() && <span className="filter-chip">Search: "{searchQuery.trim()}"</span>}
            <span className="filter-count-note">({filteredQueue.length} of {queue.length} match)</span>
          </div>
          <button
            type="button"
            className="filter-reset-link"
            onClick={handleClearAllFilters}
          >
            Show All Orders
          </button>
        </div>
      )}

      {/* Queue Cards Grid or Empty State */}
      {queue.length === 0 ? (
        <div className="empty-queue-container">
          <div className="empty-icon-wrap" aria-hidden="true">
            <span className="empty-icon">☕</span>
          </div>
          <h3 className="empty-title">No Orders in Waiting Queue</h3>
          <p className="empty-subtitle">
            All active cafeteria orders have been served. New tickets issued at the counter will appear here immediately.
          </p>
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="empty-queue-container filter-empty">
          <div className="empty-icon-wrap" aria-hidden="true">
            <span className="empty-icon">🔎</span>
          </div>
          <h3 className="empty-title">No Matching Orders Found</h3>
          <p className="empty-subtitle">
            No waiting orders match your current filter or search criteria.
          </p>
          <button
            type="button"
            className="btn-secondary"
            style={{ marginTop: '1rem' }}
            onClick={handleClearAllFilters}
          >
            Reset Filters & View All {queue.length} Orders
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredQueue.map((order) => {
            // Compute real position (1-indexed) in original waiting queue
            const trueIndex = queue.findIndex(
              (q) => (q.id && q.id === order.id) || q.number === order.number
            );
            const position = trueIndex !== -1 ? trueIndex + 1 : 1;

            return (
              <OrderCard
                key={order.id || `order-${order.number}`}
                order={order}
                position={position}
                isStaff={isStaff}
                onServe={onServeOrder}
                onCancel={onCancelOrder}
                waitMinutesPerOrder={3}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
