const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config({ path: "./.env" });

mongoose
  .connect(process.env.URI)
  .then((err) => {
    console.log("MyDB is connected");
  })
  .catch((err) => {
    console.log("Check your internet connection");
  });


app.listen(8000, () => {
  console.log("server is running");
});

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/profile", require("./routes/profile"));
app.use("/rbac", require("./routes/rbac"));
app.use("/facilities", require("./routes/creation"));
app.use("/sts", require("./routes/creation"));