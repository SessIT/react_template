const db = require("../../../../../Db-config/db");

/* ===============================
   INSERT MORNING REPORT
================================ */

exports.createMorningReport = (req, res) => {

  const data = req.body;

  const sql = `
    INSERT INTO morning_reports (
      employee_name,
      report_date,
      senior_junior,
      customer_name,
      assigned_by,
      customer_type,
      task_type,
      complaint_date,
      complaint_mode,
      complaint_person,
      complaint_description,
      closure_date,
      priority,
      bill_no,
      bill_date,
      spares_cost,
      service_cost
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    data.employee_name,
    data.report_date,
    data.senior_junior,
    data.customer_name,
    data.assigned_by,
    data.customer_type,
    data.task_type,
    data.complaint_date,
    data.complaint_mode,
    data.complaint_person,
    data.complaint_description,
    data.closure_date,
    data.priority,
    data.bill_no,
    data.bill_date,
    data.spares_cost,
    data.service_cost
  ];

  db.query(sql, values, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database Error" });
    }

    res.json({
      message: "Morning Report Stored Successfully",
      id: result.insertId
    });

  });

};


/* ===============================
   GET MORNING REPORTS
================================ */

exports.getMorningReports = (req, res) => {

  const sql = "SELECT * FROM morning_reports ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database Error" });
    }

    res.json(result);

  });

};