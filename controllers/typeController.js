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
exports.type_delete_get = function (req, res, next) {
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
      console.log(results.type);
      res.render("type_delete", {
        title: "Delete type",
        type: results.type,
        items: results.items,
      });
    }
  );
};
exports.type_delete_post = (req, res, next) => {
  Type.findByIdAndDelete(req.params.id).exec(function (err, type) {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/type");
  });
};
exports.type_add_get = function (req, res, next) {
  res.render("type_add", { title: "Edit Type", type: null, errors: null });
};
exports.type_add_post = [
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
    errors = errors.array();
    var editedType = new Type({
      attr: req.body.attr,
      connection: req.body.connection,
      _id: req.params.id,
    });
    async.waterfall(
      [
        function (callback) {
          Type.find({ attr: req.body.attr }).exec(function (err, existingType) {
            if (err) {
              return next(err);
            }
            if (existingType != "") {
              console.log("-----EXISTING-----");
              console.log("type", existingType);
              errors.push({ msg: "Type model already exists" });
            }
            callback(null);
          });
        },
      ],
      function (err, results) {
        if (errors.length >> 0) {
          res.render("type_add", {
            title: "Edit Type",
            type: editedType,
            errors: errors,
          });
          return;
        } else {
          var type = new Type(editedType);
          type.save(function (err, newType) {
            console.log("newType", newType);
            if (err) {
              return next(err);
            }
            res.redirect(newType.url);
          });
        }
      }
    );
  },
];
