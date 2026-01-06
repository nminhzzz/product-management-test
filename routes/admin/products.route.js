const express = require("express");
const controller = require("../../controllers/admin/products.controller");

const route = express.Router();

// Dùng "/" rõ ràng để đảm bảo map đúng root
route.get("/", controller.products);

module.exports = route;
