const STORAGE_KEY = "tcb-candidate-records-v1";

const stages = [
  { code: "1", name: "Prelim Interview", detail: "Initial screening conversation" },
  { code: "2A", name: "Pre-Qualifying Assessment Part 1", detail: "Group Case Study" },
  { code: "2B", name: "Pre-Qualifying Assessment Part 2", detail: "Structured Interview" },
  { code: "3A", name: "Assessment Day Part 1", detail: "Group Case Simulation" },
  { code: "3B", name: "Assessment Day Part 2", detail: "Panel Interview" },
  { code: "4", name: "Final Interview", detail: "Final stage conversation" },
  { code: "5", name: "Final Outcome", detail: "Offer / KIV / Not Selected" }
];

const statuses = [
  "Passed",
  "Scheduling",
  "Scheduled",
  "Pending Review",
  "KIV",
  "Not Selected",
  "Offer"
];

const statusMessages = {
  "Scheduling": "Our hiring team is arranging the next step. Please keep an eye on your email for further updates.",
  "Scheduled": "You have been scheduled for this stage. Please refer to the email from the hiring team for full details.",
  "Pending Review": "You have completed this stage. Your outcome is currently being reviewed.",
  "KIV": "Your application is currently under further review. We will update you once there is a further decision.",
  "Passed": "You have passed this stage. Please keep an eye on your email for the next step.",
  "Not Selected": "Thank you for your interest in the TCB Programme. Please refer to the communication from the hiring team for further details.",
  "Offer": "Congratulations. You have reached the offer stage. The hiring team will contact you with further details."
};

const seedCandidates = [
  {
    id: "cand-001",
    full_name: "Amira Tan",
    email: "amira.tan@email.com",
    university: "University of Malaya",
    degree_field: "Business Analytics",
    current_stage: "Pre-Qualifying Assessment Part 1",
    current_status: "Scheduled",
    notes: "Scheduled for next PQA group case study batch. Candidate email sent separately by hiring team.",
    last_updated_at: "2026-06-14T10:15:00+08:00",
    created_at: "2026-06-01T09:00:00+08:00"
  },
  {
    id: "cand-002",
    full_name: "Jason Lim",
    email: "jason.lim@email.com",
    university: "Monash University Malaysia",
    degree_field: "Banking & Finance",
    current_stage: "Pre-Qualifying Assessment Part 1",
    current_status: "Pending Review",
    notes: "Awaiting reviewer decision.",
    last_updated_at: "2026-06-13T16:40:00+08:00",
    created_at: "2026-06-01T09:20:00+08:00"
  },
  {
    id: "cand-003",
    full_name: "Nur Aisyah",
    email: "aisyah@email.com",
    university: "UiTM",
    degree_field: "Economics",
    current_stage: "Prelim Interview",
    current_status: "Passed",
    notes: "Proceed to scheduling.",
    last_updated_at: "2026-06-12T11:30:00+08:00",
    created_at: "2026-06-01T10:10:00+08:00"
  },
  {
    id: "cand-004",
    full_name: "Wei Jun",
    email: "weijun@email.com",
    university: "HELP University",
    degree_field: "Psychology",
    current_stage: "Assessment Day Part 2",
    current_status: "KIV",
    notes: "Keep in view pending panel calibration.",
    last_updated_at: "2026-06-11T15:05:00+08:00",
    created_at: "2026-06-01T11:10:00+08:00"
  },
  {
    id: "cand-005",
    full_name: "Priya Raman",
    email: "priya.raman@email.com",
    university: "Taylor's University",
    degree_field: "Accounting",
    current_stage: "Final Outcome",
    current_status: "Offer",
    notes: "Offer communication in progress.",
    last_updated_at: "2026-06-14T09:30:00+08:00",
    created_at: "2026-06-02T09:00:00+08:00"
  }
];

let candidates = loadCandidates();
let activeCandidateEmail = "amira.tan@email.com";
let validatedRows = [];

