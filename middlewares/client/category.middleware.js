const ProductCategory = require("../../models/products-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  let find = {
    deleted: false,
  };

  const productCategory = await ProductCategory.find(find);
  const newProductCategory = createTreeHelper.createTree(productCategory);
  res.locals.layoutProductsCategory = newProductCategory;
  next();
};
