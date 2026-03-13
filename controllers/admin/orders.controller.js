const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const paginationHelper = require("../../helpers/pagination");
const { prefixAdmin } = require("../../config/system");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  const find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Pagination
  const countOrders = await Order.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      limitItems: 10,
      currentPage: 1,
    },
    req.query,
    countOrders,
  );

  // Sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.createdAt = "desc";
  }

  const orders = await Order.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  // Calculate total price for each order
  for (const order of orders) {
    order.totalPrice = order.products.reduce((sum, item) => {
      const priceAfterDiscount =
        item.price * (1 - item.discountPercentage / 100);
      return sum + priceAfterDiscount * item.quantity;
    }, 0);
  }

  res.render("admin/pages/orders/index", {
    pageTitle: "Danh sách đơn hàng",
    orders: orders,
    filterStatus: filterStatus,
    pagination: objectPagination,
    prefixAdmin: prefixAdmin,
  });
};

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (order) {
      // Fetch product details for each item in order
      for (const product of order.products) {
        const productInfo = await Product.findOne({
          _id: product.product_id,
        }).select("title thumbnail");

        if (productInfo) {
          product.productInfo = productInfo;
        }

        product.priceAfterDiscount = (
          product.price *
          (1 - product.discountPercentage / 100)
        ).toFixed(0);
        product.totalPrice = product.priceAfterDiscount * product.quantity;
      }

      order.totalPrice = order.products.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      res.render("admin/pages/orders/detail", {
        pageTitle: "Chi tiết đơn hàng",
        order: order,
      });
    } else {
      res.redirect(`${prefixAdmin}/orders`);
    }
  } catch (error) {
    res.redirect(`${prefixAdmin}/orders`);
  }
};

// [PATCH] /admin/orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  try {
    await Order.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(`${prefixAdmin}/orders`);
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại!");
    res.redirect(`${prefixAdmin}/orders`);
  }
};
