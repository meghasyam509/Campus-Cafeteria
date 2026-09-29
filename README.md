# Campus Cafeteria Queue Display

A modern, responsive, interview-ready frontend application built with **React.js**, **JavaScript (JSX)**, and **CSS3**, designed to streamline food ordering, reduce pickup counter congestion, calculate order totals, track daily sales, and minimize waiting confusion in collegiate dining halls.

---

## 1. 📌 Project Overview

In busy college cafeterias, rush hours often result in chaotic food pickup counters, student crowding, and frequent misunderstandings about when an order is ready and what is being called.

**Campus Cafeteria Queue Display** solves this problem by providing:
1. A **Student-Facing Public Display** that clearly communicates the active order being served at the counter (`Order #`, `Student ID`, `Food Item`, `Quantity`, `Total Amount`, `Pickup Counter`, and `Called Time`) alongside upcoming waiting order cards and estimated wait-time calculations.
2. A **Staff Control Panel** that enables kitchen and register staff to register new orders, automatically compute item prices and total amounts, call the next order into service, mark fulfilled orders as served (automatically updating the cumulative "Total Sales Today"), prioritize individual orders, remove canceled items, or reset the queue safely.
3. A **Dual Kiosk / Split Mode** allowing cashier and counter staff to monitor both the public display and operational panel simultaneously.

All application data is stored in React component state and persisted in browser `localStorage`. No backend, external database, or third-party UI libraries are used.

---

## 2. ✨ Key Features

- **Predefined Cafeteria Menu with Fixed Prices**:
  - Veg Meals — ₹80 🍱
  - Chicken Biryani — ₹120 🍗
  - Fried Rice — ₹100 🍚
  - Noodles — ₹90 🍜
  - Samosa — ₹20 🥟
  - Sandwich — ₹60 🥪
  - Tea — ₹15 🍵
  - Coffee — ₹25 ☕
  - Cool Drink — ₹30 🥤
- **Automatic Price & Total Amount Calculation**:
  - Selecting a food item in the staff form immediately shows its price per unit.
  - Changing quantity dynamically updates: `Total Amount = Price per Item × Quantity`.
- **"Now Serving" Hero Banner**:
  - Large order number, student name/ID, food item, quantity, unit price, total amount (₹), designated pickup counter, and call timestamp.
- **Upcoming Queue Cards with Status Badges**:
  - Waiting orders display queue position, student ID, food item, quantity, unit price, total amount, pickup counter, estimated wait time (`position × 3 min`), and clear visual status badges (`Waiting`, `Serving`, `Served`).
- **Food-Item Filter Dropdown**:
  - Allows students to filter upcoming orders by: *All Items*, *Veg Meals*, *Chicken Biryani*, *Fried Rice*, *Noodles*, *Samosa*, *Sandwich*, *Tea*, *Coffee*, or *Cool Drink*.
- **Live Dashboard Statistics**:
  - **Current Order**: Active order number & food item at counter.
  - **Waiting Orders**: Number of students currently in line.
  - **Served Today**: Number of fulfilled meals.
  - **Estimated Wait**: Dynamic time (~3 minutes per waiting order).
  - **Total Sales Today**: Cumulative ₹ revenue generated from served orders.
- **Audio Chime System**:
  - Synthesizes a pleasant two-tone dining bell chime using native browser Web Audio API whenever an order is called.
- **Full Data Persistence**:
  - Orders, current serving status, served count, and total sales persist across browser refreshes using `localStorage`.

---

## 3. 🛠️ Technologies Used

- **React 19**: Modern functional components, React Hooks (`useState`, `useEffect`, `useRef`).
- **JavaScript (ESNext / JSX)**: Standard JavaScript and JSX syntax (no TypeScript, pure frontend).
- **CSS3**: Responsive CSS Grid, Flexbox, custom CSS variables, keyframe animations, and mobile-first design.
- **Web Audio API**: Native browser synthesizer for cafeteria notification chimes without external media files.
- **Browser localStorage**: Client-side persistent storage for uninterrupted state recovery.
- **Vite**: Ultra-fast build and development tool.

