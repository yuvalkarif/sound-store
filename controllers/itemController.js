var Item = require("../models/item");
var Brand = require("../models/brand");
var Type = require("../models/type");
var async = require("async");
const { body, validationResult } = require("express-validator");

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
exports.item_add_get = function (req, res, next) {
  async.parallel(
    {
      brands: function (callback) {
        Brand.find(callback);
      },
      types: function (callback) {
        Type.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      res.render("item_add", {
        title: "Item Edit",
        brands: results.brands,
        types: results.types,
        errors: null,
      });
    }
  );
};

// Handle item create on POST.
exports.item_add_post = [
  body("model", "Model must not be empty.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("summary", "Summary must not be empty and between 1 to 300 words.")
    .trim()
    .isLength({ min: 1, max: 380 })
    .escape(),
  body("price", "Price should be a number above 0.")
    .trim()
    .isInt({ gt: 0 })
    .escape(),
  body("brand.*").trim().escape(),
  body("type.*").escape(),
  body("stock.*").escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    errors = errors.array();
    var editedItem = new Item({
      model: req.body.model,
      brand: req.body.brand,
      type: req.body.type,
      summary: req.body.summary,
      stock: req.body.stock,
      price: req.body.price,
    });
    Item.find({ model: req.body.model }).exec(function (err, existingItem) {
      if (err) {
        return next(err);
      }
      if (existingItem != null) {
        console.log("-----EXISTING-----");
        errors.push({ msg: "Item model already exists" });
      }
    });

    if (errors.length >> 0) {
      async.parallel(
        {
          brands: function (callback) {
            Brand.find(callback);
          },
          types: function (callback) {
            Type.find(callback);
          },
          itemBrand: function (callback) {
            Brand.findById(editedItem.brand).exec(callback);
          },
          itemType: function (callback) {
            Type.findById(editedItem.type).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          editedItem.type = results.itemType;
          editedItem.brand = results.itemBrand;
          res.render("item_edit", {
            title: "Item Edit",
            item: editedItem,
            brands: results.brands,
            types: results.types,
            errors: errors,
          });
        }
      );
      return;
    } else {
      var item = new Item(editedItem);
      item.save(function (err, newItem) {
        if (err) {
          return next(err);
        }
        res.redirect(newItem.url);
      });
    }
  },
];

// Display item delete form on GET.
exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("brand")
    .populate("type")
    .exec(function (err, item) {
      if (err) {
        return next(err);
      }
      console.log(item);
      res.render("item_delete", {
        title: "Delete Item",
        errors: null,
        item: item,
      });
    });
};

// Handle item delete on POST.
exports.item_delete_post = function (req, res) {
  Item.findByIdAndDelete(req.params.id).exec(function (err, item) {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/item");
  });
};

// Display item update form on GET.
exports.item_edit_get = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id)
          .populate("brand")
          .populate("type")
          .exec(callback);
      },
      brands: function (callback) {
        Brand.find(callback);
      },
      types: function (callback) {
        Type.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      res.render("item_edit", {
        title: "Item Edit",
        item: results.item,
        brands: results.brands,
        types: results.types,
        errors: null,
      });
    }
  );
};

// Handle Author edit on POST.
exports.item_edit_post = [
  body("model", "Model must not be empty.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("summary", "Summary must not be empty and between 1 to 300 words.")
    .trim()
    .isLength({ min: 1, max: 380 })
    .escape(),
  body("price", "Price should be above 0.")
    .trim()
    .isLength({ min: 1 })
    .isInt({ gt: 0 })
    .escape(),
  body("brand.*").trim().escape(),
  body("type.*").escape(),
  body("stock.*").escape(),
  (req, res, next) => {
    var errors = validationResult(req);

    var editedItem = new Item({
      model: req.body.model,
      brand: req.body.brand,
      type: req.body.type,
      summary: req.body.summary,
      stock: req.body.stock,
      price: req.body.price,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands: function (callback) {
            Brand.find(callback);
          },
          types: function (callback) {
            Type.find(callback);
          },
          itemBrand: function (callback) {
            Brand.findById(editedItem.brand).exec(callback);
          },
          itemType: function (callback) {
            Type.findById(editedItem.type).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          editedItem.type = results.itemType;
          editedItem.brand = results.itemBrand;

          res.render("item_edit", {
            title: "Item Edit",
            item: editedItem,
            brands: results.brands,
            types: results.types,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Item.findByIdAndUpdate(
        req.params.id,
        editedItem,
        {},
        function (err, theitem) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to book detail page.
          res.redirect(theitem.url);
        }
      );
    }
  },
];
