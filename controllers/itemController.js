var Item = require("../models/item");
var Brand = require("../models/brand");
var Type = require("../models/type");

// Display list of all items.
exports.item_list = function (req, res, next) {
  Item.find({})
    .populate("brand")
    .populate("type")
    .exec(function (err, items) {
      if (err) {
        return next(err);
      }

      res.render("item_list", { title: "Browse Items", items: items });
    });
};

// Display detail page for a specific item.
exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("brand")
    .populate("type")
    .exec(function (err, item) {
      if (err) {
        return next(err);
      }
      res.render("item_detail", { title: "Item Detail", item: item });
    });
};

// Display item create form on GET.
exports.item_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: item create GET");
};

// Handle item create on POST.
exports.item_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: item create POST");
};

// Display item delete form on GET.
exports.item_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: item delete GET");
};

// Handle item delete on POST.
exports.item_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: item delete POST");
};

// Display item update form on GET.
exports.item_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.item_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: item update POST");
};
