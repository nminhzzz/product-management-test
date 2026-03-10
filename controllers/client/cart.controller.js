const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productPriceHelper = require("../../helpers/productPrice");
module.exports.add = async (req, res) => {
  const idProduct = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  // lấy cart
  const cart = await Cart.findOne({ _id: cartId });

  // kiểm tra sản phẩm đã tồn tại chưa
  const productExist = cart.products.find(
    (item) => item.product_id == idProduct,
  );

  if (productExist) {
    // nếu tồn tại → tăng số lượng
    await Cart.updateOne(
      { _id: cartId, "products.product_id": idProduct },
      {
        $inc: {
          "products.$.quantity": quantity,
        },
      },
    );
  } else {
    // nếu chưa tồn tại → thêm mới
    await Cart.updateOne(
      { _id: cartId },
      {
        $push: {
          products: {
            product_id: idProduct,
            quantity: quantity,
          },
        },
      },
    );
  }

  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
  res.redirect(req.get("Referrer") || "/");
};
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (const product of cart.products) {
      const productInfo = await Product.findOne({
        _id: product.product_id,
      }).select("title thumbnail slug price discountPercentage");
      productInfo.priceNew = productPriceHelper.priceNewOneProduct(productInfo);
      product.totalPrice = product.quantity * productInfo.priceNew;
      product.productInfo = productInfo;
    }
  }
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );
  res.render("client/pages/cart/index", {
    pageTitle: "Trang giỏ hàng",
    cartDetail: cart,
  });
  // res.send("ok");
};
