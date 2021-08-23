var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BrandSchema = new Schema({
  name: { type: String, required: true, maxLength: 30 },
  origin: { type: String, maxLength: 56 },
  summary: { type: String, maxLength: 240 },
});

BrandSchema.virtual("url").get(function () {
  return "/catalog/brand/" + this._id;
});

module.exports = mongoose.model("Brand", BrandSchema);
