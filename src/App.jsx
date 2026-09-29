import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import QueueStats from './components/QueueStats';
import StudentView from './components/StudentView';
import StaffPanel from './components/StaffPanel';

// Storage keys for localStorage persistence
const STORAGE_KEY_QUEUE = 'campus_cafeteria_queue_v3';
const STORAGE_KEY_CURRENT = 'campus_cafeteria_current_v3';
const STORAGE_KEY_SERVED = 'campus_cafeteria_served_count_v3';
const STORAGE_KEY_SALES = 'campus_cafeteria_total_sales_v3';
const STORAGE_KEY_HISTORY = 'campus_cafeteria_served_history_v3';

// Default initial demo dataset on first launch
const INITIAL_DEMO_DATA = {
  currentOrder: {
    id: 'demo-104',
    number: 104,
    studentId: 'STU1012',
    foodItem: 'Chicken Biryani',
    quantity: 1,
    price: 120,
    totalAmount: 120,
    pickupCounter: 'Counter 1',
    calledAt: '12:30 PM',
    addedAt: '12:25 PM',
    status: 'Serving',
  },
  queue: [
    {
      id: 'demo-105',
      number: 105,
      studentId: 'STU1018',
      foodItem: 'Veg Meals',
      quantity: 2,
      price: 80,
      totalAmount: 160,
      pickupCounter: 'Counter 1',
      addedAt: '12:28 PM',
      calledAt: null,
      status: 'Waiting',
    },
    {
      id: 'demo-106',
      number: 106,
      studentId: 'STU1024',
      foodItem: 'Samosa',
      quantity: 3,
      price: 20,
      totalAmount: 60,
      pickupCounter: 'Counter 2',
      addedAt: '12:29 PM',
      calledAt: null,
      status: 'Waiting',
    },
    {
      id: 'demo-107',
      number: 107,
      studentId: 'STU1031',
      foodItem: 'Fried Rice',
      quantity: 1,
      price: 100,
      totalAmount: 100,
      pickupCounter: 'Counter 1',
      addedAt: '12:31 PM',
      calledAt: null,
      status: 'Waiting',
    },
    {
      id: 'demo-108',
      number: 108,
      studentId: 'STU1040',
      foodItem: 'Coffee',
      quantity: 2,
      price: 25,
      totalAmount: 50,
      pickupCounter: 'Counter 3',
      addedAt: '12:32 PM',
      calledAt: null,
      status: 'Waiting',
    },
  ],
  servedOrders: [
    {
      id: 'demo-103',
      number: 103,
      studentId: 'STU1008',
      foodItem: 'Sandwich',
      quantity: 1,
      price: 60,
      totalAmount: 60,
      pickupCounter: 'Counter 2',
      addedAt: '12:15 PM',
      calledAt: '12:20 PM',
      servedAt: '12:25 PM',
      status: 'Served',
    },
    {
      id: 'demo-102',
      number: 102,
      studentId: 'STU1005',
      foodItem: 'Chicken Biryani',
      quantity: 2,
      price: 120,
      totalAmount: 240,
      pickupCounter: 'Counter 1',
      addedAt: '12:10 PM',
      calledAt: '12:15 PM',
      servedAt: '12:20 PM',
      status: 'Served',
    },
  ],
  servedCount: 18,
  totalSales: 2180,
};

/**
 * Main Application Component
 */
