const ProductCategory = require("../../models/products-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.index = async (req, res) => {
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
  });
};
