require("dotenv").config();

const express = require("express")
const router = express.Router()
const morgan = require("morgan")

const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler")

// import routes functions
const ordersRouter = require("./src/routes/orderRoutes")
const customOrderRouter = require("./src/routes/userRoutes")
const inventoryRouter = require("./src/routes/userRoutes")
const testimonialRouter = require("./src/routes/userRoutes")
const userRouter = require("./src/routes/userRoutes")




const app = express()

// Middleware to parse JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan("':method :url :status :res[content-length] - :response-time ms'"))
app.use(cors())


// middleware
app.user(errorHandler)

// Routes
app.use('/api/orders', ordersRouter)
app.use('/api/custom-orders', customOrderRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/testimonialRouter', testimonialRouter)
app.use('/api/userRouter', userRouter)
