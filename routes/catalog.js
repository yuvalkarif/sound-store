var express = require("express");
var router = express.Router();

var item_controller = require("../controllers/itemController");

/* GET home page. */
router.get("/", item_controller.item_list);
router.get("/i/:id", item_controller.item_detail);

module.exports = router;
