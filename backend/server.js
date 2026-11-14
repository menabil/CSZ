require("node:dns").setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config();
const express = require("express");
const mongoDBConfig = require("./config/mongoDBConfig");
const app = express();
app.use(express.json());
mongoDBConfig();

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server is running on port: ${port}`);
});
