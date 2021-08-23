var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TypeSchema = new Schema({
  attr: { type: String, required: true, maxLength: 30 },
  connection: { type: String, required: true, maxLength: 30 },
});

TypeSchema.virtual("url").get(function () {
  return "/catalog/type/" + this._id;
});

module.exports = mongoose.model("Type", TypeSchema);
