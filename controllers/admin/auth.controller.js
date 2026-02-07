const Account = require("../../models/account.model");
const { prefixAdmin } = require("../../config/system");
const md5 = require("md5");

module.exports.login = async (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Trang Đăng nhập",
    });
  }
};
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  const user = await Account.findOne({
    email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    return res.redirect(`${prefixAdmin}/auth/login`);
  }

  if (user.status !== "active") {
    req.flash("error", "Tài khoản đã bị khoá");
    return res.redirect(`${prefixAdmin}/auth/login`);
  }

  if (md5(password) !== user.password) {
    req.flash("error", "Sai mật khẩu");
    return res.redirect(`${prefixAdmin}/auth/login`);
  }
  res.cookie("token", user.token);
  req.flash("success", "Đăng nhập thành công");
  res.redirect(`${prefixAdmin}/dashboard`);
};
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${prefixAdmin}/auth/login`);
};