---

## 4. 🚀 How to Install

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

```bash
# Clone the repository or navigate to the project directory
cd campus-cafeteria-queue

# Install project dependencies
npm install
```

---

## 5. 💻 How to Run

```bash
# Start the Vite local development server
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the URL printed in the terminal).

To create a production build:
```bash
npm run build
npm run preview
```

---

## 6. 👀 How to Operate Student View

1. **Viewing the Active Order**:
   - The large green hero card shows the order currently called to the counter (`#104 - Chicken Biryani × 1`, Total: `₹120`, Counter 1).
   - If no order is currently called, it displays *"Waiting for next order"*.
2. **Checking Upcoming Queue**:
   - Scroll through upcoming order cards to see where your token is located in line, your estimated wait time (`~3 min`, `~6 min`), and the total amount paid.
3. **Filtering by Food Item**:
   - Use the **"Filter by Food Item"** dropdown at the top right of the upcoming queue (e.g., select *Chicken Biryani*) to see only Biryani orders in line.
   - Click **"Show All"** or **"Clear"** to view all waiting orders.
4. **Verifying Past Orders**:
   - Click **"View Completed Orders"** in the Recently Served section to check earlier completed orders and amounts.
5. **Chime Announcement**:
   - Toggle the audio chime button in the header (`🔔 Chime On / 🔕 Chime Off`) to hear dining alerts when orders change.

---

## 7. ⚙️ How to Operate Staff Panel

1. **Adding a New Order**:
   - Enter the **Order Number** (or click a quick preset like `+ Next (#109)`).
   - Enter the **Student Name or Student ID** (e.g., `STU1024` or `Rohit S.`).
   - Select the **Food Item** from the predefined menu dropdown. The price per item automatically updates (e.g., `Chicken Biryani — ₹120`).
   - Adjust the **Quantity** using the `+` / `-` stepper. The Total Amount (`₹240`) recalculates in real-time.
   - Select the **Pickup Counter** (`Counter 1`, `Counter 2`, or `Counter 3`).
   - Click **[ ➕ Add Order ]**. The order immediately appears in both the Staff table and the Student View.
2. **Calling the Next Order (`Call Next`)**:
   - Click **[ 🔔 Call Next ]** to move the first waiting order in the queue to "Now Serving" with status `Serving`, record its `Called Time`, play the audio chime, and update the display.
3. **Marking an Order as Served (`Mark Served`)**:
   - Click **[ ✅ Mark Served ]** when the student collects the meal tray.
   - The order's `totalAmount` is added to **Total Sales Today**, the **Served Today** counter increments by 1, the order is archived to recent history, and the counter is cleared for the next order.
4. **Prioritizing / Serving a Specific Order (`⚡ Call`)**:
   - If an order in line finishes cooking early, click `⚡ Call` in that order's row to call it directly.
5. **Removing an Order (`✕ Remove`)**:
   - Click `✕ Remove` to cancel an order if requested by a customer.
6. **Resetting Queue (`Reset Queue`)**:
   - Click **[ 🗑️ Reset Queue ]** to open a safe confirmation modal before wiping queue and sales data.
7. **Loading Sample Data (`Load Sample Data`)**:
   - Click **[ 🔄 Load Sample Data ]** to restore realistic demo orders anytime for demonstration.

---

## 8. 🧮 How Amount Calculation Works

Every cafeteria menu item has a predefined unit price:

$$\text{Price per Item} \in \{80, 120, 100, 90, 20, 60, 15, 25, 30\}$$

The total amount for an individual order is calculated as:

$$\text{Total Amount} = \text{Price per Item} \times \text{Quantity}$$

*Example*:
- Item: **Chicken Biryani** ($\text{Price} = ₹120$)
- Quantity: $2$
- $\text{Total Amount} = ₹120 \times 2 = ₹240$

**Total Sales Today**:
$$\text{Total Sales Today} = \sum_{\text{order} \in \text{Served Orders}} \text{order.totalAmount}$$

