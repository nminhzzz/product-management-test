const express = require("express");
const route = express.Router();
const userValidate = require("../../validates/client/user.validate");
const controller = require("../../controllers/client/user.controller");
route.get("/register", controller.register);
route.post("/register", controller.registerPost);
route.get("/login", controller.login);
route.post("/login", userValidate.loginPost, controller.loginPost);
route.get("/logout", controller.logout);
route.get("/password/forgot", controller.forgotPassword);
route.post(
  "/password/forgot",
  userValidate.forgotPasswordPost,
  controller.forgotPasswordPost,
);
route.get("/password/otp", controller.otpPassword);

route.post("/password/otp", controller.otpPasswordPost);

route.get("/password/reset", controller.resetPassword);
route.post("/password/reset", controller.resetPasswordPost);

module.exports = route;
