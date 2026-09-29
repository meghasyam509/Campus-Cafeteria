import React from 'react';

/**
 * Predefined Cafeteria Menu with Exact Prices
 * 1. Veg Meals — ₹80
 * 2. Chicken Biryani — ₹120
 * 3. Fried Rice — ₹100
 * 4. Noodles — ₹90
 * 5. Samosa — ₹20
 * 6. Sandwich — ₹60
 * 7. Tea — ₹15
 * 8. Coffee — ₹25
 * 9. Cool Drink — ₹30
 */
export const CAFETERIA_MENU = [
  { id: 'veg-meals', name: 'Veg Meals', price: 80, icon: '🍱', counter: 'Counter 1' },
  { id: 'chicken-biryani', name: 'Chicken Biryani', price: 120, icon: '🍗', counter: 'Counter 1' },
  { id: 'fried-rice', name: 'Fried Rice', price: 100, icon: '🍚', counter: 'Counter 1' },
  { id: 'noodles', name: 'Noodles', price: 90, icon: '🍜', counter: 'Counter 1' },
  { id: 'samosa', name: 'Samosa', price: 20, icon: '🥟', counter: 'Counter 2' },
  { id: 'sandwich', name: 'Sandwich', price: 60, icon: '🥪', counter: 'Counter 2' },
  { id: 'tea', name: 'Tea', price: 15, icon: '🍵', counter: 'Counter 3' },
  { id: 'coffee', name: 'Coffee', price: 25, icon: '☕', counter: 'Counter 3' },
  { id: 'cool-drink', name: 'Cool Drink', price: 30, icon: '🥤', counter: 'Counter 3' },
];

/**
 * Helper to retrieve item details by food item name
 */
export function getMenuItemMeta(itemName) {
  const found = CAFETERIA_MENU.find(
    (item) => item.name.toLowerCase() === (itemName || '').toLowerCase()
  );
  return (
    found || {
      id: 'custom',
      name: itemName || 'Custom Item',
      price: 50,
      icon: '🍽️',
      counter: 'Counter 1',
    }
  );
}

/**
 * MenuSelector Component
 * Reusable dropdown for selecting food item or filtering orders
 */
export default function MenuSelector({
  value,
  onChange,
  includeAllOption = false,
  id = 'food-menu-select',
  name = 'foodItem',
  label,
  className = '',
  disabled = false,
  allLabel = 'All Items',
}) {
  return (
    <div className="menu-selector-wrapper">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="select-container">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`menu-select-input ${className}`}
        >
          {includeAllOption && (
            <option value="">
              🍽️ {allLabel}
            </option>
          )}
          {CAFETERIA_MENU.map((item) => (
            <option key={item.id} value={item.name}>
              {item.icon} {item.name} — ₹{item.price} ({item.counter})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
