const Products = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
//[GET] /admin/products
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
    totalPage: 0,
  };

  const countProducts = await Products.countDocuments(find);

  objectPagination = paginationHelper(
    objectPagination,
    req.query,
    countProducts
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

//[GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Products.updateOne({ _id: id }, { status: status });
  res.redirect(req.get("Referer"));
};
