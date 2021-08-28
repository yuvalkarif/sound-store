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
    errors = errors.array();
    var editedBrand = new Brand({
      name: req.body.name,
      origin: req.body.origin,
      summary: req.body.summary,
    });
    async.waterfall([
      function (callback) {
        Brand.find({ name: req.body.name }).exec(function (err, existingBrand) {
          if (err) {
            return next(err);
          }
          if (existingBrand != "") {
            console.log("-----EXISTING-----");
            console.log("brand", existingBrand);
            errors.push({ msg: "Brand model already exists" });
          }
          callback(null);
        });
      },
      function (callback) {
        if (errors.length >> 0) {
          console.log(errors);
          res.render("brand_edit", {
            title: "Brand Edit",
            brand: editedBrand,
            errors: errors,
          });
          return;
        } else {
          var brand = new Brand(editedBrand);
          brand.save(function (err, theBrand) {
            if (err) {
              return next(err);
            }
            res.redirect(theBrand.url);
          });
        }
        callback(null);
      },
    ]);
  },
];

exports.brand_add_get = function (req, res, next) {
  res.render("brand_add", { title: "Edit Brand", brand: null, errors: null });
};

exports.brand_add_post = [
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
    errors = errors.array();
    var editedBrand = new Brand({
      name: req.body.name,
      origin: req.body.origin,
      summary: req.body.summary,
    });
    async.waterfall([
      function (callback) {
        Brand.find({ name: req.body.name }).exec(function (err, existingBrand) {
          if (err) {
            return next(err);
          }
          if (existingBrand != "") {
            console.log("-----EXISTING-----");
            console.log("brand", existingBrand);
            errors.push({ msg: "Brand model already exists" });
          }
          callback(null);
        });
      },
      function (callback) {
        if (errors.length >> 0) {
          console.log(errors);
          res.render("brand_add", {
            title: "Brand Add",
            brand: editedBrand,
            errors: errors,
          });
          return;
        } else {
          var brand = new Brand(editedBrand);
          brand.save(function (err, theBrand) {
            if (err) {
              return next(err);
            }
            res.redirect(theBrand.url);
          });
        }
        callback(null);
      },
    ]);
  },
];

exports.brand_delete_get = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      items: function (callback) {
        Item.find({ brand: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      console.log(results.items);
      res.render("brand_delete", {
        title: "Delete Brand",
        brand: results.brand,
        items: results.items,
      });
    }
  );
};

exports.brand_delete_post = (req, res, next) => {
  Brand.findByIdAndDelete(req.params.id).exec(function (err, brand) {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/brand");
  });
};
