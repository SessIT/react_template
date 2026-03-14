const express = require("express");
const router = express.Router();

const multer = require("multer");

const {
  createEveningReport,
  getEveningReports
} = require("../controllers/eveningReportController");


/* ===============================
   FILE UPLOAD CONFIG
================================ */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/backend/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });



/* ===============================
   ROUTES
================================ */

router.post(
  "/evening-report",
  upload.single("attachment_evening"),
  createEveningReport
);

router.get("/evening-reports", getEveningReports);

module.exports = router;