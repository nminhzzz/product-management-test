const Cart = require("../../models/cart.module");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    const time = 24 * 60 * 60 * 360 * 1000;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + time),
    });
  } else {
  }
  next();
};
