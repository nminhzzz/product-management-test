const searchHelper = require("../../helpers/search");
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  const find = {};
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  const products = await Product.find(find);
  console.log(products);
  res.render("client/pages/search/index", {
    titlePage: "kết quả tìm kiếm",
    keyword: keyword,
    products: products,
  });
};
