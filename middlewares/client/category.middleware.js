const ProductCategory = require("../../models/products-category.model");
const createTreeHelper = require("../../helpers/createTree");
const ArticleCategory = require("../../models/articles-category.model");

module.exports.category = async (req, res, next) => {
  let find = {
    deleted: false,
  };

  const productCategory = await ProductCategory.find(find);
  const newProductCategory = createTreeHelper.createTree(productCategory);
  res.locals.layoutProductsCategory = newProductCategory;
  next();
};
module.exports.articlesCategory = async (req, res, next) => {
  let find = {
    deleted: false,
  };

  const articleCategory = await ArticleCategory.find(find);
  const newArticleCategory = createTreeHelper.createTree(articleCategory);
  res.locals.layoutArticlesCategory = newArticleCategory;
  next();
};
