const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const session = require("express-session");

const flash = require("express-flash");

const systemConfig = require("./config/system");
var methodOverride = require("method-override");

require("dotenv").config();
const database = require("./config/database");
const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");
const app = express();
app.use(methodOverride("_method"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));

//Flash
// Flash
app.use(cookieParser("keyboard cat"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());
//tiny MCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
//end tiny MCE

// App local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// app.get("/", (req, res) => {
//   res.render("client/pages/home/index");
// });
// app.get("/products", async (req, res) => {
//   res.render("client/pages/products/index");
// });

// (async () => {
//   await database.connect();
//   routeClient(app);
//   routeAdmin(app);
// })();
database.connect();
routeClient(app);
routeAdmin(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
