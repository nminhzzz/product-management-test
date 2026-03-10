const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    // user_id:String
    cart_Id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", OrderSchema, "order");

module.exports = Order;
