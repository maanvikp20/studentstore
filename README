# StudentStore

A full-stack e-commerce platform for a campus 3D printing store. Users can browse inventory, place orders, and submit custom 3D print jobs with file uploads. Admins manage everything through a dedicated dashboard — reviewing files, slicing models in-browser, uploading G-code, and confirming prices.

**Live demo:** [studentstore-client.vercel.app](https://studentstore-client.vercel.app)  
**Test credentials:** `alice@example.com` / `password123` (admin) · `bob@example.com` / `password123` (user)

---

## Table of Contents

- [Stack](#stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Seeding Test Data](#seeding-test-data)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Custom Order Workflow](#custom-order-workflow)
- [Cost Estimation](#cost-estimation)
- [Known Limitations](#known-limitations)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, SCSS |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| File Storage | Cloudinary |
| Deployment | Vercel (client + server as separate projects) |

---

## Features

- JWT authentication with user and admin roles
- Inventory with search, material filter, stock status indicators, and price sorting
- Shopping cart and checkout flow
- Custom 3D print orders — direct-to-Cloudinary file uploads bypassing Vercel's serverless size limit
- Live client-side cost estimation (file size × material × quantity) before submitting
- Full admin dashboard with tabs for users, orders, custom orders, and inventory
- In-browser slicing via [Kiri:Moto](https://grid.space/kiri) — no install, no account required
- G-code upload per order and admin-confirmed pricing
- Cloudinary image uploads for inventory items

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
│       │   │   ├── Admin.jsx        # Full admin dashboard
│       │   │   ├── Admin.scss
│       │   │   ├── Cart.jsx
│       │   │   ├── CustomOrders.jsx # Customer-facing custom order component
│       │   │   ├── Footer.jsx
│       │   │   └── Navbar.jsx
│       │   ├── CustomOrders.jsx     # Custom orders page
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
│       │   └── api.js               # All API calls — single source of truth
│       ├── App.jsx
│       └── index.js
│
└── server/
    ├── src/
    │   ├── config/
    │   │   └── db.js                # Mongoose connection with cold-start caching
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── customOrderController.js
    │   │   ├── inventoryController.js
    │   │   ├── orderController.js
    │   │   └── testimonialController.js
    │   ├── middleware/
    │   │   ├── auth.js              # JWT verify + requireAdmin guard
    │   │   ├── errorhandler.js
    │   │   └── upload.js            # Multer memory storage + Cloudinary stream
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
    │   │   ├── testimonialRoutes.js
    │   │   └── userRoutes.js
    │   └── utils/
    │       └── printPricing.js      # Cost estimation algorithm
    ├── .env.example                 # Copy to .env and fill in your values
    ├── dropindexes.js               # One-time index cleanup utility
    ├── package.json
    ├── seed-data.js                 # Populates DB with test data
    ├── server.js                    # Entry point
    └── vercel.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/studentstore.git
cd studentstore
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI_JOSE=mongodb+srv://<user>:<password>@cluster.mongodb.net/StudentStore

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Where to find Cloudinary credentials:** log in at cloudinary.com → Dashboard. Your Cloud Name, API Key, and API Secret are on the main page.

### 3. Set up the client

```bash
cd ../client
npm install
cp .env.example .env
```

The default `client/.env` points to `http://localhost:5000/api` — no changes needed for local development.

### 4. Seed the database

```bash
cd ../server
node dropindexes.js   # clears stale indexes — only needed once or after schema changes
node seed-data.js     # populates users, inventory, orders, custom orders, testimonials
```

### 5. Run

Open two terminals:

```bash
# Terminal 1 — server (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — client (http://localhost:3000)
cd client && npm start
```

---

## Seeding Test Data

`seed-data.js` creates the following:

| Collection | Count | Notes |
|---|---|---|
| Users | 5 | 1 admin, 4 regular users |
| Inventory | 7 | Mix of in-stock, low-stock, and out-of-stock |
| Orders | 5 | All status variants |
| Custom Orders | 5 | All slice statuses represented |
| Testimonials | 5 | |

**All seeded accounts use the password `password123`:**

| Role | Email |
|---|---|
| **Admin** | alice@example.com |
| User | bob@example.com |
| User | charlie@example.com |
| User | diana@example.com |
| User | ethan@example.com |

---

## Deployment

The client and server are deployed as two separate Vercel projects.

### Server

```bash
cd server
npx vercel --prod
```

Add these in the Vercel dashboard under **Settings → Environment Variables**:

```
MONGODB_URI_JOSE
JWT_SECRET
JWT_EXPIRES_IN
NODE_ENV=production
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### Client

```bash
cd client
npx vercel --prod
```

Add this in the Vercel dashboard:

```
REACT_APP_API_URL=https://your-server.vercel.app/api
```

> After adding or changing environment variables, always redeploy with `npx vercel --prod` for them to take effect.

---

## API Reference

All protected routes require `Authorization: Bearer <token>`.

| Resource | Base Route | Access |
|---|---|---|
| Auth | `/api/auth` | `register` + `login` public · profile/password protected |
| Inventory | `/api/inventory` | GET public · mutations protected |
| Orders | `/api/orders` | Auth required |
| Custom Orders | `/api/custom-orders` | Auth required |
| Users | `/api/users` | Admin only |
| Testimonials | `/api/testimonials` | Auth required |

### Custom order endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/custom-orders/sign-upload` | Returns signed Cloudinary upload credentials |
| GET | `/api/custom-orders` | Own orders (user) or all orders (admin) |
| POST | `/api/custom-orders` | Create order — JSON body with Cloudinary URL |
| PUT | `/api/custom-orders/:id` | Update fields or set confirmed price |
| DELETE | `/api/custom-orders/:id` | Delete order |
| POST | `/api/custom-orders/:id/gcode` | Admin uploads a `.gcode` file |

### File upload flow

3D files bypass Vercel's 4.5MB serverless body limit via direct Cloudinary upload:

```
1. GET  /api/custom-orders/sign-upload
        → server generates and returns a signed upload signature

2. POST https://api.cloudinary.com/v1_1/<cloud>/raw/upload
        → browser uploads file directly to Cloudinary
        → server is not involved — no size limit

3. POST /api/custom-orders
        → browser sends order form data + Cloudinary URL as JSON
        → server saves the order to MongoDB
```

---

## Custom Order Workflow

### Customer

1. Go to **Custom Orders** → click **New Custom Order**
2. Fill in contact info, material, color, quantity, and order details
3. Attach a `.stl`, `.obj`, `.3mf`, `.step`, or `.stp` file (max 10MB)
4. A live price estimate appears and updates as you change file, material, and quantity
5. Submit — the file uploads directly to Cloudinary with a real-time progress bar

### Admin

1. Open the **Custom Orders** tab in `/admin`
2. Expand an order card to see the file, cost breakdown, and estimate
3. Click **✂ Slice in Browser** → opens [Kiri:Moto](https://grid.space/kiri) with the file preloaded (free, no login)
4. Slice the model and export the `.gcode`
5. Upload the `.gcode` back via the card — status automatically flips to **done**
6. Enter a confirmed price and click **Confirm** — the customer sees the final price on their order

---

## Cost Estimation

Calculated server-side in `utils/printPricing.js`. File size is used as a proxy for geometry complexity — a deliberate zero-dependency tradeoff.

| Tier | File Size | Multiplier | Base Fee |
|---|---|---|---|
| Simple | < 500 KB | 1.0× | $2.00 |
| Moderate | 500 KB – 2 MB | 1.3× | $5.00 |
| Complex | 2 MB – 10 MB | 1.6× | $12.00 |
| Highly Complex | > 10 MB | 2.0× | $22.00 |

Material cost per gram: PLA $0.025 → Resin $0.080. Bulk discounts at 5, 10, and 20+ units. Estimates carry ±20% uncertainty — admin always confirms the final price.

---

## Known Limitations

- **Cloudinary free tier** caps uploads at 10MB per file
- **PrusaSlicer** cannot run on Vercel serverless — slicing is done manually via the Kiri:Moto browser link in the admin dashboard
- **Vercel serverless** has a 4.5MB request body limit — worked around by uploading 3D files directly from the browser to Cloudinary
- **`REACT_APP_API_URL`** must be updated whenever the server URL changes

---

## Contributing

1. Fork the repo
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'add your feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a pull request

---

## License

MIT