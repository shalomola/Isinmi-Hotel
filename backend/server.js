const express = require("express")
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const featureRoutes = require('./routes/featureRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const roomRoutes = require('./routes/roomRoutes')
const bookingRoutes = require('./routes/bookingRoutes')

const app = express()

// Middleware to handle CORS
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174", "https://isinmi-omega.vercel.app", "https://isinmi-hotel.vercel.app"].filter(
  Boolean,
);
console.log(
  "CORS allowed origins:",
  allowedOrigins,
  "CLIENT_URL=",
  process.env.CLIENT_URL,
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) return next(); // allow server-to-server requests
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS",
    );
    // res.setHeader('Access-Control-Allow-Credentials', 'true'); // enable if using cookies
    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  }
  return res.status(403).send("CORS policy: Origin not allowed");
});

// Debug: verify route imports are valid
const routesToCheck = {
  authRoutes,
  userRoutes,
  featureRoutes,
  categoryRoutes,
  roomRoutes,
  bookingRoutes
};

// Object.entries(routesToCheck).forEach(([name, r]) => {
//   const type = r === undefined ? 'undefined' : (typeof r);
//   console.log(`[route check] ${name}:`, type, r && (r.stack ? 'router with stack' : Object.keys(r || {})));
// });

// Middleware 
app.use(express.json())
// Connect to database
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/feature', featureRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/booking', bookingRoutes)

app.get('/', (req, res) => {
  res.send('API is running');
});


// Listen for port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
