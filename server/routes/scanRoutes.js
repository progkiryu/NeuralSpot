const express = require("express");
const router = express.Router();
const { scanController, getDiagnosisController } = require("../controllers/scanControllers")

router.post("/", scanController)

module.exports = router;