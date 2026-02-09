const { prefixAdmin } = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect(`${prefixAdmin}/auth/login`);
  }

  const user = await Account.findOne({
    token,
    deleted: false,
    status: "active",
  }).select("-password");

  if (!user) {
    res.clearCookie("token");
    return res.redirect(`${prefixAdmin}/auth/login`);
  } else {
    const role = await Role.findOne({ _id: user.role_id }).select(
      "title permissions",
    );
    res.locals.user = user;
    res.locals.role = role;

    next();
  }
};
