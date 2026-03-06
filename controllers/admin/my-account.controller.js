const md5 = require("md5");
const Account = require("../../models/account.model");
const { prefixAdmin } = require("../../config/system");

module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index");
};
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit");
};
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
  // 1. Check email trùng (trừ chính nó)
  const emailExists = await Account.findOne({
    email: req.body.email,
    deleted: false,
    _id: { $ne: id },
  });
  console.log(req.body);

  if (emailExists) {
    req.flash("error", `Email ${email} đã tồn tại`);
    return res.redirect(`${prefixAdmin}/accounts/edit/${id}`);
  }

  // 2. Xử lý password
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }

  // 3. Update
  await Account.updateOne({ _id: id }, req.body);

  req.flash("success", "Cập nhật tài khoản thành công");
  res.redirect(req.get("Referrer") || `/${prefixAdmin}/my-account`);
};