const viewMeta = {
  "candidate-login": ["Candidate Access", "Verify your email to view your personal hiring status."],
  "candidate-journey": ["Journey Status", "Full TCB journey map with current stage highlighted."],
  "admin-dashboard": ["Admin Dashboard", "Manage shortlisted TCB candidates and stage progress."],
  "candidate-update": ["Update Candidate", "Edit an individual candidate stage, status and admin notes."],
  "bulk-upload": ["Bulk Upload", "Validate and apply high-volume status updates."]
};

document.addEventListener("DOMContentLoaded", () => {
  populateSelects();
  bindEvents();
  renderAll();
  fillUpdateForm(getCandidateByEmail(activeCandidateEmail));
});

function loadCandidates() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [...seedCandidates];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [...seedCandidates];
  } catch {
    return [...seedCandidates];
  }
}

function saveCandidates() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewTarget));
  });

  document.getElementById("sendOtpBtn").addEventListener("click", sendOtp);
  document.getElementById("loginForm").addEventListener("submit", verifyOtp);
  document.getElementById("statusForm").addEventListener("submit", saveCandidateUpdate);
  document.getElementById("loadCandidateBtn").addEventListener("click", loadCandidateFromEmail);
  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);
  document.getElementById("validateCsvBtn").addEventListener("click", validateCsv);
  document.getElementById("applyCsvBtn").addEventListener("click", applyValidRows);
  document.getElementById("csvFile").addEventListener("change", readCsvFile);

  ["searchInput", "stageFilter", "statusFilter", "universityFilter"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderCandidateList);
  });
}

function showView(id) {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === id);
  });

  document.getElementById("viewTitle").textContent = viewMeta[id][0];
  document.getElementById("viewSubtitle").textContent = viewMeta[id][1];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function populateSelects() {
  fillSelect("stageFilter", ["All stages", ...stages.map((stage) => stage.name)]);
  fillSelect("statusFilter", ["All statuses", ...statuses]);
  fillSelect("editStage", stages.map((stage) => stage.name));
  fillSelect("editStatus", statuses);
  fillUniversityFilter();
  document.getElementById("csvInput").value = sampleCsv();
}

function fillSelect(id, options) {
  const select = document.getElementById(id);
  select.innerHTML = options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("");
}

function fillUniversityFilter() {
  const universities = [...new Set(candidates.map((candidate) => candidate.university))].sort();
  fillSelect("universityFilter", ["All universities", ...universities]);
}

function renderAll() {
  renderCandidateJourney();
  renderMetrics();
  renderCandidateList();
  fillUniversityFilter();
}

function sendOtp() {
  const email = normalizeEmail(document.getElementById("candidateEmail").value);
  const message = document.getElementById("loginMessage");
  const candidate = getCandidateByEmail(email);

  document.getElementById("otpRow").hidden = false;

  if (!candidate) {
    message.textContent = "We could not verify this email. Please contact the hiring team if you believe this is incorrect.";
    return;
  }

  message.textContent = "OTP sent to your email. Prototype OTP: 123456.";
  toast("OTP sent. Use 123456 in prototype mode.");
}

function verifyOtp(event) {
  event.preventDefault();

  const email = normalizeEmail(document.getElementById("candidateEmail").value);
  const otp = document.getElementById("candidateOtp").value.trim();
  const candidate = getCandidateByEmail(email);
  const message = document.getElementById("loginMessage");

  if (!candidate) {
    message.textContent = "We could not verify this email. Please contact the hiring team if you believe this is incorrect.";
    return;
  }

  if (otp !== "123456") {
    message.textContent = "The OTP entered is invalid or expired.";
    return;
  }

  activeCandidateEmail = candidate.email;
  renderCandidateJourney();
  message.textContent = "";
  toast("OTP verified. Candidate journey opened.");
  showView("candidate-journey");
}

