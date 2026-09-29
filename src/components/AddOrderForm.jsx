import React, { useState, useEffect } from 'react';
import MenuSelector, { CAFETERIA_MENU, getMenuItemMeta } from './MenuSelector';

const COUNTER_OPTIONS = [
  'Counter 1 (Main Food & Meals)',
  'Counter 2 (Snacks & Quick Bites)',
  'Counter 3 (Beverages & Cafe)',
];

/**
 * AddOrderForm Component
 * Contains:
 * - Order Number input
 * - Student Name / ID input
 * - Food Item dropdown
 * - Quantity input
 * - Automatically calculated Price per item
 * - Automatically calculated Total Amount
 * - Pickup Counter dropdown
 * - Add Order button
 * Real-time validation & error handling
 */
export default function AddOrderForm({
  onAddOrder,
  currentOrder,
  queue = [],
  nextSuggestedNumber,
}) {
  const [orderNumber, setOrderNumber] = useState('');
  const [studentId, setStudentId] = useState('');
  const [foodItem, setFoodItem] = useState(CAFETERIA_MENU[1].name); // Default: Chicken Biryani
  const [quantity, setQuantity] = useState(1);
  const [pickupCounter, setPickupCounter] = useState('Counter 1');
  const [errors, setErrors] = useState({});

  // Automatically calculated price and total
  const itemMeta = getMenuItemMeta(foodItem);
  const pricePerItem = itemMeta.price || 0;
  const totalAmount = pricePerItem * (Number(quantity) || 1);

  // Set initial suggested order number
  useEffect(() => {
    if (!orderNumber && nextSuggestedNumber) {
      setOrderNumber(String(nextSuggestedNumber));
    }
  }, [nextSuggestedNumber]);

  // When food item changes, update price and align suggested counter
  const handleFoodItemChange = (e) => {
    const selected = e.target.value;
    setFoodItem(selected);
    const meta = getMenuItemMeta(selected);
    if (meta && meta.counter) {
      setPickupCounter(meta.counter);
    }
    if (errors.foodItem) {
      setErrors((prev) => ({ ...prev, foodItem: '' }));
    }
  };

  // Only allow digits in order number
  const handleOrderNumberChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setOrderNumber(val);
      if (errors.orderNumber) {
        setErrors((prev) => ({ ...prev, orderNumber: '' }));
      }
    }
  };

  // Controlled form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // 1. Order Number Validation
    const trimmedNum = orderNumber.trim();
    if (!trimmedNum) {
      newErrors.orderNumber = 'Order number is required.';
    } else {
      const parsedNum = parseInt(trimmedNum, 10);
      if (isNaN(parsedNum) || parsedNum <= 0) {
        newErrors.orderNumber = 'Please enter a valid positive order number.';
      } else if (currentOrder && parseInt(currentOrder.number, 10) === parsedNum) {
        newErrors.orderNumber = `Order #${parsedNum} is currently being served right now!`;
      } else if (queue.some((order) => parseInt(order.number, 10) === parsedNum)) {
        newErrors.orderNumber = `Order #${parsedNum} is already waiting in queue!`;
      }
    }

    // 2. Student Name or ID Validation
    const trimmedStudent = studentId.trim();
    if (!trimmedStudent) {
      newErrors.studentId = 'Student Name or Student ID is required.';
    }

    // 3. Food Item Validation
    if (!foodItem) {
      newErrors.foodItem = 'Food item must be selected.';
    }

    // 4. Quantity Validation
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 1) {
      newErrors.quantity = 'Quantity must be at least 1.';
    }

    // 5. Pickup Counter Validation
    if (!pickupCounter) {
      newErrors.pickupCounter = 'Pickup counter must be selected.';
    }

    // Stop if validation failed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit new order payload
    const orderPayload = {
      number: parseInt(trimmedNum, 10),
      studentId: trimmedStudent.toUpperCase(),
      foodItem,
      quantity: parsedQty,
      price: pricePerItem,
      totalAmount: pricePerItem * parsedQty,
      pickupCounter: pickupCounter || 'Counter 1',
    };

    const success = onAddOrder(orderPayload);

    if (success !== false) {
      // Advance to next sequential number and reset student ID
      const nextNum = parseInt(trimmedNum, 10) + 1;
      setOrderNumber(String(nextNum));
      setStudentId('');
      setQuantity(1);
      setErrors({});
    }
  };

  const handleQuickAdd = (num) => {
    setOrderNumber(String(num));
    if (errors.orderNumber) {
      setErrors((prev) => ({ ...prev, orderNumber: '' }));
    }
  };

  return (
    <form className="add-order-form" onSubmit={handleSubmit} noValidate>
      {/* 1. Order Number */}
      <div className="form-group">
        <label htmlFor="order-number-input" className="form-label">
          Order Number *
        </label>
        <div className="input-with-prefix">
          <span className="input-prefix" aria-hidden="true">#</span>
          <input
            id="order-number-input"
            type="text"
            inputMode="numeric"
            maxLength={5}
            className={`order-input ${errors.orderNumber ? 'has-error' : ''}`}
            placeholder="e.g. 109"
            value={orderNumber}
            onChange={handleOrderNumberChange}
            aria-invalid={!!errors.orderNumber}
            aria-describedby={errors.orderNumber ? 'order-num-error' : undefined}
          />
        </div>
        {errors.orderNumber && (
          <p id="order-num-error" className="form-error" role="alert">
            <span>⚠️</span> {errors.orderNumber}
          </p>
        )}

        {/* Quick Suggestion Buttons */}
        {nextSuggestedNumber && (
          <div className="preset-buttons">
            <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center' }}>
              Quick:
            </span>
            <button
              type="button"
              className="preset-btn"
              onClick={() => handleQuickAdd(nextSuggestedNumber)}
              title="Use next sequential order number"
            >
              + Next (#{nextSuggestedNumber})
            </button>
            <button
              type="button"
              className="preset-btn"
              onClick={() => handleQuickAdd(nextSuggestedNumber + 1)}
            >
              +# {nextSuggestedNumber + 1}
            </button>
          </div>
        )}
      </div>

      {/* 2. Student Name or ID */}
      <div className="form-group">
        <label htmlFor="student-id-input" className="form-label">
          Student Name / Student ID *
        </label>
        <input
          id="student-id-input"
          type="text"
          className={`order-input text-field ${errors.studentId ? 'has-error' : ''}`}
          placeholder="e.g. STU1024 or Rohit S."
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value);
            if (errors.studentId) setErrors((prev) => ({ ...prev, studentId: '' }));
          }}
          aria-invalid={!!errors.studentId}
          aria-describedby={errors.studentId ? 'student-id-error' : undefined}
        />
        {errors.studentId && (
          <p id="student-id-error" className="form-error" role="alert">
            <span>⚠️</span> {errors.studentId}
          </p>
        )}
      </div>

      {/* 3. Food Item Dropdown */}
      <div className="form-group">
        <MenuSelector
          id="staff-food-item-select"
          label="Food Item (Predefined Menu) *"
          value={foodItem}
          onChange={handleFoodItemChange}
          includeAllOption={false}
        />
        {errors.foodItem && (
          <p className="form-error" role="alert">
            <span>⚠️</span> {errors.foodItem}
          </p>
        )}
      </div>

      {/* 4. Quantity and Pickup Counter */}
      <div className="form-row-two">
        <div className="form-group">
          <label htmlFor="order-quantity-input" className="form-label">
            Quantity *
          </label>
          <div className="quantity-stepper">
            <button
              type="button"
              className="stepper-btn"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <input
              id="order-quantity-input"
              type="number"
              min={1}
              max={20}
              className="quantity-input"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuantity(isNaN(val) ? 1 : Math.max(1, val));
              }}
            />
            <button
              type="button"
              className="stepper-btn"
              onClick={() => setQuantity((prev) => prev + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {errors.quantity && (
            <p className="form-error" role="alert">
              <span>⚠️</span> {errors.quantity}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="order-pickup-counter" className="form-label">
            Pickup Counter *
          </label>
          <select
            id="order-pickup-counter"
            className="menu-select-input"
            value={pickupCounter}
            onChange={(e) => {
              setPickupCounter(e.target.value);
              if (errors.pickupCounter) setErrors((prev) => ({ ...prev, pickupCounter: '' }));
            }}
          >
            <option value="Counter 1">Counter 1 (Main Food & Meals)</option>
            <option value="Counter 2">Counter 2 (Snacks & Quick Bites)</option>
            <option value="Counter 3">Counter 3 (Beverages & Cafe)</option>
          </select>
          {errors.pickupCounter && (
            <p className="form-error" role="alert">
              <span>⚠️</span> {errors.pickupCounter}
            </p>
          )}
        </div>
      </div>

      {/* 5. Live Price & Total Amount Calculation Box */}
      <div className="order-price-summary-box">
        <div className="price-summary-col">
          <span className="summary-label">Price per Item:</span>
          <span className="summary-val">₹{pricePerItem}</span>
        </div>
        <div className="summary-separator">&times;</div>
        <div className="price-summary-col">
          <span className="summary-label">Quantity:</span>
          <span className="summary-val">{quantity}</span>
        </div>
        <div className="summary-separator">=</div>
        <div className="price-summary-col total-col">
          <span className="summary-label">Total Amount:</span>
          <span className="summary-total-val">₹{totalAmount}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
        <span>➕ Add Order</span>
      </button>
    </form>
  );
}
