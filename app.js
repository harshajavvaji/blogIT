const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDb = require("./db/connect");
const dotenv = require("dotenv");
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());
connectDb();

app.get("/", (req, res) => {
  res.send("Welcome to home endpt");
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
// app.use("/api/relation", require("./routes/relationRoutes"));
// app.use("/")
// app.use("/api/likes")

app.listen(process.env.PORT, () => {
  console.log("Connected To Backend");
});