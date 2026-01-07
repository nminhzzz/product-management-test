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
  //pagination
  let objectPagination = {
    limitItems: 4,
    currentPage: 1,
    totalPage: Number,
  };
  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const countProduct = await Products.countDocuments(find);
  objectPagination.totalPage = Math.ceil(
    countProduct / objectPagination.limitItems
  );
  //end pagination

  const products = await Products.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang danh sách sản phẩmmm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
