const Account = require("../../models/account.model");
const { prefixAdmin } = require("../../config/system");
const { json } = require("body-parser");
const Role = require("../../models/role.model");
var md5 = require("md5");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const accounts = await Account.find(find);
  const records = await Account.find({
    deleted: false,
  });

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });

    record.roleTitle = role.title;
  }
  res.render("admin/pages/accounts/index", {
    records: records,
  });
};
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const roles = await Role.find(find);
  res.render("admin/pages/accounts/create", {
    pageTitle: "Trang danh tạo  account",
    roles: roles,
  });
};
//[POST] /admin/products/create

module.exports.createPost = async (req, res) => {
  const emailExits = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExits) {
    req.flash("error", `email ${req.body.email} đã tồn tại`);
    res.redirect(`${prefixAdmin}/accounts/create`);
  } else {
    req.body.password = md5(req.body.password);
    const account = new Account(req.body);
    await account.save();
    res.redirect(`${prefixAdmin}/accounts`);
  }
};
