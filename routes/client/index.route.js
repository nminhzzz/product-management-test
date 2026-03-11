const productRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

const articleRoute = require("./articles.route");

const searchRoute = require("./search.route.js");
const cartRoute = require("./cart.route.js");
const checkoutRoute = require("./checkout.route.js");
const userRoute = require("./user.route.js");

module.exports = (app) => {
  app.use(
    categoryMiddleware.category,
    categoryMiddleware.articlesCategory,
    cartMiddleware.cartId,
  );
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/articles", articleRoute);
  app.use("/search", searchRoute);
  app.use("/cart", cartRoute);
  app.use("/checkout", checkoutRoute);
  app.use("/user", userRoute);
};
