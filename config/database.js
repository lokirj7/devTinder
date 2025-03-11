const mongoose = require("mongoose");

const connectDB = async()=>{
await mongoose.connect("mongodb://lokeshkrishna765:87654321@cluster0-shard-00-00.oyuir.mongodb.net:27017,cluster0-shard-00-01.oyuir.mongodb.net:27017,cluster0-shard-00-02.oyuir.mongodb.net:27017/DivTinder?ssl=true&replicaSet=atlas-kfvsun-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0");
}

module.exports = connectDB

// lokeshkrishna765:87654321