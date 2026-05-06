// -- DATA --

const appointments = [
  {
    id: 1,
    name: "Priya Sharma",
    date: "May 7",
    time: "10:00 AM",
    risk: "high",
    phone: "98100-00001",
    status: "pending",
  },
  {
    id: 2,
    name: "Rahul Mehra",
    date: "May 7",
    time: "11:30 AM",
    risk: "medium",
    phone: "98100-00002",
    status: "pending",
  },
  {
    id: 3,
    name: "Anita Bose",
    date: "May 7",
    time: "12:00 PM",
    risk: "low",
    phone: "98100-00003",
    status: "pending",
  },
  {
    id: 4,
    name: "Vikram Singh",
    date: "May 7",
    time: "2:00 PM",
    risk: "high",
    phone: "98100-00004",
    status: "pending",
  },
  {
    id: 5,
    name: "Sunita Kapoor",
    date: "May 7",
    time: "3:30 PM",
    risk: "medium",
    phone: "98100-00005",
    status: "pending",
  },
];

const waitlist = [
  {
    id: 1,
    name: "Deepak Joshi",
    phone: "98100-00010",
    wantedTime: "Morning",
    notified: false,
  },
  {
    id: 2,
    name: "Meera Pillai",
    phone: "98100-00011",
    wantedTime: "Afternoon",
    notified: false,
  },
];

// -- HELPERS --

// add a line to the log box
function log(msg, type = "info") {
  const box = document.getElementById("log");
  const line = document.createElement("div");
  line.className = "log-line " + type;
  line.textContent = "[" + new Date().toLocaleTimeString() + "]  " + msg;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

// find a patient by id
function getPatient(id) {
  return appointments.find((a) => a.id === id);
}

// -- RENDER --

function renderAppointments() {
  const container = document.getElementById("appointments-list");
  container.innerHTML = "";

  appointments.forEach((p) => {
    const btns =
      p.status === "pending"
        ? `
      <div class="btn-group">
        <button class="remind-btn"  onclick="sendReminder(${p.id})">Send Reminder</button>
        <button class="confirm-btn" onclick="confirmAppointment(${p.id})">YES</button>
        <button class="cancel-btn"  onclick="cancelAppointment(${p.id})">NO</button>
      </div>`
        : "";

    const card = document.createElement("div");
    card.className = "patient-card";
    card.innerHTML = `
      <div class="patient-info">
        <div class="name">${p.name}</div>
        <div class="details">${p.date} · ${p.time} · ${p.phone}</div>
      </div>
      <span class="risk ${p.risk}">${p.risk} risk</span>
      <span class="status-badge ${p.status}">${p.status}</span>
      ${btns}`;

    container.appendChild(card);
  });
}

function renderWaitlist() {
  const container = document.getElementById("waitlist-list");
  container.innerHTML = "";

  if (!waitlist.length) {
    container.innerHTML =
      "<div class='empty-state'>Nobody on the waitlist right now.</div>";
    return;
  }

  waitlist.forEach((w) => {
    const card = document.createElement("div");
    card.className = "waitlist-card" + (w.notified ? " notified" : "");
    card.innerHTML = `
      <div>
        <div class="wname">${w.name}</div>
        <div class="wdetail">${w.phone} · Preferred: ${w.wantedTime}</div>
      </div>
      <div class="wstatus">${w.notified ? "Notified — slot offered" : "Waiting"}</div>`;
    container.appendChild(card);
  });
}

// -- ACTIONS --

function sendReminder(id) {
  const p = getPatient(id);
  const base = `${p.name} (${p.phone}) — appointment on ${p.date} at ${p.time}.`;

  if (p.risk === "high") {
    log("WhatsApp sent to " + base + " Reply YES or NO.", "warn");
    log("SMS also sent to " + p.name + " as backup (high risk).", "warn");
  } else if (p.risk === "medium") {
    log("WhatsApp sent to " + base + " Reply YES to confirm.", "info");
  } else {
    log("SMS sent to " + base, "info");
  }
}

function confirmAppointment(id) {
  const p = getPatient(id);
  if (!p || p.status !== "pending") return;
  p.status = "confirmed";
  log(
    `${p.name} confirmed their appointment on ${p.date} at ${p.time}.`,
    "info",
  );
  renderAppointments();
}

function cancelAppointment(id) {
  const p = getPatient(id);
  if (!p || p.status !== "pending") return;
  p.status = "cancelled";
  log(`${p.name} cancelled their slot (${p.date} · ${p.time}).`, "cancel");
  notifyNextOnWaitlist(p);
  renderAppointments();
}

function notifyNextOnWaitlist(cancelled) {
  const next = waitlist.find((w) => !w.notified);
  if (!next) {
    log("No one left on the waitlist.", "warn");
    return;
  }
  next.notified = true;
  log(
    `Slot opened! WhatsApp sent to ${next.name} (${next.phone}) — slot on ${cancelled.date} at ${cancelled.time} is free. Want it?`,
    "waitlist",
  );
  renderWaitlist();
}

// -- START --

renderAppointments();
renderWaitlist();
log("System started. Appointments loaded for May 7.", "info");
log(
  "High risk patients: Priya Sharma, Vikram Singh — send reminders first.",
  "warn",
);
