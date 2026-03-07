const ProductCategory = require("../../models/products-category.model");
const Product = require("../../models/product.model");
const productPrice = require("../../helpers/productPrice");
const createTreeHelper = require("../../helpers/createTree");

module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    featured: "1",
    status: "active",
    deleted: false,
  })
    .sort({ position: "desc" })
    .limit(6)
    .select("-description");

  const newProductsFeatured = productPrice.priceNewProducts(productsFeatured);

  const productsNew = await Product.find({
    status: "active",
    deleted: false,
  })
    .sort({ position: "desc" })
    .limit(6)
    .select("-description");

  const newProductsNew = productPrice.priceNewProducts(productsNew);
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
