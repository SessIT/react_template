const express = require("express");
const router = express.Router();

// const db = require("../../Db-config/db");
const morningReportRoutes = require("./src/backend/routes/morningReportRoutes.js");
const eveningReportRoutes = require("./src/backend/routes/eveningReportRoutes.js")

router.use("/reports", morningReportRoutes);
router.use("/status", eveningReportRoutes);

// Import Routes
// const authRoutes = require("./src/backend/routes/authRoutes");
// const managerRoutes = require("./src/backend/routes/managerRoutes");
// const employeeRoutes = require("./src/backend/routes/employeeRoutes");

// Default test
router.get("/test", (req, res) => {
  res.json({ message: "✅ API Working Fine!" });
});

// Route mapping
// router.use("/auth", authRoutes);
// router.use("/manager", managerRoutes);
// router.use("/employee", employeeRoutes);


module.exports = router;








// // router.cjs
// const express = require('express');
// const path = require('path');
// const router = express.Router();



// router.use(express.static(path.join(__dirname,'dist')));
// // Catch-all route to serve the index.html file for all routes
// router.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// module.exports = router;