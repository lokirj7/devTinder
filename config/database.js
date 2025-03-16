const mongoose = require("mongoose");

const connectDB = async()=>{
await mongoose.connect(process.env.DB_CONNECTION_URL);
}

module.exports = connectDB

// lokeshkrishna765:87654321