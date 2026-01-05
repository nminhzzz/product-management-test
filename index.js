const express = require("express");
require("dotenv").config();
const database = require("./config/database");
const route = require("./routes/client/index.route");
const app = express();
const port = process.env.PORT;
database.connect();

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.render("client/pages/home/index");
// });
// app.get("/products", async (req, res) => {
//   res.render("client/pages/products/index");
// });
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
