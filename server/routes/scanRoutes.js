const express = require("express");
const router = express.Router();
const { scanController } = require("../controllers/scanControllers")

router.post("/", scanController)

module.exports = router;