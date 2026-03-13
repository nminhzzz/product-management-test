const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");
const Cart = require("../../models/cart.model");
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
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", { pageTitle: "Đăng nhập tài khoản " });
};
module.exports.loginPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("/user/login");
    return;
  }

  if (md5(req.body.password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("/user/login");
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("/user/login");
    return;
  }
  const cartId = req.cookies.cartId;
  console.log(cartId);
  await Cart.updateOne({ _id: cartId }, { user_id: user.id });
  res.cookie("tokenUser", user.tokenUser);

  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/");
};
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu ",
  });
};
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  console.log(email);

  const user = await User.findOne({ email: email });
  if (!user) {
    req.flash("error", "email không tồn tại");
    res.redirect("/user/password/forgot");
    return;
  }
  // lưu thông tin vào database
  const otp = generateHelper.generateRandomNumber(5);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: new Date(),
  };
  console.log(objectForgotPassword);
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // nếu tồn tại email thì gửi mã OTP qua email
  const subject = "mã otp xác minh lấy lại mật khẩu";
  const html = `mã ${otp} xác minh lấy lại mật khẩu.Thời gina sử dụng là 3 phút`;
  sendMailHelper.sendEmail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Xác thực OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ!");
    res.redirect(`/user/password/otp?email=${email}`);
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu mới",
  });
};
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // kiểm tra nhập lại mật khẩu
  if (password !== confirmPassword) {
    req.flash("error", "Mật khẩu nhập lại không khớp!");
    return res.redirect("back");
  }

  const tokenUser = req.cookies.tokenUser;

  const user = await User.findOne({
    tokenUser: tokenUser,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Người dùng không tồn tại!");
    return res.redirect("/user/login");
  }

  // mã hóa password
  const newPassword = md5(password);

  await User.updateOne({ _id: user._id }, { password: newPassword });

  req.flash("success", "Đổi mật khẩu thành công!");

  res.redirect("/");
};

module.exports.info = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const user = await User.findOne({ tokenUser: tokenUser }).select("-password");
  res.render("client/pages/user/info", { user: user });
};
