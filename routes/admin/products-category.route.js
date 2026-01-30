const express = require("express");
const controller = require("../../controllers/admin/products-category.controller");
const route = express.Router();

route.get("/", controller.index);

module.exports = route;
