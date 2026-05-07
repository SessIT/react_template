// ─── MorningReport.jsx ───────────────────────────────────────────────────────
// Full Morning Report form: Basic Info, Time Tracking, Customer & Task Details,
// Complaint Details, Billing Information, Attachment.
// Props:
//   employeeName  string
//   today         string  – ISO date yyyy-mm-dd
//   onSubmit      fn(type, FormData, formState)
//   loading       bool

import { useState } from "react";
import {
  SectionCard,
  Field,
  TInput,
  TSelect,
  TTextarea,
  TFile,
  SubmitBtn,
} from "./SharedUI";

export default function MorningReport({
  employeeName,
  today,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({
    checkin: "",
    checkout: "",
    total_hours: "",
    senior_junior: "",
    customer_name: "",
    assigned_by: "",
    customer_type: "",
    task_type: "",
    complaint_date: "",
    complaint_mode: "",
    complaint_person: "",
    complaint_description: "",
    closure_date: "",
    priority: "Low",
    bill_no: "",
    bill_date: "",
    spares_cost: "",
    service_cost: "",
  });
  const [file, setFile] = useState(null);

  /* Generic setter; auto-calculates total_hours when time fields change */
  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "checkin" || k === "checkout") {
        const ci = k === "checkin" ? v : next.checkin;
        const co = k === "checkout" ? v : next.checkout;
        if (ci && co) {
          let diff =
            (new Date("1970-01-01T" + co) - new Date("1970-01-01T" + ci)) /
            3600000;
          if (diff < 0) diff += 24;
          next.total_hours = diff.toFixed(2);
        }
      }
      return next;
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const fd = new FormData(e.target);
  //   if (file) fd.append("attachment", file);
  //   onSubmit("morning", fd, form);
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    employee_name: employeeName,
    report_date: today,
    ...form
  };

  try {

    const res = await fetch(
      "http://localhost:5000/api/reports/morning-report",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    alert("Morning Report Submitted Successfully");

    console.log(data);

  } catch (error) {
    console.error(error);
  }

};

 const customerNames = [
"AANCHAL TECHNO SOLUTIONS (BANGLORE)",
"AANCHAL TECHNO SOLUTIONS (CHENNAI)",
"AANCHAL TECHNO SOLUTIONS (COIM)",
"ADMIN WORK",
"AGILE ELECTRIC SUB ASSEMBLY PVT LTD",
"AMAZON DEVELOPEMENT CENTER (INDIA) PRIVATE LIMITED (BANGLORE)",
"AMAZON DEVELOPEMENT CENTER (INDIA) PRIVATE LIMITED (CHENNAI)",
"AMRUTANJAN HEALTHCARE LIMITED",
"ANGELANTONI TEST TECHNOLOGIES INDIA PVT LTD",
"APEX TELECOM TESTING SERVICES",
"APTIV CONNECTIONS SYSTEMS INDIA PRIVATE LIMITED",
"ARCHIMEDIS HEALTH CARE PRIVATE LIMITED",
"ARICENT TECHNOLOGIES",
"ASHAI INDIA GLASS LTD (AANDHARA PRADESH)",
"ASHAI INDIA GLASS LTD (CHENNAI)",
"AVINTEC SYSTEMS PRIVATE LIMITED",
"B.S.ABDUR RAHMAN CRESCENT INSTITUTE OF SCIENCE & TECHNOLOGY",
"BHARATH ELECTRONICS LTD (BEL)",
"BIGFOX ENGINEERING PVT LTD",
"BRAHMOS AEROSPACE PRIVATE LIMITED",
"BREAKS INDIA PVT LTD",
"CAPGEMINI ENGINEERING",
"CENTRAL FOR AIR BORNE SYSTEMS (CABS)",
"CEV ENGINEERING PVT LTD",
"COMBAT VEHICLES RESEARCH AND DEVELOPMENT ESTABLISHMENT (CVRDE)",
"CORAMANDAL INTERNATIONAL LIMITED",
"CSIR-CENTRAL LEATHER RESEARCH INSTITUTE",
"DANFOSS INDUSTRIES PVT LTD",
"DEFENSE RESEARCH & DEVELOMENT LABOURATORY",
"DHARANI SCIENCE & TECHNOLOGY",
"DY AUTO",
"E.I.D - PARRY (INDIA) LIMITED -PDK",
"EID PARRY(INDIA) LIMITED - CHENNAI",
"ELECTRO OPTICAL INSTRUMENTS RESEARCH ACADEMY (ELOIRA)",
"ELETTRA TECH PVT LTD",
"EXIDE INDUSTRIES LIMITED",
"EXLTECH SYSTEMS",
"EXPORTS INSPECTION AGENCY",
"FACTORY PRODUCTION",
"FLEXTRONICS TECHNOLOGIES (I) PVT LTD",
"FREEDOM DIAGNOSTICS & SCIENTIFIC HOUSE (BIOLINE LABORATORY)",
"GATES UNITTA INDIA COMPANY PVT LTD",
"GLOBAL AUTOMOTIVE RESEARCH CENTRE (GARC)",
"GODREJ & BOYCE MFG CO LTD",
"HANON AUTOMOTIVE SYSTEMS INDIA PVT LTD",
"HCL TECHNOLOGIES LIMITED",
"HCL TECHNOLOGIES LIMITED (SOLINGANALLUR)",
"HIGH ENERGY MATERIALS RESEARCH LABORATORY (HEMRL)",
"HINDUSTAN AERONAUTICS LIMITED (HAL)",
"HWASHIN AUTOMOTIVE INDIA PRIVATE LIMITED",
"HYOSEONG ELECTRIC INDIA PVT LTD",
"HYUNDAI MOBIS INDIA LTD",
"IGRASHI MOTOR INDIA LTD",
"IMPACTCALIBRATION AND TESTING SOLUTIONS PVT LTD BANGALORE",
"INDIA JAPAN LIGHTING PVT LTD (CHENNAI PLANT)",
"INDIA JAPAN LIGHTING PVT LTD (GUJARAT PLANT)",
"INDIAN INSTITUTE OF TECHNOLOGY (PALAKKAD)",
"INDIAN INSTITUTE OF TECHNOLOGY(BOMBAY)",
"INDIAN INSTITUTE OF TECHNOLOGY(MADRAS)",
"INDIAN SPACE RESEARCH CENTRE (ISRO)",
"INDUS TESQSITE PRIVATE LTD",
"IPGI INSTRUMENTS",
"ITC LIMITED",
"JOST ENGINEERING COMPANY LIMITED",
"JTEK AUTOMOTIVE",
"KARTHICK MEDICAL CENTER",
"KELTRON COMPONENT COMPLEX LTD KANNUR",
"KEMIN INDUSTRIES SOUTH ASIA PVT LTD",
"KNORR-BREMSE TECHNOLOGY CENTER INDIA PRIVATE LIMITED",
"KYUNGSHIN INDUSTRIAL MOTHERSON PVT LTD (KIML) ORAGADAM",
"KYUNGSHIN INDUSTRIAL MOTHERSON PVT LTD (KIML) PADAPPAI",
"LABORATORY FOR ELECTRO-OPTICS SYSTEMS (LEOS)",
"LIQUID PROPULSION SYSTEMS CENTRE (LPSC)",
"LUCAS TVS, PADI",
"LUCAS TVS, PONDICHERRY",
"MAEON LABORATORIES LLP",
"MAEON LABORATORIES LLP (PUNE)",
"MAGNA AUTOMOTIVE INDIA PVT LTD",
"MAHINDRA ELECTRIC MOBILITY LTD",
"MAK CONTROLS AND SYSTEMS PVT LTD (COIMBATORE)",
"MAK CONTROLS AND SYSTEMS PVT LTD (KARUR)",
"MANDO AUTOMOTIVE INDIA PVT LTD",
"MCCIA ELECTRONIC CLUSTER FOUNDATION-(PUNE)",
"MELS SYSTEM & SERVICE LTD",
"MICROLAB",
"MOBIS INDIA LTD",
"MOTHERSON AUTOMOTIVE TECH.& ENGG",
"MULITLINK",
"NATIONAL INSTITUTE OF TECHNOLOGY (NIT)",
"NIFCO SOUTH INDIA MFG PVT LTD",
"NOVARES INDIA AUTOMOTIVE PRIVATE LTD",
"PEACOCK HOSPITAL PVT LTD",
"PIAGGIO VEHICLES PRIVATE LTD",
"PRECISION HYDRAULICS PRIVATE LIMITED (LEGGET)",
"RANE NSK STEERING SYSTEMS PRIVATE LIMITED",
"ROYAL ENFIELD",
"SALCOMP MANUFACTURING INDIA PRIVATE LTD - UNIT I",
"SALCOMP MANUFACTURING INDIA PRIVATE LTD UNIT III",
"SALCOMP TECHNOLOGIES INDIA PRIVATE LTD UNIT II",
"SALCOMP TECHNOLOGIES INDIA PRIVATE LTD UNIT- 5",
"SCHNEIDER ELECTRIC INDIA PVT LTD",
"SEOYON E-HWA SUMMIT AUTOMOTIVE INDIA PVT LTD",
"SGS INDIA PVT LTD",
"SHARDA MOTORS INDUSTRIES LTD (R & D CENTER)",
"SKC ENVIRON LAB PVT LTD BANGALORE",
"SMRC AUTOMOTIVE PRODUCTS INDIA LTD",
"SONA BLW PRECISION FORGINGS LTD",
"SRIRAM INSTITUTE FOR INDUSTRIAL RESEARCH",
"STAFF WELFARE",
"STAHL PRIVATE LIMITED",
"TATA ADVANCE SYSTEMS LTD",
"TATA ELECTRONICS PRIVATE LIMITED",
"THE AUTOMOTIVE RESEARCH ASSOCIATION OF INDIA (ARAI)",
"TRICHY SRM MEDICAL COLLEGE HOSPITAL & RESEARCH CENTRE",
"TURBO ENERGY PRIVATE LIMITED",
"UCAL FUEL SYSTEMS LTD",
"UNION RUBBER MILL",
"VIKARAM SARABHAI SPACE CENTRE (VSSC)",
"VISTEON ELECTRONICS INDIA PVT LTD",
"WIPRO PVT LTD BANGALORE",
"YAAZHI",
"YAPP INDIA"
];

  return (
    <form onSubmit={handleSubmit} className="anim-fadeup">
      {/* ── Basic Information ──────────────────────────────────── */}
      <SectionCard
        icon="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z"
        iconBg="rgba(34,229,245,0.12)"
        iconColor="var(--pink)"
        title="Basic Information"
        sub="Employee & date details"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Employee Name">
            <TInput value={employeeName} readOnly />
          </Field>
          <Field label="Report Date">
            <TInput type="date" value={today} readOnly />
          </Field>
          <Field label="Senior / Junior">
            <TSelect
              name="senior_junior"
              value={form.senior_junior}
              onChange={set("senior_junior")}
              required
            >
              <option value="">— Select Role —</option>
              <option>Senior</option>
              <option>Junior</option>
            </TSelect>
          </Field>
        </div>
      </SectionCard>

      {/* ── Time Tracking ──────────────────────────────────────── */}
      {/* <SectionCard
        icon="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2"
        iconBg="rgba(59,91,255,0.12)"
        iconColor="var(--blue)"
        title="Time Tracking"
        sub="Check-in, check-out & auto-calculated hours"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Check In Time">
            <TInput
              name="checkin"
              type="time"
              value={form.checkin}
              onChange={set("checkin")}
              required
            />
          </Field>
          <Field label="Check Out Time">
            <TInput
              name="checkout"
              type="time"
              value={form.checkout}
              onChange={set("checkout")}
              required
            />
          </Field>
          <Field label="Total Hours (Auto)">
            <TInput
              name="total_hours"
              value={form.total_hours}
              readOnly
              computed
              placeholder="—"
            />
          </Field>
        </div>
      </SectionCard> */}

      {/* ── Customer & Task Details ────────────────────────────── */}
      <SectionCard
        icon={[
          "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
          "M9 11a4 4 0 100-8 4 4 0 000 8z",
          "M23 21v-2a4 4 0 00-3-3.87",
          "M16 3.13a4 4 0 010 7.75",
        ]}
        iconBg="rgba(34,229,245,0.08)"
        iconColor="var(--pink)"
        title="Customer & Task Details"
        sub="Who and what you worked on"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Field label="Customer Name">
  <TSelect
    name="customer_name"
    value={form.customer_name}
    onChange={set("customer_name")}
    required
  >
    <option value="">— Select Customer —</option>

    {customerNames.map((name, index) => (
      <option key={index} value={name}>
        {name}
      </option>
    ))}

  </TSelect>
</Field>
          <Field label="Assigned By">
            <TSelect
              name="assigned_by"
              value={form.assigned_by}
              onChange={set("assigned_by")}
              required
            >
              <option value="">— Select Assigned By —</option>
              <option>PARAMANANTHAM A</option>
              <option>ALAGUEASWARI P</option>
              <option>DINESH T</option>
              <option>PARAMESHWARAN</option>
              <option>SATHISH KUMAR M</option>
            </TSelect>
          </Field>
          <Field label="Customer Type">
            <TSelect
              name="customer_type"
              value={form.customer_type}
              onChange={set("customer_type")}
              required
            >
              <option value="">— Select Customer Type —</option>
              <option>Under AMC</option>
              <option>Under CAMC</option>
              <option>Installation</option>
              <option>Out of Warranty</option>
              <option>Inspection</option>
              <option>Free/General visit</option>
              <option>Factory Work</option>
              <option>Breakdown Visit</option>
              <option>Calibration Visit</option>
              <option>Admin work</option>
            </TSelect>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Task Type">
            <TInput
              name="task_type"
              value={form.task_type}
              onChange={set("task_type")}
              placeholder="e.g. Installation, Repair"
              required
            />
          </Field>
          <Field label="Complaint Date">
            <TInput
              name="complaint_date"
              type="date"
              value={form.complaint_date}
              onChange={set("complaint_date")}
              required
            />
          </Field>
          <Field label="Complaint Mode">
            <TSelect
              name="complaint_mode"
              value={form.complaint_mode}
              onChange={set("complaint_mode")}
              required
            >
              <option value="">— Select Complaint Mode —</option>
              <option>Phone</option>
              <option>Email</option>
              <option>What's App</option>
              <option>SMS</option>
              <option>Web</option>
            </TSelect>
          </Field>
        </div>
      </SectionCard>

      {/* ── Complaint Details ──────────────────────────────────── */}
      <SectionCard
        icon="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01"
        iconBg="rgba(245,166,35,0.12)"
        iconColor="var(--amber)"
        title="Complaint Details"
        sub="Description, person & closure info"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Complaint Person">
            <TInput
              name="complaint_person"
              value={form.complaint_person}
              onChange={set("complaint_person")}
              placeholder="Contact person name"
              required
            />
          </Field>
          <Field label="Priority">
            <TSelect
              name="priority"
              value={form.priority}
              onChange={set("priority")}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </TSelect>
          </Field>
        </div>
        <div className="mb-4">
          <Field label="Complaint Description">
            <TTextarea
              name="complaint_description"
              value={form.complaint_description}
              onChange={set("complaint_description")}
              placeholder="Describe the complaint or task in detail..."
              required
            />
          </Field>
        </div>
        <div className="max-w-xs">
          <Field label="Closure Date">
            <TInput
              name="closure_date"
              type="date"
              value={form.closure_date}
              onChange={set("closure_date")}
              required
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Billing Information ────────────────────────────────── */}
      <SectionCard
        icon="M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        iconBg="rgba(34,229,245,0.10)"
        iconColor="var(--pink)"
        title="Billing Information"
        sub="Bill number, date and cost breakdown"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Bill No">
            <TInput
              name="bill_no"
              value={form.bill_no}
              onChange={set("bill_no")}
              placeholder="BL-XXXX"
            />
          </Field>
          <Field label="Bill Date">
            <TInput
              name="bill_date"
              type="date"
              value={form.bill_date}
              onChange={set("bill_date")}
            />
          </Field>
          <Field label="Spares Cost (₹)">
            <TInput
              name="spares_cost"
              type="number"
              value={form.spares_cost}
              onChange={set("spares_cost")}
              placeholder="0.00"
            />
          </Field>
          <Field label="Service Cost (₹)">
            <TInput
              name="service_cost"
              type="number"
              value={form.service_cost}
              onChange={set("service_cost")}
              placeholder="0.00"
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Attachment ─────────────────────────────────────────── */}
      <SectionCard
        icon="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
        iconBg="rgba(59,91,255,0.10)"
        iconColor="var(--blue)"
        title="Attachment"
        sub="Upload supporting document or image"
      >
        <div className="max-w-md">
          <Field label="File Attachment">
            <TFile
              name="attachment"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Submit ─────────────────────────────────────────────── */}
      <SubmitBtn
        label="☀️  Submit Morning Report"
        loading={loading}
        gradient="linear-gradient(135deg,var(--pink),var(--blue))"
        shadow="0 8px 32px rgba(34,229,245,0.25)"
      />
    </form>
  );
}
