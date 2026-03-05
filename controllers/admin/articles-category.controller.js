const ArticleCategory = require("../../models/articles-category.model");
const createTreeHelper = require("../../helpers/createTree");
const filterStatusHelper = require("../../helpers/filterStatus");
const paginationHelper = require("../../helpers/pagination");

const objectSearchHelper = require("../../helpers/search");

const { prefixAdmin } = require("../../config/system");
module.exports.index = async (req, res, next) => {
  const filterStatus = filterStatusHelper(req.query);

  const find = {
    deleted: false,
  };

  let objectPagination = {
    limitItems: 4,
    currentPage: 1,
    totalPage: 0,
  };
  const countArticlesCategory = await ArticleCategory.countDocuments(find);

  objectPagination = paginationHelper(
    objectPagination,
    req.query,
    countArticlesCategory,
  );
  if (req.query.status) {
    find.status = req.query.status;
  }
  const objectSearch = objectSearchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  const records = await ArticleCategory.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  res.render("admin/pages/articles-category/index", {
    records: records,
    filterStatus: filterStatus,

    pagination: objectPagination,
  });
};
module.exports.create = async (req, res, next) => {
  let find = {
    deleted: false,
  };

  const records = await ArticleCategory.find(find);
  const newRecords = createTreeHelper.createTree(records);
  console.log(newRecords);
  res.render("admin/pages/articles-category/create", {
    records: newRecords,
  });
};
module.exports.createPost = async (req, res, next) => {
  console.log(req.body);
  if (req.body.position == "") {
    req.body.position = (await ArticleCategory.countDocuments()) + 1;
  }
  const articleCategory = new ArticleCategory(req.body);
  console.log(articleCategory);
  await articleCategory.save();
  res.redirect(`${prefixAdmin}/articles-category`);
};
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  await ArticleCategory.updateOne(
    { _id: req.params.id },
    { status: req.params.status },
  );
  res.redirect(`${prefixAdmin}/articles-category`);
};
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await ArticleCategory.updateMany(
        { _id: { $in: ids } },
        { status: "active" },
      );
      req.flash(
        "success",
        `Thay đổi trạng thái ${ids.length} sản phẩm thái thành công`,
      );
      break;
    case "inactive":
      await ArticleCategory.updateMany(
        { _id: { $in: ids } },
        { status: "inactive" },
      );
      req.flash(
        "success",
        `Thay đổi trạng thái ${ids.length} sản phẩm thái thành công`,
      );
      break;
    case "delete-all":
      await ArticleCategory.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deleteAt: new Date() },
      );
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ArticleCategory.updateOne({ _id: id }, { position: position });
      }
      break;
  }
  res.redirect(req.get("Referer"));
};
module.exports.detail = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  const articleCategory = await ArticleCategory.findOne(find);
  res.render("admin/pages/articles-category/detail", {
    articleCategory: articleCategory,
  });
};

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Kiểm tra id có tồn tại không
    if (!id) {
      req.flash("error", "Không tìm thấy ID danh mục");
      return res.redirect("back");
    }

    // 2️⃣ Kiểm tra record có tồn tại không
    const category = await ArticleCategory.findOne({ _id: id });

    if (!category) {
      req.flash("error", "Danh mục không tồn tại");
      return res.redirect("back");
    }

    // 3️⃣ Kiểm tra đã bị xóa chưa
    if (category.deleted === true) {
      req.flash("error", "Danh mục đã bị xóa trước đó");
      return res.redirect("back");
    }

    // 4️⃣ Soft delete
    await ArticleCategory.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    // 5️⃣ Thành công
    req.flash("success", "Xóa danh mục thành công");
    res.redirect(`${prefixAdmin}/articles-category`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Có lỗi xảy ra khi xóa danh mục");
    res.redirect("back");
  }
};

module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const articlesCategory = await ArticleCategory.findOne({ _id: id });

  res.render("admin/pages/articles-category/edit", {
    articlesCategory: articlesCategory,
  });
};
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.file && req.file.filename) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countArticlesCategory = await ArticleCategory.countDocuments({});
      req.body.position = countArticlesCategory + 1;
    }

    await ArticleCategory.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body,
    );

    req.flash("success", "Cập nhật danh mục bài viết thành công!");
    console.log("Cập nhật bài viết thành công");
  } catch (error) {
    req.flash("error", "Id bài viết mục phẩm không hợp lệ!");
  }
  res.redirect(`${prefixAdmin}/articles-category`);
};
