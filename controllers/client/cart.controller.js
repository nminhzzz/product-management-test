const Cart = require("../../models/cart.module");

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
