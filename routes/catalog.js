var express = require("express");
var router = express.Router();

var item_controller = require("../controllers/itemController");
var brand_controller = require("../controllers/brandController");
var type_controller = require("../controllers/typeController");

/* GET home page. */
//---Item-Routers---//
router.get("/", function (req, res, next) {
  res.redirect("/item");
});
router.get("/item", item_controller.item_list);
router.get("/item/add", item_controller.item_add_get);
router.post("/item/add", item_controller.item_add_post);
router.get("/item/:id/delete", item_controller.item_delete_get);
router.post("/item/:id/delete", item_controller.item_delete_post);
router.get("/item/:id", item_controller.item_detail);
router.get("/item/:id/edit", item_controller.item_edit_get);
router.post("/item/:id/edit", item_controller.item_edit_post);
//---Brand-Routers---//
router.get("/brand", brand_controller.brand_list);
router.get("/brand/add", brand_controller.brand_add_get);
router.post("/brand/add", brand_controller.brand_add_post);
router.get("/brand/:id/delete", brand_controller.brand_delete_get);
router.post("/brand/:id/delete", brand_controller.brand_delete_post);
router.get("/brand/:id", brand_controller.brand_detail);
router.get("/brand/:id/edit", brand_controller.brand_edit_get);
router.post("/brand/:id/edit", brand_controller.brand_edit_post);

//---Type-Routers---//
router.get("/type", type_controller.type_list);
router.get("/type/:id/delete", type_controller.type_delete_get);
router.post("/type/:id/delete", type_controller.type_delete_post);
router.get("/type/add", type_controller.type_add_get);
router.post("/type/add", type_controller.type_add_post);
router.get("/type/:id", type_controller.type_detail);
router.get("/type/:id/edit", type_controller.type_edit_get);
router.post("/type/:id/edit", type_controller.type_edit_post);

module.exports = router;
