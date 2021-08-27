async.parallel(
  {
    brand: function (callback) {
      Brand.findById(req.params.id).exec(callback);
    },
    items: function (callback) {
      Item.find("brand", req.params.id).exec(callback);
    },
  },
  function (err, results) {
    if (err) {
      return next(err);
    }
    res.render("brand_detail", {
      brand: results.brand,
      items: results.items,
      errors: null,
    });
  }
);
