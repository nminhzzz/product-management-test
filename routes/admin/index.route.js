const systemConfig = require("../../config/system.js");
const productRoute = require("./products.route.js");
const dashboardRoute = require("./dashboard.route.js");
const productsCategoryRoute = require("./products-category.route.js");
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboardRoute);
  app.use(PATH_ADMIN + "/products", productRoute);
  app.use(PATH_ADMIN + "/products-category", productsCategoryRoute);

  // app.use(`${PATH_ADMIN}/products`, productRoute);
};
