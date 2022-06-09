const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//Import Route
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");

dotenv.config();

//Connect to mongo
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("connected to db")
);

//Middleware
app.use(express.json());

//Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postsRoute);

app.listen(3000, () => console.log("Server running"));
