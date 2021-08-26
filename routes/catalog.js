var express = require("express");
var router = express.Router();

var item_controller = require("../controllers/itemController");
var brand_controller = require("../controllers/brandController");
var type_controller = require("../controllers/typeController");

/* GET home page. */
router.get("/item", item_controller.item_list);
router.get("/brand", brand_controller.brand_list);
router.get("/type", type_controller.type_list);
router.get("/item/:id", item_controller.item_detail);
router.get("/item/:id/edit", item_controller.item_edit_get);
router.post("/item/:id/edit", item_controller.item_edit_post);
router.get("/brand/:id", brand_controller.brand_detail);
router.get("/type/:id", type_controller.type_detail);

module.exports = router;
