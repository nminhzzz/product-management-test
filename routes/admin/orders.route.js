const express = require("express");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

const controller = require("../../controllers/admin/orders.controller");
const route = express.Router();

route.get(
  "/",
  authMiddleware.requirePermission("orders_view"),
  controller.index,
);

route.get(
  "/detail/:id",
  authMiddleware.requirePermission("orders_view"),
  controller.detail,
);

route.patch(
  "/change-status/:status/:id",
  authMiddleware.requirePermission("orders_edit"),
  controller.changeStatus,
);

module.exports = route;