export default function App() {
  // Navigation active tab: 'student' | 'staff' | 'both'
  const [activeTab, setActiveTab] = useState('student');

  // Audio chime state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Toast feedback state
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // 1. Current Serving Order State
  const [currentOrder, setCurrentOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved !== null) {
        return saved === 'null' ? null : JSON.parse(saved);
      }
      return INITIAL_DEMO_DATA.currentOrder;
    } catch (err) {
      console.error('Error loading current order from localStorage', err);
      return INITIAL_DEMO_DATA.currentOrder;
    }
  });

  // 2. Waiting Queue State
  const [queue, setQueue] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUEUE);
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return INITIAL_DEMO_DATA.queue;
    } catch (err) {
      console.error('Error loading queue from localStorage', err);
      return INITIAL_DEMO_DATA.queue;
    }
  });

  // 3. Cumulative Served Count
  const [servedCount, setServedCount] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVED);
      if (saved !== null) {
        return Number(saved);
      }
      return INITIAL_DEMO_DATA.servedCount;
    } catch (err) {
      console.error('Error loading servedCount from localStorage', err);
      return INITIAL_DEMO_DATA.servedCount;
    }
  });

  // 4. Total Sales Today (Sum of served orders)
  const [totalSales, setTotalSales] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SALES);
      if (saved !== null) {
        return Number(saved);
      }
      return INITIAL_DEMO_DATA.totalSales;
    } catch (err) {
      console.error('Error loading totalSales from localStorage', err);
      return INITIAL_DEMO_DATA.totalSales;
    }
  });

  // 5. Recently Served Orders List
  const [servedOrders, setServedOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return INITIAL_DEMO_DATA.servedOrders;
    } catch (err) {
      console.error('Error loading served history from localStorage', err);
      return INITIAL_DEMO_DATA.servedOrders;
    }
  });

  // Save currentOrder to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentOrder));
    } catch (err) {
      console.error('Error saving currentOrder to localStorage', err);
    }
  }, [currentOrder]);

  // Save queue to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
    } catch (err) {
      console.error('Error saving queue to localStorage', err);
    }
  }, [queue]);

  // Save servedCount to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SERVED, String(servedCount));
    } catch (err) {
      console.error('Error saving servedCount to localStorage', err);
    }
  }, [servedCount]);

  // Save totalSales to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SALES, String(totalSales));
    } catch (err) {
      console.error('Error saving totalSales to localStorage', err);
    }
  }, [totalSales]);

  // Save servedOrders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(servedOrders));
    } catch (err) {
      console.error('Error saving servedOrders to localStorage', err);
    }
  }, [servedOrders]);

  // Toast notification helper
  const showToast = (message, type = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Play pleasant cafeteria chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq, delay, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      // Two-tone dining bell chime (F5 -> A5)
      playTone(698.46, 0, 0.4);
      playTone(880.0, 0.22, 0.6);
    } catch (err) {
      // Audio autoplay policy fallback
    }
  };

  // Format current local time string for new orders
  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate next suggested order number
  const allNumbers = [
    ...(currentOrder ? [currentOrder.number] : []),
    ...queue.map((o) => o.number),
    ...servedOrders.map((o) => o.number),
  ];
  const highestNumber = allNumbers.length > 0 ? Math.max(...allNumbers) : 100;
  const nextSuggestedNumber = highestNumber + 1;

  // 1. ADD ORDER TO QUEUE
  const handleAddOrder = (orderData) => {
    const unitPrice = Number(orderData.price) || 0;
    const qty = Number(orderData.quantity) || 1;
    const total = Number(orderData.totalAmount) || unitPrice * qty;

    const newOrder = {
      id: `order-${Date.now()}-${orderData.number}`,
      number: orderData.number,
      studentId: orderData.studentId,
      foodItem: orderData.foodItem,
      quantity: qty,
      price: unitPrice,
      totalAmount: total,
      pickupCounter: orderData.pickupCounter || 'Counter 1',
      addedAt: getCurrentTimeString(),
      calledAt: null,
      status: 'Waiting',
    };

    setQueue((prevQueue) => [...prevQueue, newOrder]);
    showToast(
      `Order #${orderData.number} (${orderData.foodItem} &times; ${qty} = ₹${total}) added to queue!`,
      'success'
    );
    return true;
  };

  // 2. CALL NEXT ORDER (FIFO)
  const handleCallNext = () => {
    if (queue.length === 0) {
      showToast('No orders waiting in line.', 'warning');
      return;
    }

    const [nextOrder, ...remainingQueue] = queue;

    // If an existing order was already serving, automatically complete it
    if (currentOrder) {
      const completedOrder = {
        ...currentOrder,
        servedAt: getCurrentTimeString(),
        status: 'Served',
      };
      setServedOrders((prev) => [completedOrder, ...prev.slice(0, 9)]);
      setServedCount((prev) => prev + 1);
      setTotalSales((prev) => prev + (Number(currentOrder.totalAmount) || 0));
    }

    const servingOrder = {
      ...nextOrder,
      calledAt: getCurrentTimeString(),
      status: 'Serving',
    };

    setCurrentOrder(servingOrder);
    setQueue(remainingQueue);

    playChime();
    showToast(
      `Now Serving #${servingOrder.number} (${servingOrder.foodItem} &times; ${servingOrder.quantity} = ₹${servingOrder.totalAmount}) at ${servingOrder.pickupCounter}!`,
      'success'
    );
  };

  // 3. MARK SERVED
  const handleMarkServed = (orderToMark) => {
    const target = orderToMark || currentOrder;
    if (!target) {
      showToast('No order currently serving at the counter.', 'warning');
      return;
    }

    const amountToAdd = Number(target.totalAmount) || 0;

    const completedOrder = {
      ...target,
      servedAt: getCurrentTimeString(),
      status: 'Served',
    };

    // Increase today's sales and served count
    setTotalSales((prev) => prev + amountToAdd);
    setServedCount((prev) => prev + 1);
    setServedOrders((prev) => [completedOrder, ...prev.slice(0, 9)]);

    // Clear current serving counter
    setCurrentOrder(null);

    showToast(
      `Order #${target.number} marked as served! Added ₹${amountToAdd} to today's sales.`,
      'success'
    );
  };

  // 4. SERVE SPECIFIC ORDER DIRECTLY
  const handleServeSpecific = (orderToServe) => {
    const remainingQueue = queue.filter(
      (order) => order.id !== orderToServe.id && order.number !== orderToServe.number
    );

    // If an order is already serving, mark it served
    if (currentOrder) {
      const completedOrder = {
        ...currentOrder,
        servedAt: getCurrentTimeString(),
        status: 'Served',
      };
      setServedOrders((prev) => [completedOrder, ...prev.slice(0, 9)]);
      setServedCount((prev) => prev + 1);
      setTotalSales((prev) => prev + (Number(currentOrder.totalAmount) || 0));
    }

    const servingOrder = {
      ...orderToServe,
      calledAt: getCurrentTimeString(),
      status: 'Serving',
    };

    setCurrentOrder(servingOrder);
    setQueue(remainingQueue);

    playChime();
    showToast(
      `Prioritized & serving #${servingOrder.number} (${servingOrder.foodItem})!`,
      'success'
    );
  };

  // 5. REMOVE ORDER FROM QUEUE
  const handleRemoveOrder = (orderToRemove) => {
    setQueue((prevQueue) =>
      prevQueue.filter(
        (order) =>
          order.id !== orderToRemove.id && order.number !== orderToRemove.number
      )
    );
    showToast(
      `Order #${orderToRemove.number} (${orderToRemove.foodItem}) removed from queue.`,
      'danger'
    );
  };

  // 6. RESET QUEUE
  const handleResetQueue = () => {
    setCurrentOrder(null);
    setQueue([]);
    setServedCount(0);
    setTotalSales(0);
    setServedOrders([]);
    showToast('The queue and sales data have been completely reset.', 'info');
  };

  // 7. LOAD SAMPLE DEMO DATA
  const handleLoadDemoData = () => {
    setCurrentOrder(INITIAL_DEMO_DATA.currentOrder);
    setQueue(INITIAL_DEMO_DATA.queue);
    setServedOrders(INITIAL_DEMO_DATA.servedOrders);
    setServedCount(INITIAL_DEMO_DATA.servedCount);
    setTotalSales(INITIAL_DEMO_DATA.totalSales);
    showToast('Sample cafeteria demo orders & sales loaded successfully.', 'success');
  };

  return (
    <div className="app-container">
      {/* 1. Header with branding and live status */}
      <Header
        activeOrdersCount={(currentOrder ? 1 : 0) + queue.length}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      <main className="main-content">
        {/* 2. Navigation Tabs */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          waitingCount={queue.length}
        />

        {/* 3. Live Statistics Cards (5 Cards including Total Sales Today) */}
        <QueueStats
          currentOrder={currentOrder}
          waitingCount={queue.length}
          servedCount={servedCount}
          totalSales={totalSales}
          avgWaitMinutes={3}
        />

        {/* 4. Student View Tab */}
        {activeTab === 'student' && (
          <StudentView
            currentOrder={currentOrder}
            queue={queue}
            servedOrders={servedOrders}
          />
        )}

        {/* 5. Staff Panel Tab */}
        {activeTab === 'staff' && (
          <StaffPanel
            currentOrder={currentOrder}
            queue={queue}
            nextSuggestedNumber={nextSuggestedNumber}
            onAddOrder={handleAddOrder}
            onCallNext={handleCallNext}
            onMarkServed={handleMarkServed}
            onServeSpecific={handleServeSpecific}
            onRemoveOrder={handleRemoveOrder}
            onResetQueue={handleResetQueue}
            onLoadDemoData={handleLoadDemoData}
          />
        )}

        {/* 6. Dual / Split Kiosk View for Counter Displays */}
        {activeTab === 'both' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div className="split-view-banner">
              🖥️ Dual Kiosk Mode: Student Public Display (Top) & Staff Counter Controls (Bottom)
            </div>
            <StudentView
              currentOrder={currentOrder}
              queue={queue}
              servedOrders={servedOrders}
            />
            <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '2rem' }}>
              <StaffPanel
                currentOrder={currentOrder}
                queue={queue}
                nextSuggestedNumber={nextSuggestedNumber}
                onAddOrder={handleAddOrder}
                onCallNext={handleCallNext}
                onMarkServed={handleMarkServed}
                onServeSpecific={handleServeSpecific}
                onRemoveOrder={handleRemoveOrder}
                onResetQueue={handleResetQueue}
                onLoadDemoData={handleLoadDemoData}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Feedback Toast */}
      {toast && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className={`toast ${toast.type}`}>
            <span>
              {toast.type === 'success' && '✅'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'danger' && '🗑️'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
