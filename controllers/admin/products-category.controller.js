const { prefixAdmin } = require("../../config/system");
const ProductCategory = require("../../models/products-category.model");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);
  res.render("admin/pages/products-category/index", { records: records });
};
module.exports.create = (req, res) => {
  res.render("admin/pages/products-category/create");
};

module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    req.body.position = (await ProductCategory.countDocuments()) + 1;
  }
  const productCategory = new ProductCategory(req.body);
  console.log(productCategory);
  await productCategory.save();
  res.redirect(`${prefixAdmin}/products-category`);
};
