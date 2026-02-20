require("dotenv").config();

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

// connect to database
const connectDB = require("./src/config/db")
const errorHandler = require("./src/middleware/errorhandler")

// import routes functions
const ordersRouter = require("./src/routes/orderRoutes")
const customOrderRouter = require("./src/routes/customOrderRoutes")
const inventoryRouter = require("./src/routes/inventoryRoutes")
const testimonialRouter = require("./src/routes/testimonialRoutes")
const userRouter = require("./src/routes/userRoutes")
const authRouter = require("./src/routes/authRoutes")

const app = express()



// IMPORTANT: Middleware order matters!
// 1. CORS first (before body parsers)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://studentstore-client.vercel.app"
  ],
  credentials: true
}));

// 2. Body parsers (MUST be before routes)
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// 3. Logging
app.use(morgan("':method :url :status :res[content-length] - :response-time ms'"))

// 4. Connect to database
console.log(process.env.MONGODB_URI_JOSE)
connectDB(process.env.MONGODB_URI_JOSE);

// 5. Health Check
app.get('/api/health', (req, res) => res.json({ok: true}));

// 6. Routes
app.use('/api/auth', authRouter) // Auth should be first (no dependencies)
app.use('/api/orders', ordersRouter)
app.use('/api/custom-orders', customOrderRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/testimonials', testimonialRouter)
app.use('/api/users', userRouter)

// 7. Error handler (MUST be last)
app.use(errorHandler)

// Start server
app.listen(process.env.PORT || 5000, async () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`)
})