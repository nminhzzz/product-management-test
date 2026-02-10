const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const ProductSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    product_category_id: String,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    createdBy: {
      account_id: String,
      CreatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    slug: { type: String, slug: "title", unique: true },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      DeletedAt: Date,
    },
    updatedBy: [
      {
        account_id: String,
        UpdatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", ProductSchema, "products");

module.exports = Product;
