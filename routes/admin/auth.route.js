const express = require("express");
const validate = require("../../validates/admin/auth.validate");
const controller = require("../../controllers/admin/auth.controller");
const route = express.Router();
route.get("/login", controller.login);
route.post("/login", validate.loginPost, controller.loginPost);

module.exports = route;
