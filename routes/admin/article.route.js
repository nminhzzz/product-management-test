const express = require("express");
const route = express.Router();
const controllers = require("../../controllers/admin/articles.controller");
route.get("/", controllers.index);

module.exports = route;
