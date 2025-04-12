const mongoose = require("mongoose");


const connectionString = 'mongodb+srv://harshajavvaji04:lf6yqO1bZuib2USu@cluster0.x5lyj.mongodb.net/'

const connectDb = async () => {
    await mongoose.connect(connectionString);
    console.log("MongoDB connected successfully")
}

module.exports = connectDb;