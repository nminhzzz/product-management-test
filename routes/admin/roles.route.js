const express = require("express");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

const controller = require("../../controllers/admin/roles.controller");
const route = express.Router();

route.get("/", authMiddleware.requirePermission("roles_view"), controller.index);
route.get("/create", authMiddleware.requirePermission("roles_create"), controller.create);
route.post("/create", authMiddleware.requirePermission("roles_create"), controller.createPost);
route.get("/edit/:id", authMiddleware.requirePermission("roles_edit"), controller.edit);
route.patch("/edit/:id", authMiddleware.requirePermission("roles_edit"), controller.editPatch);
route.get("/permission", authMiddleware.requirePermission("roles_permission"), controller.permission);
route.patch("/permission", authMiddleware.requirePermission("roles_permission"), controller.permissionPatch);
route.get("/detail/:id", authMiddleware.requirePermission("roles_view"), controller.detail);
route.delete("/delete/:id", authMiddleware.requirePermission("roles_delete"), controller.delete);

module.exports = route;
