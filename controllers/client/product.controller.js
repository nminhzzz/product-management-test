const Product = require("../../models/product.model");
module.exports.index = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });

    const newProducts = products.map((item) => {
      item.priceNew = (
        (item.price * (100 - item.discountPercentage)) /
        100
      ).toFixed(0);
      return item;
    });

    res.render("client/pages/products/index", { products: newProducts });
  } catch (error) {
    console.error("INDEX ERROR:", error);
    res.status(500).send("Lỗi server khi tải danh sách sản phẩm");
  }
};
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };

    const product = await Product.findOne(find);
    console.log(product);

    if (!product) {
      return res.redirect("/products");
    }

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/products");
  }
};
