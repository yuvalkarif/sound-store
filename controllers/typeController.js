var Item = require("../models/item");
var Brand = require("../models/brand");
var Type = require("../models/type");
var async = require("async");
const { body, validationResult } = require("express-validator");

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
  async.parallel(
    {
      type: function (callback) {
        Type.findById(req.params.id).exec(callback);
      },
      items: function (callback) {
        Item.find({ type: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      res.render("type_detail", {
        title: "Browse Types",
        type: results.type,
        items: results.items,
      });
    }
  );
};

exports.type_edit_get = function (req, res, next) {
  Type.findById(req.params.id).exec(function (err, type) {
    if (err) {
      return next(err);
    }
    res.render("type_edit", { title: "Edit Type", type: type, errors: null });
  });
};

exports.type_edit_post = [
  body("attr", "Please fill in the attribute with no more than 30 characters.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body(
    "connection",
    "Please fill in a valid connection with no more than 30 characters"
  )
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    var editedType = new Type({
      attr: req.body.attr,
      connection: req.body.connection,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render("type_edit", {
        title: "Edit Type",
        type: editedType,
        errors: errors.array(),
      });
      return;
    } else {
      Type.findByIdAndUpdate(
        req.params.id,
        editedType,
        {},
        function (err, newType) {
          if (err) {
            return next(err);
          }
          res.redirect(newType.url);
        }
      );
    }
  },
];
