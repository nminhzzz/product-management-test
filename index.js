const express = require("express");
const systemConfig = require("./config/system");
require("dotenv").config();
const database = require("./config/database");
const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");
const app = express();
const port = process.env.PORT;
database.connect();

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

// App local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// app.get("/", (req, res) => {
//   res.render("client/pages/home/index");
// });
// app.get("/products", async (req, res) => {
//   res.render("client/pages/products/index");
// });
routeClient(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
