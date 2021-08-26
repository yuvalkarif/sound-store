var Item = require("../models/item");
var Brand = require("../models/brand");
var Type = require("../models/type");

exports.type_list = function (req, res, next) {
  Type.find({}).exec(function (err, types) {
    if (err) {
      return next(err);
    }

    res.render("type_list", { title: "Browse Types", types: types });
  });
};

// Display detail page for a specific type.
exports.type_detail = function (req, res, next) {
  Type.findById(req.params.id).exec(function (err, type) {
    if (err) {
      return next(err);
    }
    res.render("type_detail", { title: "Type Detail", type: type });
  });
};

exports.type_edit_get = function (req, res, next) {
  Type.findById(req.params.id).exec(function (err, type) {
    if (err) {
      return next(err);
    }
    res.render("type_edit", { title: "Edit Type", type: type, errors: null });
  });
};
