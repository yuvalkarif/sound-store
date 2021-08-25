var Item = require("../models/item");
var Brand = require("../models/brand");
var Type = require("../models/type");

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
  Brand.findById(req.params.id).exec(function (err, brand) {
    if (err) {
      return next(err);
    }
    res.render("brand_detail", { title: "Brand", brand: brand });
  });
};
