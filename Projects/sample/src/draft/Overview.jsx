import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
import { SectionCard, Field, TInput, TSelect, Toast, Ic } from "./SharedUI";

const API_BASE =
  (typeof process !== "undefined" && process.env.REACT_APP_API_BASE_URL) ||
  "http://localhost:5000/api";

const STATUS_COLORS = {
  Present: "#22E5F5",
  Absent: "#FF5C7A",
  Leave: "#F5A623",
  "Half Day": "#8B5CF6",
  WFH: "#3B5BFF",
};

const ICONS = {
  analytics: ["M4 19h16", "M7 16V8", "M12 16V5", "M17 16v-3"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  filter: ["M3 5h18", "M6 12h12", "M10 19h4"],
  download: ["M12 3v12", "M7 10l5 5 5-5", "M5 21h14"],
  table: ["M3 3h18v18H3z", "M3 9h18", "M9 21V9"],
  pie: ["M12 2a10 10 0 1 0 10 10h-10z", "M12 2v10h10"],
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M21 21l-4.35-4.35"],
  reset: ["M3 2v6h6", "M21 22v-6h-6", "M21 8a9 9 0 0 0-15.55-4.24L3 8", "M3 16a9 9 0 0 0 15.55 4.24L21 16"],
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  clock: ["M12 6v6l4 2", "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"],
};

const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

const toNum = (value) => Number(value || 0);

function MetricCard({ title, value, sub, color, icon }) {
  return (
    <div
      className="rounded-2xl border p-4 transition-all duration-300"
      style={{
        background: "linear-gradient(180deg, var(--surf) 0%, rgba(255,255,255,0.02) 100%)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.12em] font-mono font-semibold"
            style={{ color: "var(--pink)" }}
          >
            {title}
          </p>
          <h3
            className="text-2xl font-bold mt-2 leading-none"
            style={{ color: "var(--txt)" }}
          >
            {value}
          </h3>
          <p className="text-xs mt-2" style={{ color: "var(--txt-dim)" }}>
            {sub}
          </p>
        </div>

        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: `${color}18`,
            color,
            border: `1px solid ${color}35`,
          }}
        >
          <Ic d={icon} size={18} />
        </div>
      </div>
    </div>
  );
}

function StatusChip({ label, value, color }) {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-3 py-3 border"
      style={{
        background: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: color }}
        />
        <span className="text-sm font-medium" style={{ color: "var(--txt)" }}>
          {label}
        </span>
      </div>
      <span className="text-sm font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function EmptyState({ title, sub }) {
  return (
    <div
      className="rounded-2xl border px-6 py-12 text-center"
      style={{ borderColor: "var(--border)", background: "var(--surf)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
        style={{
          background: "rgba(59,91,255,0.12)",
          color: "var(--blue)",
        }}
      >
        <Ic d={ICONS.analytics} size={24} />
      </div>
      <h3 className="mt-4 text-lg font-bold" style={{ color: "var(--txt)" }}>
        {title}
      </h3>
      <p className="mt-2 text-sm" style={{ color: "var(--txt-dim)" }}>
        {sub}
      </p>
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-28 rounded-2xl border animate-pulse"
          style={{ background: "var(--surf)", borderColor: "var(--border)" }}
        />
      ))}
    </div>
  );
}

