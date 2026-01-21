const Products = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const objectSearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const Product = require("../../models/product.model");
const { prefixAdmin } = require("../../config/system");
//[GET] /admin/products
module.exports.products = async (req, res) => {
  //bộ lọc
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
  //pagination

  let objectPagination = {
    limitItems: 4,
    currentPage: 1,
    totalPage: 0,
  };

  const countProducts = await Products.countDocuments(find);

  objectPagination = paginationHelper(
    objectPagination,
    req.query,
    countProducts
  );

  //end pagination

  const products = await Products.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang danh sách sản phẩmmm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[Patch] /admin/products/change-status/:status/:id;
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Products.updateOne({ _id: id }, { status: status });
  req.flash("success", "Thay đổi trạng thái thành công");

  res.redirect(req.get("Referer"));
};
//[patch] /admin/products/change-multi;

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Products.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Thay đổi trạng thái ${ids.length} sản phẩm thái thành công`
      );

      break;
    case "inactive":
      await Products.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Thay đổi trạng thái ${ids.length} sản phẩm thái thành công`
      );
      break;
    case "delete-all":
      await Products.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deleteAt: new Date() }
      );
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Products.updateOne({ _id: id }, { position: position });
      }
      break;
  }
  res.redirect(req.get("Referer"));
};

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Products.updateOne(
    { _id: id },
    { deleted: true, deleteAt: new Date() }
  );
  res.redirect(req.get("Referer"));
};
//[GET] /admin/products/create

module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Trang danh tạo  sản phẩm",
  });
};
//[POST] /admin/products/create

module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position == "") {
    req.body.position = (await Product.countDocuments()) + 1;
  }
  req.body.thumbnail = `/uploads/${req.file.filename}`;
  console.log(req.file, req.body);
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${prefixAdmin}/products`);
};
module.exports.detail = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  const product = await Product.findOne(find);
  res.render("admin/pages/products/detail", {
    pageTitle: "Trang chi tiết sản phẩm",
    product: product,
  });
};
