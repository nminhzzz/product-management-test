const Product = require("../../models/product.model");
const ProductCategory = require("../../models/products-category.model");
const ProductCategoryHelper = require("../../helpers/productCategory");
const ProductPriceHelper = require("../../helpers/productPrice");
module.exports.index = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });

    const newProducts = products.map((item) => {
      item.priceNew = (
        (item.price * (100 - item.discountPercentage)) /
        100
      ).toFixed(0);
      return item;
    });

    res.render("client/pages/products/index", { products: newProducts });
  } catch (error) {
    console.error("INDEX ERROR:", error);
    res.status(500).send("Lỗi server khi tải danh sách sản phẩm");
  }
};
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active",
    };

    const product = await Product.findOne(find);

    if (!product) {
      return res.redirect("/products");
    }
    const newProduct = ProductPriceHelper.priceNewOneProduct(product);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: newProduct,
    });
  } catch (error) {
    res.redirect("/products");
  }
};
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
    });

    const subCategory = await ProductCategoryHelper.getSubCategory(category.id);
    const subCategoryId = subCategory.map((item) => item.id);

    const categoryIds = [category.id, ...subCategoryId];

    const products = await Product.find({
      product_category_id: { $in: categoryIds },
    });

    res.render("client/pages/products/index", { products: products });
  } catch (error) {
    res.redirect("/products");
  }
};
