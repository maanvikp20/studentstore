# StudentStore

A full-stack 3D print store where users can browse inventory, place custom print orders with file uploads, and track their orders. Admins get a complete dashboard with user management, order tracking, automated PrusaSlicer integration, and cost estimation.

**Stack:** React · Express · MongoDB · Cloudinary · PrusaSlicer

---

## Features

- JWT authentication with role-based access (user / admin)
- Inventory browsing with search, filter by material, sort by price, stock indicators
- Cart and checkout flow
- Custom 3D print orders — upload STL, OBJ, 3MF, STEP files
- Server-side Cloudinary uploads (no credentials exposed to the browser)
- Automatic PrusaSlicer slicing for STL and 3MF files
- Gcode stats extraction (print time, filament used, layer count)
- Live client-side cost estimate that updates as you pick a file, material, and quantity
- Admin dashboard — users, orders, custom orders (expandable cards with pricing breakdown + confirmed price), inventory CRUD with image uploads

---

## Project Structure

```
studentstore/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Auth.scss
│       │   ├── Cart.scss
│       │   ├── ItemDetail.scss
│       │   ├── NotFound.scss
│       │   └── Profile.scss
│       ├── pages/
│       │   ├── components/
│       │   │   ├── Admin.jsx
│       │   │   ├── Admin.scss
│       │   │   ├── Cart.jsx
│       │   │   ├── CustomOrders.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── Navbar.jsx
│       │   ├── CustomOrders.jsx
│       │   ├── Inventory.jsx
│       │   ├── ItemDetail.jsx
│       │   ├── Login.jsx
│       │   ├── NotFound.jsx
│       │   ├── Profile.jsx
│       │   └── Register.jsx
│       ├── SASS/
│       │   ├── App.scss
│       │   ├── Home.scss
│       │   └── Inventory.scss
│       ├── utils/
│       │   └── api.js               # All fetch/XHR calls — single source of truth
│       ├── App.jsx
│       └── index.js
│
└── server/
    ├── src/
    │   ├── config/
    │   │   └── db.js                # Mongoose connection
    │   ├── controllers/
    │   │   ├── adminMiddle.js
    │   │   ├── authController.js
    │   │   ├── customOrderController.js
    │   │   ├── inventoryController.js
    │   │   ├── orderController.js
    │   │   └── testimonialController.js
    │   ├── middleware/
    │   │   ├── auth.js
    │   │   ├── errorhandler.js
    │   │   └── upload.js            # Multer + Cloudinary — memory storage
    │   ├── models/
    │   │   ├── CustomOrders.js
    │   │   ├── Inventory.js
    │   │   ├── Orders.js
    │   │   ├── Testimonials.js
    │   │   └── User.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── customOrdersRoutes.js
    │   │   ├── inventoryRoutes.js
    │   │   ├── orderRoutes.js
    │   │   └── testimonialRoutes.js
    │   └── utils/
    │       └── printPricing.js      # Cost-estimation algorithm
    ├── .env
    ├── dropindexes.js               # One-time index cleanup utility
    ├── package.json
    ├── seed-data.js                 # Test data seeder
    └── server.js                    # Entry point
```

---

## Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (free tier is fine)
- PrusaSlicer installed on the server *(optional — slicing falls back to `pending` without it)*

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/studentstore.git
cd studentstore
```

### 2. Set up the server

```bash
cd server
npm install
```

Create `server/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI_JOSE=mongodb+srv://<user>:<pass>@cluster.mongodb.net/StudentStore

JWT_SECRET=your_jwt_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional — slicing falls back to "pending" if not set
PRUSA_SLICER_PATH=/usr/bin/prusa-slicer
PRUSA_CONFIG_PATH=/path/to/config.ini
```

> **Where to find Cloudinary credentials:** log in at cloudinary.com → Dashboard. Your Cloud Name, API Key, and API Secret are all shown on the main page.

### 3. Set up the client

```bash
cd ../client
npm install
```

---

## Running Locally

Open two terminals:

```bash
# Terminal 1 — server
cd server
npm run dev

