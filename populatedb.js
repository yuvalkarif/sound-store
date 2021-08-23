#! /usr/bin/env node

console.log("Populating for some tech");

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Type = require("./models/type");
var Brand = require("./models/brand");
var Item = require("./models/item");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var types = [];
var brands = [];
var items = [];

function brandCreate(name, origin, summary, cb) {
  branddetail = { name: name };
  if (origin != false) branddetail.origin = origin;
  if (summary != false) branddetail.summary = summary;

  var brand = new Brand(branddetail);

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Brand: " + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

function typeCreate(attr, connection, cb) {
  typedetail = { attr: attr };
  if (connection != false) typedetail.connection = connection;

  var type = new Type(typedetail);
  type.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Type: " + type);
    types.push(type);
    cb(null, type);
  });
}

function itemCreate(model, brand, summary, type, stock, price, cb) {
  itemdetail = {
    model: model,
    brand: brand,
    type: type,
    stock: stock,
    price: price,
  };
  if (summary != false) itemdetail.summary = summary;

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createBrands(cb) {
  async.series(
    [
      function (callback) {
        brandCreate(
          "Apple",
          "United States",
          "Apple Products deliver an unparalleled listening experience with all your devices. Every model connects effortlessly and packs rich, high-quality sound into an innovative wireless design.",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Sony",
          "United States",
          "Sony products are the best when it comes to their excellent noise cancelling and top-notch sound. With well over 40 years of experience they keep on innovating and changing the game",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Bose",
          "United States",
          " Bose is best known for its home audio systems and speakers, noise-cancelling headphones, professional audio products and automobile sound systems.",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Nothing",
          "United Kingdom",
          "Nothing is a new London-based consumer technology company on a mission to remove barriers between people and the technology we all use. ",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          "AirPods",
          brands[0],
          "If you're looking to just listen to music or a few podcasts, the new Airpods is a good choice since the connection never drops and the battery life is longer than the previous version. Plus you can also charge the case wirelessly with any Qi wireless charger. Just don't expect to get a great sound experience and be prepared to lose at least one. ",
          types[0],
          "In Stock",
          119,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "AirPods Pro",
          brands[0],
          "For just $50 more than the original model with the wireless charging case, these are definitely the 'buds to get. They sound better than the originals and have a way better fit and active noise cancelling to boot. If you have an iOS device, just get these.",
          types[0],
          "Few Left",
          197,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Sony WF-1000XM3",
          brands[1],
          "True wireless earbuds are a dime a dozen, and the Sony WF-1000XM3 makes it easy to justify the cost. The design and comfort are good, and connection strength is consistent.If you want stylish noise cancelling earbuds, the WF-1000XM3 needs to be at the top of your list.",
          types[0],
          "In Stock",
          178,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Sony MDR-7506",
          brands[1],
          "The Sony MDR-7506 headphones might not be the best for enjoying your brand new listening station, but there's a reason these are a standard when it comes to audio production and mixing.",
          types[2],
          "In Stock",
          98,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Ear 1",
          brands[3],
          "Nothing's first attempt at true wireless earbuds checks a lot of the right boxes. At only 4.7g, these are some of the lightest and most comfortable earbuds around. The Nothing Ear 1 also sounds pretty good, has active noise cancellation, and has a great microphone.",
          types[0],
          "Out of Stock",
          99,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createTypes(cb) {
  async.parallel(
    [
      function (callback) {
        typeCreate("True Wireless Earbuds", "Bluetooth", callback);
      },
      function (callback) {
        typeCreate("Bone Conduction Earbuds", "Bluetooth", callback);
      },
      function (callback) {
        typeCreate("Studio Headphones", "Cable", callback);
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createBrands, createTypes, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Items: " + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
