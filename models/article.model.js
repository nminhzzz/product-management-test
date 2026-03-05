const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const ArticleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    article_category_id: String,
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

const Article = mongoose.model("Article", ArticleSchema, "article");

module.exports = Article;
