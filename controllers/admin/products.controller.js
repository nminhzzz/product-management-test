const Products = require("../../models/product.model");
module.exports.products = async (req, res) => {
  console.log(">>> products controller called");
  const products = await Products.find({
    deleted: false,
  });
  console.log(products);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang danh sách sản phẩmmm",
    products: products,
  });
};
