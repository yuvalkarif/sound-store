var Item = require("../models/item");
var Brand = require("../models/brand");
var Type = require("../models/type");
var async = require("async");
const { body, validationResult } = require("express-validator");

exports.brand_list = function (req, res, next) {
  Brand.find({}).exec(function (err, brands) {
    if (err) {
      return next(err);
    }
    console.log(brands);
    res.render("brand_list", { title: "Browse Brands", brands: brands });
  });
};

exports.brand_detail = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      items: function (callback) {
        Item.find({ brand: req.params.id }).populate("type").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("brand_detail", {
        title: "Brand",
        brand: results.brand,
        items: results.items,
        errors: null,
      });
    }
  );
};

exports.brand_edit_get = function (req, res, next) {
  Brand.findById(req.params.id).exec(function (err, brand) {
    if (err) {
      return next(err);
    }
    res.render("brand_edit", {
      title: "Edit Brand",
      brand: brand,
      errors: null,
    });
  });
};

exports.brand_edit_post = [
  body(
    "name",
    "Please fill the name in the name, with no more than 30 characters ."
  )
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("origin", "Please fill in a valid country.")
    .trim()
    .isLength({ min: 1, max: 56 })
    .escape(),
  body(
    "summary",
    "Please fill in the summary with no more than 240 characters."
  )
    .trim()
    .isLength({ min: 1, max: 240 })
    .escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    var editedBrand = new Brand({
      name: req.body.name,
      origin: req.body.origin,
      summary: req.body.summary,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render("brand_edit", {
        title: "Brand Edit",
        errors: errors.array(),
        brand: editedBrand,
      });
      return;
    } else {
      Brand.findByIdAndUpdate(
        req.params.id,
        editedBrand,
        {},
        function (err, theBrand) {
          if (err) {
            return next(err);
          }
          res.redirect(theBrand.url);
        }
      );
    }
  },
];
