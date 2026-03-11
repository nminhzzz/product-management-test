const User = require("../../models/user.model");
const md5 = require("md5");
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", { pageTitle: "Đăng ký tài khoản " });
};
module.exports.registerPost = async (req, res) => {
  const emailExists = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (emailExists) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    return res.redirect(`user/register`);
  }

  // 2. Xử lý password
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};
