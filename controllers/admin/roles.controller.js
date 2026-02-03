const Role = require("../../models/role.model");
const { prefixAdmin } = require("../../config/system");
const { json } = require("body-parser");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const roles = await Role.find(find);
  res.render("admin/pages/roles/index", {
    records: roles,
  });
};
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  res.redirect(`${prefixAdmin}/roles`);
};
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      _id: id,
      deleted: false,
    };
    const record = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
      pageTitle: "sửa nhóm quyền",
      record: record,
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}/roles`);
  }
};
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật nhóm quyền thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật nhóm quyền thất bại!");
  }
  res.redirect("back");
};

module.exports.permission = async (req, res) => {
  const find = {
    deleted: false,
  };
  const roles = await Role.find(find);
  res.render("admin/pages/roles/permission", {
    pageTitle: "Phân quyền",
    records: roles,
  });
};
module.exports.permissionPatch = async (req, res) => {
  try {
    const permission = JSON.parse(req.body.permissions);
    console.log(permission);
    for (const item of permission) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "cập nhật thành công");
  } catch (error) {}
  req.flash("error", "cập nhật thất bại");

  res.redirect(`${prefixAdmin}/roles/permission`);
};
