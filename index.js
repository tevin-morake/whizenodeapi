const express = require('express');// create our server
const app = express();
const dotenv = require('dotenv');// Allows us to work with environment variables stored in the .env file
const mongoose = require('mongoose');// this makes working with mongodb easier
// Import Authentication Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

dotenv.config();//Loads .env files

// Connect to our MongoDB database
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true },
    (err) => {
        if(err)
            console.log('error connecting to the database : ' + err);
        else
            console.log('ScriptWhiz has connected to this MongoDB Cluster!');
    }
);

// MiddleWare Needed for us to work with req body
app.use(express.json());

// Create Route MiddleWare
// In short, the routes are going to be prefixed with  api/user...
app.use('/api/user', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Script Wizard Node Server Is Up & Running'));