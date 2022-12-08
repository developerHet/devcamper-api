const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: process.cwd() + '/config/config.env' });

const connectDB = async () => {

  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
};

module.exports = connectDB;
