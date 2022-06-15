const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//Import Route
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");

dotenv.config({ path: "./config/config.env" });
// dotenv.config();

//Connect to mongo
const db = mongoose.connection;
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log(`Database connected  on '${db.host}' to DB: ${db.name}`);
  })
  .catch((err) => {
    console.log(`Database connect failed ${err}`);
  });

//Middleware
app.use(express.json());

//Route Middlewares
app.use("/", authRoute);
app.use("/api/posts", postsRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
