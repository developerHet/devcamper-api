const express = require("express");
const dontenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Route files
const bootcamps = require("./routes/bootcamps");

//Load env vars
dontenv.config({ path: "./config/config.env" });

//Connect database
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

//Handle unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server and exit process
  server.close(() => process.exit(1));
});