function renderCandidateJourney() {
  const candidate = getCandidateByEmail(activeCandidateEmail) || candidates[0];
  const currentStageIndex = stages.findIndex((stage) => stage.name === candidate.current_stage);

  document.getElementById("candidateName").textContent = candidate.full_name;
  document.getElementById("candidateMeta").textContent = `TCB Programme - ${candidate.email} - Last updated: ${formatDateTime(candidate.last_updated_at)}`;
  document.getElementById("currentStatusChip").textContent = `Current: ${candidate.current_status}`;
  document.getElementById("candidateStatusMessage").textContent = statusMessages[candidate.current_status] || "Please check your email for the latest update from the hiring team.";

  document.getElementById("journeyMap").innerHTML = stages.map((stage, index) => {
    const isPast = index < currentStageIndex;
    const isCurrent = index === currentStageIndex;
    const status = isCurrent ? candidate.current_status : isPast ? "Passed" : "Future stage";
    const badgeClass = isCurrent || isPast ? statusClass(status) : "future";

    return `
      <article class="stage-card ${isCurrent ? "current" : ""}">
        <div class="stage-number">${escapeHtml(stage.code)}</div>
        <div>
          <h4>${escapeHtml(stage.name)}</h4>
          <p>${escapeHtml(stage.detail)}</p>
        </div>
        <span class="badge ${badgeClass}">${escapeHtml(status)}</span>
      </article>
    `;
  }).join("");
}

function renderMetrics() {
  const metrics = [
    ["Total shortlisted", candidates.length],
    ["Pending review", countStatus("Pending Review")],
    ["KIV candidates", countStatus("KIV")],
    ["Offers", countStatus("Offer")],
    ["Not selected", countStatus("Not Selected")],
    ["Scheduled", countStatus("Scheduled")],
    ["Scheduling", countStatus("Scheduling")],
    ["Active stages", new Set(candidates.map((candidate) => candidate.current_stage)).size]
  ];

  document.getElementById("metricGrid").innerHTML = metrics.map(([label, value]) => `
    <div class="metric-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `).join("");
}

function renderCandidateList() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const stage = document.getElementById("stageFilter").value;
  const status = document.getElementById("statusFilter").value;
  const university = document.getElementById("universityFilter").value;

  const filtered = candidates.filter((candidate) => {
    const matchesSearch = !search ||
      candidate.full_name.toLowerCase().includes(search) ||
      candidate.email.toLowerCase().includes(search);
    const matchesStage = stage === "All stages" || candidate.current_stage === stage;
    const matchesStatus = status === "All statuses" || candidate.current_status === status;
    const matchesUniversity = university === "All universities" || candidate.university === university;
    return matchesSearch && matchesStage && matchesStatus && matchesUniversity;
  });

  document.getElementById("resultCount").textContent = `${filtered.length} candidate${filtered.length === 1 ? "" : "s"} shown`;
  document.getElementById("candidateList").innerHTML = filtered.length ? filtered.map(candidateRow).join("") : emptyState("No candidates match these filters.");

  document.querySelectorAll("[data-edit-email]").forEach((button) => {
    button.addEventListener("click", () => {
      const candidate = getCandidateByEmail(button.dataset.editEmail);
      fillUpdateForm(candidate);
      showView("candidate-update");
    });
  });

  document.querySelectorAll("[data-view-email]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCandidateEmail = button.dataset.viewEmail;
      renderCandidateJourney();
      showView("candidate-journey");
    });
  });
}

function candidateRow(candidate) {
  return `
    <article class="candidate-row">
      <div>
        <strong>${escapeHtml(candidate.full_name)}</strong>
        <span>${escapeHtml(candidate.email)}</span>
      </div>
      <div>
        <strong>${escapeHtml(candidate.university)}</strong>
        <span>${escapeHtml(candidate.degree_field)}</span>
      </div>
      <div>
        <strong>${escapeHtml(candidate.current_stage)}</strong>
        <span>${escapeHtml(formatDate(candidate.last_updated_at))}</span>
      </div>
      <div>
        <span class="badge ${statusClass(candidate.current_status)}">${escapeHtml(candidate.current_status)}</span>
      </div>
      <div class="row-actions">
        <button class="btn secondary" type="button" data-view-email="${escapeHtml(candidate.email)}">View</button>
        <button class="btn primary" type="button" data-edit-email="${escapeHtml(candidate.email)}">Edit</button>
      </div>
    </article>
  `;
}

