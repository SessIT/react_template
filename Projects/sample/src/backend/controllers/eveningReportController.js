const db = require("../../../../../Db-config/db");


/* ===============================
   INSERT EVENING REPORT
================================ */

exports.createEveningReport = (req, res) => {

  const data = req.body;

  const file = req.file ? req.file.filename : null;

  const totalKM =
    (parseInt(data.km_end || 0) - parseInt(data.km_start_exp || 0)) || 0;

  const sql = `
    INSERT INTO evening_reports (
      employee_name,
      report_date,
      senior_junior_evening,
      customer_name_evening,
      customer_type,
      task_status,
      completed_date,
      model_no,
      serial_no,
      tomorrow_plan,
      scope_detail,
      km_start,
      km_start_exp,
      km_end,
      total_km,
      bus_fare,
      bus_detail,
      lodging_fare,
      lodging_detail,
      food_charges,
      local_exp,
      local_exp_detail,
      transport_charge,
      transport_reason,
      auto_charge,
      auto_reason,
      material_cost,
      material_bill,
      attachment_evening
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    data.employee_name,
    data.report_date,
    data.senior_junior_evening,
    data.customer_name_evening,
    data.customer_type,
    data.task_status,
    data.completed_date,
    data.model_no,
    data.serial_no,
    data.tomorrow_plan,
    data.scope_detail,
    data.km_start,
    data.km_start_exp,
    data.km_end,
    totalKM,
    data.bus_fare,
    data.bus_detail,
    data.lodging_fare,
    data.lodging_detail,
    data.food_charges,
    data.local_exp,
    data.local_exp_detail,
    data.transport_charge,
    data.transport_reason,
    data.auto_charge,
    data.auto_reason,
    data.material_cost,
    data.material_bill,
    file
  ];

  db.query(sql, values, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database Error" });
    }

    res.json({
      message: "Evening Report Stored Successfully",
      id: result.insertId
    });

  });

};



/* ===============================
   GET EVENING REPORTS
================================ */

exports.getEveningReports = (req, res) => {

  const sql = "SELECT * FROM evening_reports ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database Error" });
    }

    res.json(result);

  });

};