const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Create Express app
const app = express();

// Import routes
const userRouter = require('./apis/user');
const statusRouter = require('./apis/status');

// MongoDB connection
const mongoDBEndpoint = 'mongodb+srv://christytian:banana1234@seawebdev.kjzks.mongodb.net/?retryWrites=true&w=majority&appName=SeaWebDev';
mongoose.connect(mongoDBEndpoint, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/users', userRouter);
app.use('/api/status', statusRouter);

// Serve frontend
let frontend_dir = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});