When staff clicks **Mark Served**, `order.totalAmount` is automatically added to `totalSales` in state and updated in `localStorage`.

---

## 9. 🧠 React Concepts Demonstrated

1. **Functional Components & Props**:
   - Reusable components (`Header`, `Navigation`, `QueueStats`, `CurrentOrder`, `OrderCard`, `UpcomingQueue`, `StudentView`, `StaffPanel`, `AddOrderForm`, `MenuSelector`) communicating via props.
2. **State Management (`useState`)**:
   - Coordinated states: `queue`, `currentOrder`, `servedCount`, `totalSales`, `servedOrders`, `activeTab`, `soundEnabled`, `toast`.
   - Lazy initial state functions reading from `localStorage` to avoid unnecessary computations on every render.
3. **Side Effects & Persistence (`useEffect`)**:
   - Synchronizing all state changes into `localStorage` keys so data persists across refreshes.
   - Managing toast timeouts and cleanup timers with `useRef`.
4. **Controlled Form Inputs & Real-time Validation**:
   - Two-way bound inputs for order numbers, student IDs, food items, and quantities.
   - Numeric-only input restriction, duplicate order number checking against active and waiting queues, and inline error alerts.
5. **Derived State & Array Methods**:
   - `map()` for rendering lists of cards and table rows.
   - `filter()` for food item searching and removing/prioritizing orders.
   - Mathematical calculations for `totalAmount`, `estimatedWait`, and `totalSales`.
6. **Conditional Rendering**:
   - Empty states for queue and now-serving cards.
   - View tabs switching (`student` vs `staff` vs `both`).
   - Dynamic buttons enabled/disabled states based on queue contents.

---

## 10. 🎯 Example Demonstration Flow for a College Interview

Follow this step-by-step sequence to present the project:

1. **Introduce the Problem & Dashboard**:
   - Explain the cafeteria bottleneck issue: students crowding counters not knowing when their food is ready.
   - Show the **Student View** with the large **"Now Serving"** card (`#104 Chicken Biryani × 1 = ₹120`), the 4 waiting orders (`#105`, `#106`, `#107`, `#108`), and the **5 Dashboard Metric Cards** including **Total Sales Today (₹2,180)**.
2. **Demonstrate Food Item Filtering**:
   - In Student View, select **"Samosa"** in the "Filter by Food Item" dropdown.
   - Show that only Order `#106` (Samosa) is displayed with its position and wait time.
   - Click **"Show All"** to reset the view.
3. **Switch to Staff Panel & Add a New Order**:
   - Switch tabs to **Staff Panel**.
   - Note that Order Number is pre-filled with the next sequential number (`#109`).
   - Enter Student ID: `STU1024`.
   - Select **Chicken Biryani** from the dropdown — point out how the Price per Item displays **₹120**.
   - Increase Quantity to `2` — point out how the live summary box shows `₹120 × 2 = ₹240`.
   - Click **[ ➕ Add Order ]**.
   - Show the green success toast notification and see Order `#109` appear at the end of the queue.
4. **Demonstrate "Call Next" & Audio Chime**:
   - Click **[ 🔔 Call Next ]**.
   - Listen to the Web Audio chime sound.
   - Point out that Order `#105` is now the active order, its `Called Time` is recorded, and the waiting queue has shortened.
5. **Demonstrate "Mark Served" & Sales Increment**:
   - Click **[ ✅ Mark Served ]**.
   - Notice the **Served Today** count increases by `1`, the **Total Sales Today** increases by the order's total amount, and the counter is freed.
6. **Demonstrate Data Persistence**:
   - Press **F5 / Refresh** the browser page.
   - Show the interviewer that all current orders, waiting queue items, served counts, and total sales remained intact from `localStorage`.
7. **Demonstrate Split Kiosk Mode & Responsiveness**:
   - Switch to **Split / Kiosk** view to show both student monitor and staff station side by side.
   - Shrink browser width to showcase the mobile-friendly responsive layout.
