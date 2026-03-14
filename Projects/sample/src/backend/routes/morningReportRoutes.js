const express = require("express");
const router = express.Router();

const {
  createMorningReport,
  getMorningReports
} = require("../controllers/morningReportController");


router.post("/morning-report", createMorningReport);
router.get("/morning-reports", getMorningReports);

module.exports = router;