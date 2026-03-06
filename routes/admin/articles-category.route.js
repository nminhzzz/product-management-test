const express = require("express");
const route = express.Router();
const controllers = require("../../controllers/admin/articles-category.controller");
const validate = require("../../validates/admin/products-category.validate");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

route.get("/", authMiddleware.requirePermission("articles-category_view"), controllers.index);
route.get("/create", authMiddleware.requirePermission("articles-category_create"), controllers.create);
route.post(
  "/create",
  authMiddleware.requirePermission("articles-category_create"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controllers.createPost,
);
route.patch("/change-status/:status/:id", authMiddleware.requirePermission("articles-category_edit"), controllers.changeStatus);
route.patch("/change-multi", authMiddleware.requirePermission("articles-category_edit"), controllers.changeMulti);
route.get("/detail/:id", authMiddleware.requirePermission("articles-category_view"), controllers.detail);
route.delete("/delete/:id", authMiddleware.requirePermission("articles-category_delete"), controllers.delete);
route.get("/edit/:id", authMiddleware.requirePermission("articles-category_edit"), controllers.edit);
route.patch(
  "/edit/:id",
  authMiddleware.requirePermission("articles-category_edit"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  controllers.editPatch,
);

module.exports = route;
