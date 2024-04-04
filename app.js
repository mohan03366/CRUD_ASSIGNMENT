const express = require('express');
const cors=require('cors')
const app = express();

// Import the auth routes
const authRoutes = require('./router/authRoute');
const databaseconnect = require('./config/databaseConfig');
const cookieparser=require('cookie-parser')

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin:[process.env.CLIENT_URL],
    credentials:true
}))

//databaseconnection
databaseconnect();

// Use the auth routes
app.use('/api', authRoutes);

module.exports=app