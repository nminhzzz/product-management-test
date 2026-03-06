const Article = require("../../models/article.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const { prefixAdmin } = require("../../config/system");
const ArticleCategory = require("../../models/articles-category.model");
const createTreeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");

//[GET] /admin/articles
module.exports.index = async (req, res) => {
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

  let objectPagination = {
    limitItems: 4,
    currentPage: 1,
    totalPage: 0,
  };

  const countArticles = await Article.countDocuments(find);

  objectPagination = paginationHelper(
    objectPagination,
    req.query,
    countArticles,
  );

  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const articles = await Article.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const article of articles) {
    if (article.createdBy && article.createdBy.account_id) {
      const user = await Account.findOne({
        _id: article.createdBy.account_id,
      });

      if (user) {
        article.accountFullName = user.fullName;
      }
    }

    if (article.updatedBy && article.updatedBy.length > 0) {
      const updatedBy = article.updatedBy[article.updatedBy.length - 1];
      if (updatedBy && updatedBy.account_id) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id,
        });
        if (userUpdated) {
          updatedBy.accountFullName = userUpdated.fullName;
        }
      }
    }
  }

  res.render("admin/pages/articles/index", {
    pageTitle: "Trang danh sách bài viết",
    articles: articles,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[Patch] /admin/articles/change-status/:status/:id;
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updated = {
    account_id: res.locals.user.id,
    UpdatedAt: new Date(),
  };
  await Article.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updated } },
  );
  req.flash("success", "Thay đổi trạng thái thành công");

  res.redirect(req.get("Referer"));
};

//[patch] /admin/articles/change-multi;
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updated = {
    account_id: res.locals.user.id,
    UpdatedAt: new Date(),
  };
  switch (type) {
    case "active":
      await Article.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updated } },
      );
      req.flash(
        "success",
        `Thay đổi trạng thái ${ids.length} bài viết thành công`,
      );
      break;
    case "inactive":
      await Article.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updated } },
      );
      req.flash(
        "success",
        `Thay đổi trạng thái ${ids.length} bài viết thành công`,
      );
      break;
    case "delete-all":
      await Article.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: { account_id: res.locals.user.id, DeletedAt: new Date() },
        },
      );
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Article.updateOne(
          { _id: id },
          { position: position, $push: { updatedBy: updated } },
        );
      }
      break;
  }
  res.redirect(req.get("Referer"));
};

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Article.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: { account_id: res.locals.user.id, DeletedAt: new Date() },
    },
  );
  res.redirect(req.get("Referer"));
};

//[GET] /admin/articles/create
module.exports.create = async (req, res) => {
  const articleCategory = await ArticleCategory.find();
  const records = createTreeHelper.createTree(articleCategory);
  res.render("admin/pages/articles/create", {
    pageTitle: "Tạo bài viết",
    articleCategory: records,
  });
};

//[POST] /admin/articles/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    req.body.position = (await Article.countDocuments()) + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = { account_id: res.locals.user.id };
  const article = new Article(req.body);
  await article.save();

  res.redirect(`${prefixAdmin}/articles`);
};

module.exports.detail = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  const article = await Article.findOne(find);
  res.render("admin/pages/articles/detail", {
    pageTitle: "Chi tiết bài viết",
    article: article,
  });
};

//[GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const article = await Article.findOne({
      _id: id,
      deleted: false,
    });
    const articleCategory = await ArticleCategory.find();
    const records = createTreeHelper.createTree(articleCategory);

    if (article) {
      res.render("admin/pages/articles/edit", {
        pageTitle: "Chỉnh sửa bài viết",
        article: article,
        articleCategory: records,
      });
    } else {
      res.redirect(`${prefixAdmin}/articles`);
    }
  } catch (error) {
    res.redirect(`${prefixAdmin}/articles`);
  }
};

//[Patch] /admin/articles/edit/:id
module.exports.editPost = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.file && req.file.filename) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countArticles = await Article.countDocuments({});
      req.body.position = countArticles + 1;
    }

    const updated = {
      account_id: res.locals.user.id,
      UpdatedAt: new Date(),
    };

    await Article.updateOne(
      {
        _id: id,
        deleted: false,
      },
      { ...req.body, $push: { updatedBy: updated } },
    );

    req.flash("success", "Cập nhật bài viết thành công!");
  } catch (error) {
    req.flash("error", "Id bài viết không hợp lệ!");
  }
  res.redirect(`${prefixAdmin}/articles`);
};
