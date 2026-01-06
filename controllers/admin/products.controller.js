const Products = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");

module.exports.products = async (req, res) => {
  //bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  const find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  const objectSearch = objectSearchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const products = await Products.find(find);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang danh sách sản phẩmmm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};
