const express = require('express');
const dontenv = require('dotenv');

// Route files
const bootcamps = require('./routes/bootcamps');

//Load env vars
dontenv.config({path: './config/config.env'});

const app = express();

// Mount routers
app.use('/api/v1/bootcamps',bootcamps);



const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
