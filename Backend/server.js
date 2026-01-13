require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
// Allow multiple local origins for development flexibility
const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            // For dev simplicity, you might uncomment the next line to allow ALL origins (not recommended for auth cookies)
            // return callback(null, true); 
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser()); // Standard cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes Import ---
const clientRoutes = require('./routes/clients/index.route');
const employeeRoutes = require('./routes/employee/index.route');
const adminRoutes = require('./routes/admin/index.route');

// --- Routes Init ---
clientRoutes(app);
employeeRoutes(app);
adminRoutes(app);

// Basic Health Check
app.get('/', (req, res) => {
    res.json({ 
        status: 'success', 
        message: 'Bakery Management System API is running...' 
    });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error', 
        message: err.message 
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    // Sửa DB_NAME thành DB_DATABASE cho khớp với file .env
    console.log(`🔗 Connected to Database: ${process.env.DB_DATABASE} @ ${process.env.DB_HOST}`);
});
