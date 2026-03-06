const express = require("express");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/accounts.controller");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const upload = multer();
const validate = require("../../validates/admin/products-category.validate");
const route = express.Router();

route.get("/", authMiddleware.requirePermission("accounts_view"), controller.index);
route.get("/create", authMiddleware.requirePermission("accounts_create"), controller.create);
route.post(
  "/create",
  authMiddleware.requirePermission("accounts_create"),
  upload.single("avatar"),
  uploadCloud.upload,
  controller.createPost,
);
route.get("/edit/:id", authMiddleware.requirePermission("accounts_edit"), controller.edit);
route.patch(
  "/edit/:id",
  authMiddleware.requirePermission("accounts_edit"),
  upload.single("avatar"),
  uploadCloud.upload,
  controller.editPatch,
);
module.exports = route;
