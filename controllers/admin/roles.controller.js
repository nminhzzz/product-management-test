const Role = require("../../models/role.model");
const { prefixAdmin } = require("../../config/system");

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
