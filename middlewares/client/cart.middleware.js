const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    const time = 24 * 60 * 60 * 360 * 1000;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + time),
    });
  } else {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    cart.totalQuantity = cart.products.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
    res.locals.miniCart = cart;
  }
  next();
};