# Terminal 2 — client
cd client
npm run dev
```

- Server: `http://localhost:5000`
- Client: `http://localhost:5173`

> `api.js` points to `http://localhost:5000/api` by default. Update this constant before deploying.

---

## Seeding Test Data

From the `server/` directory:

```bash
# Only needed once, or after schema changes — clears stale unique indexes
node dropindexes.js

# Populate the database with test users, inventory, orders, and custom orders
node seed-data.js
```

This creates:

- **5 users** (1 admin, 4 regular users)
- **7 inventory items** (mix of in-stock, low-stock, and out-of-stock)
- **5 orders** (all status variants)
- **5 custom orders** (all slice statuses represented — done, error, pending, unsupported — one with a confirmed price already set)
- **5 testimonials**

---

## Test Credentials

All seeded users share the password `password123`.

| Role | Email |
|---|---|
| **Admin** | alice@example.com |
| User | bob@example.com |
| User | charlie@example.com |
| User | diana@example.com |
| User | ethan@example.com |

---

## Testing the App

A full manual QA checklist is in [`TESTING.md`](./TESTING.md). Quick summary of what to hit:

### Auth
Register a new account → log in → update profile → change password.

### Shop
Browse `/inventory` — try search, filter by material, filter by stock status, sort by price. Click through to an item detail page, add to cart, and checkout.

### Custom Orders
Submit a custom order with a `.stl` file. Watch the live price estimate update as you change material and quantity. After submitting, check the order card shows slice status, gcode stats, and estimated cost range.

### Admin (log in as alice@example.com)
- **Overview** — check stat cards match seeded counts, verify low-stock panel shows Raspberry Pi Case (3) and Earphone Holder (0)
- **Users** — promote/demote a user, try deleting your own account (should be blocked)
- **Orders** — change order status via dropdown
- **Custom Orders** — expand a card, check Slicer Output panel, set a confirmed price
- **Inventory** — add a new item with an uploaded image, edit an existing item, delete an item

### Admin cart guards
Log in as alice and visit `/inventory` and any item detail page — no cart buttons should appear anywhere.

---

## API Overview

All protected routes require `Authorization: Bearer <token>` in the request header.

| Resource | Base route | Notes |
|---|---|---|
| Auth | `/api/auth` | Public: register, login. Protected: profile, change-password |
| Inventory | `/api/inventory` | GET is public. POST/PUT/DELETE require auth |
| Orders | `/api/orders` | Auth required |
| Custom Orders | `/api/custom-orders` | Auth required — POST accepts `multipart/form-data` |
| Users | `/api/users` | Admin only |
| Testimonials | `/api/testimonials` | Auth required |

---

## File Upload Flow

All uploads go through Express — the browser never sends anything directly to Cloudinary.

```
Inventory image:
  Browser FormData → multer (memory buffer) → Cloudinary image → URL saved to DB

3D model file:
  Browser FormData → multer (memory buffer) → Cloudinary raw
    → PrusaSlicer CLI (tmp file, auto-deleted) → .gcode
    → Cloudinary raw → both URLs + gcodeStats saved to DB
```

**Accepted 3D file types:** `.stl` `.obj` `.3mf` `.step` `.stp` — max 50 MB  
**Accepted image types:** any `image/*` — max 10 MB

---

## Known Limitations

- **PrusaSlicer** — must be installed on the server with `PRUSA_SLICER_PATH` set. Without it, STL/3MF orders default to `sliceStatus = pending` and no gcode is generated.
- **API URL** — hard-coded to `localhost:5000` in `api.js`. Must be updated before deploying to any other environment.
- **Cost estimates** — carry ±20% uncertainty by design (file size is used as a geometry proxy). Always confirm the final price via the admin dashboard confirmed price field.