function fillUpdateForm(candidate) {
  const record = candidate || {
    full_name: "",
    email: "",
    university: "",
    degree_field: "",
    current_stage: stages[0].name,
    current_status: "Scheduling",
    notes: ""
  };

  document.getElementById("editEmail").value = record.email;
  document.getElementById("editName").value = record.full_name;
  document.getElementById("editUniversity").value = record.university;
  document.getElementById("editDegree").value = record.degree_field;
  document.getElementById("editStage").value = record.current_stage;
  document.getElementById("editStatus").value = record.current_status;
  document.getElementById("editNotes").value = record.notes || "";
}

function loadCandidateFromEmail() {
  const email = normalizeEmail(document.getElementById("editEmail").value);
  const candidate = getCandidateByEmail(email);
  const message = document.getElementById("updateMessage");

  if (!candidate) {
    message.textContent = "No existing record found. Fill the fields to add this candidate.";
    return;
  }

  fillUpdateForm(candidate);
  message.textContent = "Candidate record loaded.";
}

function saveCandidateUpdate(event) {
  event.preventDefault();

  const candidateForm = document.getElementById("candidateForm");
  if (!candidateForm.reportValidity() || !event.currentTarget.reportValidity()) return;

  const email = normalizeEmail(document.getElementById("editEmail").value);
  const existingIndex = candidates.findIndex((candidate) => normalizeEmail(candidate.email) === email);
  const now = new Date().toISOString();
  const record = {
    id: existingIndex >= 0 ? candidates[existingIndex].id : `cand-${Date.now()}`,
    full_name: document.getElementById("editName").value.trim(),
    email,
    university: document.getElementById("editUniversity").value.trim(),
    degree_field: document.getElementById("editDegree").value.trim(),
    current_stage: document.getElementById("editStage").value,
    current_status: document.getElementById("editStatus").value,
    notes: document.getElementById("editNotes").value.trim(),
    last_updated_at: now,
    created_at: existingIndex >= 0 ? candidates[existingIndex].created_at : now
  };

  if (existingIndex >= 0) {
    candidates[existingIndex] = record;
  } else {
    candidates.push(record);
  }

  activeCandidateEmail = record.email;
  saveCandidates();
  renderAll();
  fillUpdateForm(record);
  document.getElementById("updateMessage").textContent = "Candidate status updated successfully.";
  toast("Candidate status saved.");
}

function clearFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("stageFilter").value = "All stages";
  document.getElementById("statusFilter").value = "All statuses";
  document.getElementById("universityFilter").value = "All universities";
  renderCandidateList();
}

function readCsvFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("csvInput").value = String(reader.result || "");
    validateCsv();
  };
  reader.readAsText(file);
}

function validateCsv() {
  const text = document.getElementById("csvInput").value.trim();
  const message = document.getElementById("bulkMessage");

  if (!text) {
    validatedRows = [];
    renderValidation([]);
    message.textContent = "Paste CSV content or choose a CSV file to validate.";
    return;
  }

  const rows = parseCsv(text);
  const headers = rows[0] || [];
  const required = ["email", "full_name", "university", "degree_field", "current_stage", "current_status", "notes"];
  const missing = required.filter((field) => !headers.includes(field));

  if (missing.length) {
    validatedRows = [];
    renderValidation([]);
    message.textContent = `Missing required column${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}.`;
    return;
  }

  const seenEmails = new Set();
  validatedRows = rows.slice(1).filter((row) => row.some(Boolean)).map((row, index) => {
    const record = Object.fromEntries(headers.map((header, columnIndex) => [header, row[columnIndex] || ""]));
    const errors = validateCsvRecord(record, seenEmails);
    seenEmails.add(normalizeEmail(record.email));
    return { rowNumber: index + 2, record, errors, valid: errors.length === 0 };
  });

  renderValidation(validatedRows);
  const validCount = validatedRows.filter((row) => row.valid).length;
  const invalidCount = validatedRows.length - validCount;
  message.textContent = `${validCount} valid row${validCount === 1 ? "" : "s"}, ${invalidCount} invalid row${invalidCount === 1 ? "" : "s"}.`;
}

