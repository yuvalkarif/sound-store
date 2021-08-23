var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  model: { type: String, required: true, maxLength: 30 },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  summary: { type: String, maxLength: 380 },
  type: { type: Schema.Types.ObjectId, ref: "Type", required: true },
  stock: {
    type: String,
    required: true,
    enum: ["In Stock", "Few Left", "Out of Stock"],
    default: "Out of Stock",
  },
  price: { type: Number, required: true },
});

ItemSchema.virtual("url").get(function () {
  return "/catalog/item/" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);
