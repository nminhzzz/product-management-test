const express = require("express");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

const controller = require("../../controllers/admin/products-category.controller");
const route = express.Router();
const validate = require("../../validates/admin/products-category.validate");

route.get("/", authMiddleware.requirePermission("products-category_view"), controller.index);
route.get("/create", authMiddleware.requirePermission("products-category_create"), controller.create);
route.post(
  "/create",
  authMiddleware.requirePermission("products-category_create"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);
route.patch("/change-multi", authMiddleware.requirePermission("products-category_edit"), controller.changeMulti);
route.patch("/change-status/:status/:id", authMiddleware.requirePermission("products-category_edit"), controller.changeStatus);
route.get("/edit/:id", authMiddleware.requirePermission("products-category_edit"), controller.edit);
route.patch(
  "/edit/:id",
  authMiddleware.requirePermission("products-category_edit"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPatch
);
route.get("/detail/:id", authMiddleware.requirePermission("products-category_view"), controller.detail);
route.delete("/delete/:id", authMiddleware.requirePermission("products-category_delete"), controller.delete);

module.exports = route;