function validateCsvRecord(record, seenEmails) {
  const errors = [];
  const email = normalizeEmail(record.email);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Email is invalid.");
  if (seenEmails.has(email)) errors.push("Email appears more than once in this upload.");
  if (!record.full_name.trim()) errors.push("Full name is required.");
  if (!record.university.trim()) errors.push("University is required.");
  if (!record.degree_field.trim()) errors.push("Degree field is required.");
  if (!stages.some((stage) => stage.name === record.current_stage.trim())) errors.push("Current stage is not approved.");
  if (!statuses.includes(record.current_status.trim())) errors.push("Current status is not approved.");

  return errors;
}

function renderValidation(rows) {
  const validCount = rows.filter((row) => row.valid).length;
  const invalidCount = rows.length - validCount;

  document.getElementById("previewSummary").innerHTML = `
    <span>${validCount} valid</span>
    <span>${invalidCount} invalid</span>
  `;

  document.getElementById("applyCsvBtn").disabled = validCount === 0;
  document.getElementById("validationList").innerHTML = rows.length ? rows.map((row) => `
    <article class="validation-row ${row.valid ? "" : "invalid"}">
      <strong>Row ${row.rowNumber}: ${escapeHtml(row.record.email || "No email")}</strong>
      <p>${row.valid ? "Ready to apply." : escapeHtml(row.errors.join(" "))}</p>
    </article>
  `).join("") : emptyState("No validation results yet.");
}

function applyValidRows() {
  const validRows = validatedRows.filter((row) => row.valid);

  validRows.forEach(({ record }) => {
    const email = normalizeEmail(record.email);
    const existingIndex = candidates.findIndex((candidate) => normalizeEmail(candidate.email) === email);
    const now = new Date().toISOString();
    const nextRecord = {
      id: existingIndex >= 0 ? candidates[existingIndex].id : `cand-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      full_name: record.full_name.trim(),
      email,
      university: record.university.trim(),
      degree_field: record.degree_field.trim(),
      current_stage: record.current_stage.trim(),
      current_status: record.current_status.trim(),
      notes: record.notes.trim(),
      last_updated_at: now,
      created_at: existingIndex >= 0 ? candidates[existingIndex].created_at : now
    };

    if (existingIndex >= 0) {
      candidates[existingIndex] = nextRecord;
    } else {
      candidates.push(nextRecord);
    }
  });

  saveCandidates();
  renderAll();
  document.getElementById("bulkMessage").textContent = `${validRows.length} valid update${validRows.length === 1 ? "" : "s"} applied.`;
  toast("Bulk updates applied.");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  rows.push(row);
  return rows.filter((line) => line.some((cellValue) => cellValue.length));
}

function sampleCsv() {
  return [
    "email,full_name,university,degree_field,current_stage,current_status,notes",
    "amira.tan@email.com,Amira Tan,University of Malaya,Business Analytics,Pre-Qualifying Assessment Part 1,Scheduled,Email sent separately",
    "jason.lim@email.com,Jason Lim,Monash University Malaysia,Banking & Finance,Pre-Qualifying Assessment Part 1,Pending Review,Awaiting review",
    "new.candidate@email.com,New Candidate,Sunway University,Finance,Final Interview,Scheduling,Ready to schedule",
    "bad-row@email.com,Bad Row,Unknown University,Finance,Wrong Stage,Scheduled,Should be rejected"
  ].join("\n");
}

function countStatus(status) {
  return candidates.filter((candidate) => candidate.current_status === status).length;
}

function getCandidateByEmail(email) {
  const normalized = normalizeEmail(email);
  return candidates.find((candidate) => normalizeEmail(candidate.email) === normalized);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function statusClass(status) {
  return String(status).toLowerCase().replace(/\s+/g, "-");
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emptyState(message) {
  return `<div class="validation-row"><p>${escapeHtml(message)}</p></div>`;
}

function toast(message) {
  const toastEl = document.getElementById("toast");
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(toastEl.hideTimer);
  toastEl.hideTimer = window.setTimeout(() => toastEl.classList.remove("show"), 2600);
}
