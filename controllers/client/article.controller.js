const Article = require("../../models/article.model");
const ArticleCategory = require("../../models/articles-category.model");
const ArticleCategoryHelper = require("../../helpers/articleCategory");
module.exports.index = async (req, res) => {
  try {
    const articles = await Article.find({
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });
    console.log(res.locals.layoutArticleCategory);
    res.render("client/pages/articles/index", { articles: articles });
  } catch (error) {
    console.error("INDEX ERROR:", error);
    res.status(500).send("Lỗi server khi tải danh sách sản phẩm");
  }
};
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugArticle,
      status: "active",
    };

    const article = await Article.findOne(find);

    if (!article) {
      return res.redirect("/articles");
    }
    res.render("client/pages/articles/detail", {
      pageTitle: article.title,
      article: article,
    });
  } catch (error) {
    res.redirect("/articles");
  }
};
module.exports.category = async (req, res) => {
  try {
    const category = await ArticleCategory.findOne({
      slug: req.params.slugCategory,
    });

    const subCategory = await ArticleCategoryHelper.getSubCategory(category.id);
    console.log(subCategory);
    const subCategoryId = subCategory.map((item) => item.id);

    const categoryIds = [category.id, ...subCategoryId];

    const articles = await Article.find({
      article_category_id: { $in: categoryIds },
    });

    res.render("client/pages/articles/index", { articles: articles });
  } catch (error) {
    res.redirect("/article");
  }
};
