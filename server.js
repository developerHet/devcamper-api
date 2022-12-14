const express = require("express");
const dontenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require("./config/db");





// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

//Load env vars
dontenv.config({ path: "./config/config.env" });

//Connect database
connectDB();

const app = express();

//Body Parser
app.use(express.json());

//Cookie Parser 
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Implementing a Basic CSP for hashes error
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "'unsafe-hashes' 'sha256-RFWPLDbv2BY+rCkDzsE+0fr8ylGr2R2faWMhq4lfEQc="
  );
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);
app.use('/api/v1/reviews',reviews);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

//Handle unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit process
  server.close(() => process.exit(1));
});
