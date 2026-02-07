const { prefixAdmin } = require("../../config/system");
const Account = require("../../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect(`${prefixAdmin}/auth/login`);
  }

  const user = await Account.findOne({
    token,
    deleted: false,
    status: "active",
  });

  if (!user) {
    res.clearCookie("token");
    return res.redirect(`${prefixAdmin}/auth/login`);
  }

  // (Tuỳ chọn) lưu user để dùng tiếp
  req.user = user;

  next();
};
