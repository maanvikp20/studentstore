# How to Access Protected Routes - Student Store API

## Step-by-Step Guide

### Step 1: Register a User (if you don't have one)

**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3MDY2MzQwMDAsImV4cCI6MTcwNzIzODgwMCwic3ViIjoiNjViNGE4ZjBhMWIyYzNkNGU1ZjZnN2g4In0.xyz123...",
    "user": {
      "id": "65b4a8f0a1b2c3d4e5f6g7h8",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### Step 2: Login (if already registered)

**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (Same as register - gives you a token)
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

---

### Step 3: Use the Token to Access Protected Routes

**COPY THE TOKEN** from the response above. Then include it in the `Authorization` header:

**Format:** `Authorization: Bearer YOUR_TOKEN_HERE`

---

## Examples Using Different Tools

### Using Postman

1. **Register/Login** to get your token
2. Go to the **Headers** tab
3. Add a new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual token)
4. Send your request to any protected endpoint

**Example - Get All Custom Orders:**
```
GET http://localhost:5000/api/custom-orders

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Using Thunder Client (VS Code)

1. **Register/Login** to get your token
2. In the request, go to **Headers** section
3. Add:
   - **Header:** `Authorization`
   - **Value:** `Bearer YOUR_TOKEN_HERE`
4. Send request

---

### Using cURL (Command Line)

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# 2. Copy the token from response, then use it:
curl -X GET http://localhost:5000/api/custom-orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Using Fetch (JavaScript/Frontend)

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// 2. Use token to access protected routes
const ordersResponse = await fetch('http://localhost:5000/api/custom-orders', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const orders = await ordersResponse.json();
console.log(orders);
```

---

### Using Axios (JavaScript/Frontend)

```javascript
import axios from 'axios';

// 1. Login
const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'john@example.com',
  password: 'password123'
});

const token = loginResponse.data.data.token;

// 2. Use token for protected routes
const ordersResponse = await axios.get('http://localhost:5000/api/custom-orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

console.log(ordersResponse.data);
```

---

## Protected vs Public Routes

### 🔒 PROTECTED ROUTES (Need Token):

**Custom Orders:**
- `GET /api/custom-orders` - Get all your custom orders
- `GET /api/custom-orders/:id` - Get specific custom order
- `POST /api/custom-orders` - Create custom order
- `PUT /api/custom-orders/:id` - Update custom order
- `DELETE /api/custom-orders/:id` - Delete custom order

**Orders:**
- `GET /api/orders` - Get all your orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

**Users:**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Inventory Management:**
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

**Testimonial Management:**
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

---

### 🌐 PUBLIC ROUTES (No Token Needed):

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**Inventory (View Only):**
- `GET /api/inventory` - View all inventory items
- `GET /api/inventory/:id` - View specific inventory item

**Testimonials (View Only):**
- `GET /api/testimonials` - View all testimonials
- `GET /api/testimonials/:id` - View testimonials by product

---

## Common Errors & Solutions

### ❌ Error: "missing or invalid Authorization Header"
**Solution:** Make sure you're including the header exactly as:
```
Authorization: Bearer YOUR_TOKEN_HERE
```
- Don't forget the word "Bearer" before the token
- There should be ONE SPACE between "Bearer" and the token

---

### ❌ Error: "Unauthorized" or "token failed"
**Solution:** Your token is invalid or expired. Login again to get a new token.

---

### ❌ Error: "Cannot read properties of undefined (reading 'id')"
**Solution:** This means the authentication middleware isn't running. Make sure you replaced the route files with the fixed versions I provided.

---

## Testing Workflow Example

```bash
# Step 1: Register
POST /api/auth/register
Body: {"name": "Test User", "email": "test@test.com", "password": "test123"}
Response: Save the token!

# Step 2: Create a custom order (protected route)
POST /api/custom-orders
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "customerName": "Test User",
  "customerEmail": "test@test.com",
  "orderDetails": ["Item 1", "Item 2"],
  "orderFileURL": "https://example.com/file.pdf"
}

# Step 3: Get all your custom orders
GET /api/custom-orders
Headers: Authorization: Bearer YOUR_TOKEN

# Step 4: View public inventory (no token needed!)
GET /api/inventory
```

---

## Storing Tokens in Frontend

For a real application, you'd typically store the token in:

1. **localStorage** (persists after browser close):
```javascript
localStorage.setItem('token', token);
const savedToken = localStorage.getItem('token');
```

2. **sessionStorage** (cleared when browser closes):
```javascript
sessionStorage.setItem('token', token);
const savedToken = sessionStorage.getItem('token');
```

3. **State Management** (Redux, Context API, etc.)

---

## Security Notes

⚠️ **IMPORTANT:**
- Never share your JWT token publicly
- Tokens expire after 7 days (by default)
- Always use HTTPS in production
- Don't store tokens in cookies without proper security flags
- Make sure your `.env` has a strong `JWT_SECRET`

---

## Quick Test Script

Save this as `test-api.js` and run with `node test-api.js`:

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // 1. Register
    console.log('1. Registering user...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@test.com`, // Unique email
      password: 'test123'
    });
    
    const token = registerRes.data.data.token;
    console.log('✅ Registered! Token:', token.substring(0, 20) + '...');
    
    // 2. Access protected route
    console.log('\n2. Accessing protected route...');
    const ordersRes = await axios.get(`${API_URL}/custom-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Protected route works!');
    console.log('Orders:', ordersRes.data);
    
    // 3. Access public route
    console.log('\n3. Accessing public route...');
    const inventoryRes = await axios.get(`${API_URL}/inventory`);
    console.log('✅ Public route works!');
    console.log('Inventory items:', inventoryRes.data.length);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAPI();
```

---

That's it! You now know how to access both protected and public routes in your Student Store API! 