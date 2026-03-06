const express = require("express");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/articles.controller");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const route = express.Router();
const upload = multer();

route.get("/", authMiddleware.requirePermission("articles_view"), controller.index);
route.patch("/change-status/:status/:id", authMiddleware.requirePermission("articles_edit"), controller.changeStatus);
route.delete("/delete/:id", authMiddleware.requirePermission("articles_delete"), controller.delete);
route.get("/create", authMiddleware.requirePermission("articles_create"), controller.create);
route.post(
    "/create",
    authMiddleware.requirePermission("articles_create"),
    upload.single("thumbnail"),
    uploadCloud.upload,
    controller.createPost
);
route.get("/edit/:id", authMiddleware.requirePermission("articles_edit"), controller.edit);
route.patch(
    "/edit/:id",
    authMiddleware.requirePermission("articles_edit"),
    upload.single("thumbnail"),
    uploadCloud.upload,
    controller.editPost
);

route.patch("/change-multi", authMiddleware.requirePermission("articles_edit"), controller.changeMulti);
route.get("/detail/:id", authMiddleware.requirePermission("articles_view"), controller.detail);

module.exports = route;
