const { prefixAdmin } = require("../../config/system");
const ProductCategory = require("../../models/products-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  const find = {
    deleted: false,
  };

  let objectPagination = {
    limitItems: 4,
    currentPage: 1,
    totalPage: 0,
  };
  const countProductCategory = await ProductCategory.countDocuments(find);

  objectPagination = paginationHelper(
    objectPagination,
    req.query,
    countProductCategory
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
  const records = await ProductCategory.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  res.render("admin/pages/products-category/index", {
    records: records,
    filterStatus: filterStatus,

    pagination: objectPagination,
  });
};
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.createTree(records);
  console.log(newRecords);
  res.render("admin/pages/products-category/create", {
    records: newRecords,
  });
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
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "active" }
      );
      req.flash(
        "success",
        `Thay đổi trạng thái ${ids.length} sản phẩm thái thành công`
      );
      break;
    case "inactive":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "inactive" }
      );
      req.flash(
        "success",
        `Thay đổi trạng thái ${ids.length} sản phẩm thái thành công`
      );
      break;
    case "delete-all":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deleteAt: new Date() }
      );
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne({ _id: id }, { position: position });
      }
      break;
  }
  res.redirect(req.get("Referer"));
};
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await ProductCategory.updateOne({ _id: id }, { status: status });
  req.flash("success", "Thay đổi trạng thái thành công");

  res.redirect(req.get("Referer"));
};
//[GET] /admin/products/edit/:id

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const productCategory = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });
    let find = {
      deleted: false,
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.createTree(records);
    console.log(newRecords);

    if (productCategory) {
      res.render("admin/pages/products-category/edit", {
        pageTitle: "Chỉnh sửa danh mục sản phẩm",
        productCategory: productCategory,
        records: newRecords,
      });
    } else {
      res.redirect(`${prefixAdmin}/products-category`);
    }
  } catch (error) {
    res.redirect(`${prefixAdmin}/products-category`);
  }
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
      const countProductCategory = await ProductCategory.countDocuments({});
      req.body.position = countProductCategory + 1;
    }

    await ProductCategory.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    req.flash("success", "Cập nhật danh mục sản phẩm thành công!");
    console.log("Cập nhật sản phẩm thành công");
  } catch (error) {
    req.flash("error", "Id sản danh mục phẩm không hợp lệ!");
  }
  res.redirect(`${prefixAdmin}/products-category`);
};
module.exports.detail = async (req, res) => {
  console.log(req.params.id);
  const productCategory = await ProductCategory.findOne({
    _id: req.params.id,
    deleted: false,
  });
  console.log(productCategory);
  res.render(`admin/pages/products-category/detail`, {
    productCategory: productCategory,
  });
};
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true, deleteAt: new Date() }
  );
  res.redirect(req.get("Referer"));
};
