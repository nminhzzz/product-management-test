const express = require("express");
const controller = require("../../controllers/admin/products.controller");

const route = express.Router();

// Log mọi request đi qua router này để dễ debug
route.use((req, res, next) => {
  console.log(">>> [ROUTER] /admin/products hit:", req.method, req.originalUrl);
  next();
});

// Dùng "/" rõ ràng để đảm bảo map đúng root
route.get("/", controller.products);

module.exports = route;
