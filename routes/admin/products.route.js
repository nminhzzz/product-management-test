const express = require("express");
const controller = require("../../controllers/admin/products.controller");

const route = express.Router();

// Dùng "/" rõ ràng để đảm bảo map đúng root
route.get("/", controller.products);
route.patch("/change-status/:status/:id", controller.changeStatus);
route.patch("/change-multi", controller.changeMulti);

module.exports = route;
