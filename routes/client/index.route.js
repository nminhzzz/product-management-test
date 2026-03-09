const productRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const articleRoute = require("./articles.route");

const searchRoute = require("./search.route.js");
module.exports = (app) => {
  app.use(categoryMiddleware.category, categoryMiddleware.articlesCategory);
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/articles", articleRoute);
  app.use("/search", searchRoute);
};
