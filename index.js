const express = require("express");
const route = require("./routes/client/index.route");
const app = express();
const port = 3001;

app.set("views", "./views");
app.set("view engine", "pug");
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
