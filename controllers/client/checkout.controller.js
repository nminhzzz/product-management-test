const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productPriceHelper = require("../../helpers/productPrice");
const Order = require("../../models/order.model");

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
  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
  // res.send("ok");
};
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Cart.findOne({ _id: cartId });
  const products = [];
  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("price discountPercentage");
    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;
    products.push(objectProduct);
  }
  const orderInfo = { cart_Id: cartId, userInfo: userInfo, products: products };
  const order = new Order(orderInfo);
  order.save();
  await Cart.updateOne({ _id: cartId }, { products: [] });

  res.redirect(`/checkout/success/${order.id}`);
};
module.exports.success = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("thumbnail title");
    product.productInfo = productInfo;
    product.priceNew = productPriceHelper.priceNewOneProduct(product);
    product.totalPrice = product.priceNew * product.quantity;
  }
  order.totalPrice = order.products.reduce((sum, item) => {
    return sum + item.totalPrice;
  }, 0);
  console.log(order);
  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng Thành công",
    order: order,
  });
};
