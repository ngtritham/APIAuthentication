// Import libs
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const monggose = require('mongoose');

monggose.connect('mongodb://localhost/APIAuthentication');

// Import modules
const UsersRoutes = require('./routes/users');

// Constants
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//Routes
app.use('/users', UsersRoutes);

app.listen(port, () => {
    console.log("Server is running on port: " + port);
})