export default function Overview() {
  const defaultRange = getCurrentMonthRange();

  const [filters, setFilters] = useState({
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
    employeeId: "",
  });

  const [viewMode, setViewMode] = useState("chart");
  const [employees, setEmployees] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/employees`);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Employees fetch error:", error);
      showToast("Unable to load employee list.", "error");
    }
  };

  const fetchReport = async (customFilters = filters) => {
    if (!customFilters.startDate || !customFilters.endDate) {
      showToast("Please select start date and end date.", "error");
      return;
    }

    if (customFilters.startDate > customFilters.endDate) {
      showToast("Start date cannot be greater than end date.", "error");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`${API_BASE}/reports/overview`, {
        params: customFilters,
      });

      setRows(Array.isArray(data?.rows) ? data.rows : []);
    } catch (error) {
      console.error("Overview report fetch error:", error);
      showToast("Unable to fetch monthly report data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const handleReset = () => {
    const resetData = {
      startDate: defaultRange.startDate,
      endDate: defaultRange.endDate,
      employeeId: "",
    };
    setFilters(resetData);
    fetchReport(resetData);
  };

  useEffect(() => {
    fetchEmployees();
    fetchReport({
      startDate: defaultRange.startDate,
      endDate: defaultRange.endDate,
      employeeId: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleRows = useMemo(() => {
    if (filters.employeeId) return rows;
    return rows.filter((row) => toNum(row.report_days) > 0);
  }, [rows, filters.employeeId]);

  const summary = useMemo(() => {
    return visibleRows.reduce(
      (acc, row) => {
        acc.employeeCount += 1;
        acc.reportDays += toNum(row.report_days);
        acc.presentDays += toNum(row.present_days);
        acc.absentDays += toNum(row.absent_days);
        acc.leaveDays += toNum(row.leave_days);
        acc.halfDays += toNum(row.half_days);
        acc.wfhDays += toNum(row.wfh_days);
        acc.totalWorkedHours += toNum(row.total_worked_hours);
        acc.overtimeHours += toNum(row.overtime_hours);
        return acc;
      },
      {
        employeeCount: 0,
        reportDays: 0,
        presentDays: 0,
        absentDays: 0,
        leaveDays: 0,
        halfDays: 0,
        wfhDays: 0,
        totalWorkedHours: 0,
        overtimeHours: 0,
      }
    );
  }, [visibleRows]);

  const chartData = useMemo(() => {
    const data = [
      {
        name: "Present",
        value: summary.presentDays,
        color: STATUS_COLORS.Present,
      },
      {
        name: "Absent",
        value: summary.absentDays,
        color: STATUS_COLORS.Absent,
      },
      {
        name: "Leave",
        value: summary.leaveDays,
        color: STATUS_COLORS.Leave,
      },
      {
        name: "Half Day",
        value: summary.halfDays,
        color: STATUS_COLORS["Half Day"],
      },
      {
        name: "WFH",
        value: summary.wfhDays,
        color: STATUS_COLORS.WFH,
      },
    ];

    return data.filter((item) => item.value > 0);
  }, [summary]);

  const selectedEmployeeName = useMemo(() => {
    if (!filters.employeeId) return "All Employees";
    const selected = employees.find(
      (emp) => String(emp.id) === String(filters.employeeId)
    );
    return selected ? selected.full_name : "Selected Employee";
  }, [employees, filters.employeeId]);

  const exportRows = useMemo(() => {
    return visibleRows.map((row) => ({
      "Employee Code": row.emp_code || "-",
      Employee: row.full_name || "-",
      Department: row.department || "-",
      "Report Days": toNum(row.report_days),
      Present: toNum(row.present_days),
      Absent: toNum(row.absent_days),
      Leave: toNum(row.leave_days),
      "Half Day": toNum(row.half_days),
      WFH: toNum(row.wfh_days),
      "Worked Hours": toNum(row.total_worked_hours).toFixed(2),
      Overtime: toNum(row.overtime_hours).toFixed(2),
    }));
  }, [visibleRows]);

  const downloadExcel = () => {
    if (!exportRows.length) {
      showToast("No report data available to export.", "error");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 24 },
      { wch: 20 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 14 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Overview Report");
    XLSX.writeFile(
      workbook,
      `employee_overview_${filters.startDate}_to_${filters.endDate}.xlsx`
    );

    showToast("Excel report downloaded successfully.");
  };

  const downloadPDF = () => {
    if (!exportRows.length) {
      showToast("No report data available to export.", "error");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.text("Employee Monthly Work Overview", 14, 15);

    doc.setFontSize(10);
    doc.text(
      `Employee: ${selectedEmployeeName} | Date Range: ${filters.startDate} to ${filters.endDate}`,
      14,
      23
    );

    autoTable(doc, {
      startY: 30,
      head: [[
        "Emp Code",
        "Employee",
        "Department",
        "Report Days",
        "Present",
        "Absent",
        "Leave",
        "Half Day",
        "WFH",
        "Worked Hours",
        "Overtime",
      ]],
      body: visibleRows.map((row) => [
        row.emp_code || "-",
        row.full_name || "-",
        row.department || "-",
        toNum(row.report_days),
        toNum(row.present_days),
        toNum(row.absent_days),
        toNum(row.leave_days),
        toNum(row.half_days),
        toNum(row.wfh_days),
        toNum(row.total_worked_hours).toFixed(2),
        toNum(row.overtime_hours).toFixed(2),
      ]),
      headStyles: {
        fillColor: [59, 91, 255],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [246, 248, 252],
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    doc.save(
      `employee_overview_${filters.startDate}_to_${filters.endDate}.pdf`
    );

    showToast("PDF report downloaded successfully.");
  };

  const metricCards = [
    {
      title: "Employees",
      value: summary.employeeCount,
      sub: "Employees in current report",
      color: "#3B5BFF",
      icon: ICONS.users,
    },
    {
      title: "Present Days",
      value: summary.presentDays,
      sub: "Total present entries",
      color: "#22E5F5",
      icon: ICONS.analytics,
    },
    {
      title: "Worked Hours",
      value: summary.totalWorkedHours.toFixed(1),
      sub: "Total working hours",
      color: "#E8006A",
      icon: ICONS.clock,
    },
    {
      title: "Overtime",
      value: summary.overtimeHours.toFixed(1),
      sub: "Extra worked hours",
      color: "#F5A623",
      icon: ICONS.clock,
    },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
        <div>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold"
            style={{ color: "var(--pink)" }}
          >
            Monthly Analytics
          </p>
          <h1
            className="text-2xl sm:text-3xl font-bold mt-1"
            style={{ color: "var(--txt)" }}
          >
            Employee Work Overview
          </h1>
          <p className="text-sm mt-2 max-w-2xl" style={{ color: "var(--txt-dim)" }}>
            View employee monthly work performance with smart filters,
            downloadable reports, and pie/table analytics in one clean screen.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setViewMode("chart")}
            className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all duration-200"
            style={{
              background:
                viewMode === "chart"
                  ? "linear-gradient(90deg,var(--blue),var(--pink))"
                  : "var(--surf)",
              color: viewMode === "chart" ? "#fff" : "var(--txt)",
              borderColor:
                viewMode === "chart" ? "transparent" : "var(--border)",
            }}
          >
            <Ic d={ICONS.pie} size={16} />
            Chart View
          </button>

          <button
            type="button"
            onClick={() => setViewMode("table")}
            className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all duration-200"
            style={{
              background:
                viewMode === "table"
                  ? "linear-gradient(90deg,var(--blue),var(--pink))"
                  : "var(--surf)",
              color: viewMode === "table" ? "#fff" : "var(--txt)",
              borderColor:
                viewMode === "table" ? "transparent" : "var(--border)",
            }}
          >
            <Ic d={ICONS.table} size={16} />
            Table View
          </button>

          <button
            type="button"
            onClick={downloadExcel}
            disabled={!visibleRows.length}
            className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
            style={{
              background: "var(--surf)",
              color: "var(--txt)",
              borderColor: "var(--border)",
            }}
          >
            <Ic d={ICONS.download} size={16} />
            Excel
          </button>

          <button
            type="button"
            onClick={downloadPDF}
            disabled={!visibleRows.length}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
            style={{
              background: "linear-gradient(90deg,var(--pink),var(--blue))",
              color: "#fff",
              boxShadow: "0 10px 30px rgba(59,91,255,0.22)",
            }}
          >
            <Ic d={ICONS.download} size={16} />
            PDF
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <SectionCard
        icon={ICONS.filter}
        iconBg="#3B5BFF"
        iconColor="#fff"
        title="Overview Filters"
        sub="Select date range and employee to load monthly report"
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4"
        >
          <Field label="Start Date">
            <TInput
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Field>

          <Field label="End Date">
            <TInput
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Field>

          <Field label="Employee">
            <TSelect
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} {emp.emp_code ? `(${emp.emp_code})` : ""}
                </option>
              ))}
            </TSelect>
          </Field>

          <div className="flex items-end gap-3 xl:col-span-2">
            <button
              type="submit"
              className="h-[46px] px-5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: "linear-gradient(90deg,var(--blue),var(--pink))",
                color: "#fff",
                boxShadow: "0 10px 28px rgba(59,91,255,0.22)",
              }}
            >
              <Ic d={ICONS.search} size={16} />
              Filter Report
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="h-[46px] px-5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: "var(--surf)",
                color: "var(--txt)",
                borderColor: "var(--border)",
              }}
            >
              <Ic d={ICONS.reset} size={16} />
              Reset
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Loading */}
      {loading ? (
        <LoadingBlock />
      ) : !visibleRows.length ? (
        <EmptyState
          title="No report data found"
          sub="Try changing the date range or employee filter to load monthly work data."
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
            {metricCards.map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
          </div>

          {/* Main View */}
          {viewMode === "chart" ? (
            <SectionCard
              icon={ICONS.pie}
              iconBg="#E8006A"
              iconColor="#fff"
              title="Pie Chart Overview"
              sub={`${selectedEmployeeName} • ${filters.startDate} to ${filters.endDate}`}
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 h-[360px]">
                  {chartData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={82}
                          outerRadius={126}
                          paddingAngle={4}
                          label={({ percent }) =>
                            percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                          }
                        >
                          {chartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <ReTooltip
                          contentStyle={{
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "#111827",
                            color: "#fff",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState
                      title="No chart data available"
                      sub="No attendance distribution found for the selected filter."
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div
                    className="rounded-2xl border p-4"
                    style={{
                      background: "var(--surf)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-[11px] uppercase tracking-[0.12em] font-mono font-semibold"
                      style={{ color: "var(--pink)" }}
                    >
                      Report Summary
                    </p>
                    <div className="mt-4 space-y-3">
                      <StatusChip
                        label="Present"
                        value={summary.presentDays}
                        color={STATUS_COLORS.Present}
                      />
                      <StatusChip
                        label="Absent"
                        value={summary.absentDays}
                        color={STATUS_COLORS.Absent}
                      />
                      <StatusChip
                        label="Leave"
                        value={summary.leaveDays}
                        color={STATUS_COLORS.Leave}
                      />
                      <StatusChip
                        label="Half Day"
                        value={summary.halfDays}
                        color={STATUS_COLORS["Half Day"]}
                      />
                      <StatusChip
                        label="WFH"
                        value={summary.wfhDays}
                        color={STATUS_COLORS.WFH}
                      />
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border p-4"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59,91,255,0.10), rgba(232,0,106,0.08))",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: "var(--txt)" }}>
                      Current Selection
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <span style={{ color: "var(--txt-dim)" }}>Employee</span>
                        <span style={{ color: "var(--txt)" }}>{selectedEmployeeName}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span style={{ color: "var(--txt-dim)" }}>Start Date</span>
                        <span style={{ color: "var(--txt)" }}>{filters.startDate}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span style={{ color: "var(--txt-dim)" }}>End Date</span>
                        <span style={{ color: "var(--txt)" }}>{filters.endDate}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span style={{ color: "var(--txt-dim)" }}>Rows</span>
                        <span style={{ color: "var(--txt)" }}>{visibleRows.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : (
            <SectionCard
              icon={ICONS.table}
              iconBg="#22E5F5"
              iconColor="#09131f"
              title="Employee Table Report"
              sub={`${selectedEmployeeName} • ${filters.startDate} to ${filters.endDate}`}
            >
              <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                <table className="min-w-full text-sm">
                  <thead
                    style={{
                      background: "linear-gradient(90deg, rgba(59,91,255,0.10), rgba(232,0,106,0.08))",
                    }}
                  >
                    <tr>
                      {[
                        "Emp Code",
                        "Employee",
                        "Department",
                        "Report Days",
                        "Present",
                        "Absent",
                        "Leave",
                        "Half Day",
                        "WFH",
                        "Worked Hours",
                        "Overtime",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-4 py-3 text-left whitespace-nowrap font-semibold"
                          style={{ color: "var(--txt)" }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row, index) => (
                      <tr
                        key={`${row.employee_id}-${index}`}
                        className="transition-colors duration-150"
                        style={{
                          borderTop: "1px solid var(--border)",
                          background:
                            index % 2 === 0
                              ? "transparent"
                              : "rgba(255,255,255,0.015)",
                        }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--txt-dim)" }}>
                          {row.emp_code || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: "var(--txt)" }}>
                          {row.full_name || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--txt-dim)" }}>
                          {row.department || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--txt)" }}>
                          {toNum(row.report_days)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: STATUS_COLORS.Present }}>
                          {toNum(row.present_days)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: STATUS_COLORS.Absent }}>
                          {toNum(row.absent_days)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: STATUS_COLORS.Leave }}>
                          {toNum(row.leave_days)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: STATUS_COLORS["Half Day"] }}>
                          {toNum(row.half_days)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: STATUS_COLORS.WFH }}>
                          {toNum(row.wfh_days)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium" style={{ color: "var(--txt)" }}>
                          {toNum(row.total_worked_hours).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium" style={{ color: "var(--txt)" }}>
                          {toNum(row.overtime_hours).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}
