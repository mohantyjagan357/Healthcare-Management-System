/* ---------- Configuration ---------- */
const API_BASE = "/api";
const doctors = [
    {
        id: "dr_sharma",
        name: "Dr. Rajesh Sharma",
        specialty: "Cardiology",
        degree: "MD",
        experience: "12 yrs",
    },
    {
        id: "dr_roy",
        name: "Dr. Anita Roy",
        specialty: "General Medicine",
        degree: "MBBS",
        experience: "8 yrs",
    },
    {
        id: "dr_singh",
        name: "Dr. Vikram Singh",
        specialty: "Orthopedics",
        degree: "MS",
        experience: "10 yrs",
    },
    {
        id: "dr_menon",
        name: "Dr. Priya Menon",
        specialty: "Pediatrics",
        degree: "MD",
        experience: "9 yrs",
    },
];
// We'll generate simple availability slots per doctor (next 7 days, 09:00-17:00 slots 30 min)
let generatedSlots = {};
let selectedSlot = null;

/* ---------- Utilities ---------- */
function randomHospitalName() {
    const words1 = [
        "Green",
        "Blue",
        "City",
        "Prime",
        "Lotus",
        "Unity",
        "Care",
        "Hope",
        "Harmony",
        "Nova",
    ];
    const words2 = [
        "Health",
        "Hospital",
        "Clinic",
        "Center",
        "Hospitality",
        "Medicare",
    ];
    return (
        words1[Math.floor(Math.random() * words1.length)] +
        " " +
        words2[Math.floor(Math.random() * words2.length)]
    );
}
function el(id) {
    return document.getElementById(id);
}
function showMsg(id, text, ok = true) {
    const el = document.getElementById(id);
    el.innerHTML = `<div class="${ok ? "success" : "error"}">${text}</div>`;
    setTimeout(() => (el.innerHTML = ""), 6000);
}
function isoNoTZ(dt) {
    // returns YYYY-MM-DDTHH:mm:ss (no Z)
    const s = dt.toISOString();
    return s.replace("Z", "").slice(0, 19);
}
function formatSlotLabel(iso) {
    const d = new Date(iso);
    return d.toLocaleString();
}

/* ---------- render landing pieces ---------- */
document.getElementById("hospitalName").textContent = randomHospitalName();
document.getElementById("heroTitle").textContent = `Welcome to ${document.getElementById("hospitalName").textContent
    }`;

/* ---------- Doctor list & slots generation ---------- */
function generateSlotsForDoctor(docId) {
    // produce slots for next 7 days: 09:00 - 17:00, 30-min slots
    const slots = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (let day = 0; day < 7; day++) {
        const base = new Date(now.getTime() + day * 24 * 60 * 60 * 1000);
        for (let hour = 9; hour < 17; hour++) {
            for (let half = 0; half < 2; half++) {
                const st = new Date(base);
                st.setHours(hour, half * 30, 0, 0);
                // skip past slots
                if (st < new Date()) continue;
                const en = new Date(st.getTime() + 30 * 60000);
                slots.push({ start: isoNoTZ(st), end: isoNoTZ(en), booked: false });
            }
        }
    }
    return slots;
}

function renderDoctors() {
    const list = el("doctorsList");
    list.innerHTML = "";
    doctors.forEach((d) => {
        if (!generatedSlots[d.id])
            generatedSlots[d.id] = generateSlotsForDoctor(d.id);
        const slotsPreview = generatedSlots[d.id]
            .slice(0, 6)
            .map(
                (s) => `<span class="slot">${new Date(s.start).toLocaleString()}</span>`
            )
            .join("");
        const node = document.createElement("div");
        node.className = "doc";
        node.innerHTML = `
      <div class="avatar">${d.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}</div>
      <div style="flex:1">
        <div style="font-weight:800">${d.name
            } <span class="muted" style="font-weight:600;font-size:13px"> — ${d.specialty
            }</span></div>
        <div class="muted">${d.degree} • ${d.experience}</div>
        <div style="margin-top:8px">${slotsPreview}</div>
      </div>
      <div style="width:160px;text-align:right">
        <button onclick="openDoctorSlots('${d.id
            }')" style="padding:8px 10px;border-radius:8px;border:1px solid #e6eef8;background:white;cursor:pointer">View Slots</button>
        <div class="muted small" style="margin-top:8px">Consult fee: ₹500</div>
      </div>
    `;
        list.appendChild(node);
    });
    // populate doctor select
    const sel = el("doctorSelect");
    sel.innerHTML = '<option value="">-- Choose doctor --</option>';
    doctors.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = `${d.name} — ${d.specialty}`;
        sel.appendChild(opt);
    });
}

/* open slots in booking area */
function openDoctorSlots(docId) {
    selectedSlot = null;
    const slots =
        generatedSlots[docId] ||
        (generatedSlots[docId] = generateSlotsForDoctor(docId));
    const container = el("slotsContainer");
    container.innerHTML = "";
    const title = document.createElement("div");
    title.style.marginBottom = "8px";
    title.style.fontWeight = "700";
    title.textContent = "Available slots (click to select)";
    container.appendChild(title);
    // show first 20 upcoming
    slots.slice(0, 20).forEach((s) => {
        const btn = document.createElement("button");
        btn.className = "slot";
        btn.textContent = formatSlotLabel(s.start);
        if (s.booked) {
            btn.classList.add("booked");
            btn.disabled = true;
        }
        btn.onclick = () => {
            // mark selection
            selectedSlot = { ...s, doctor: docId };
            // highlight selection visually
            Array.from(container.querySelectorAll(".slot")).forEach(
                (x) => (x.style.borderColor = "#dbeafe")
            );
            btn.style.borderColor = "#2563eb";
            btn.style.background = "#dbeafe";
        };
        container.appendChild(btn);
    });
    // set doctor select to this doctor
    el("doctorSelect").value = docId;
    scrollToSection("book");
}

/* ---------- Patient registration & local storage ---------- */
function registerPatient() {
    const name = el("pname").value.trim();
    const contact = el("pcontact").value.trim();
    const address = el("paddress").value.trim();
    const dob = el("pdob").value || null;
    if (!name) {
        showMsg("regMsg", "Please enter name", false);
        return;
    }
    const payload = { name, contact, address, dob };
    fetch(API_BASE + "/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then(async (res) => {
            if (!res.ok) {
                const t = await res.text();
                showMsg("regMsg", "Failed to register: " + t, false);
                return;
            }
            const data = await res.json();
            // save id locally for convenience
            localStorage.setItem("hms_patient_id", data.id);
            el("patientIdInput").value = data.id;
            showMsg(
                "regMsg",
                "Registered successfully — Patient ID: " + data.id,
                true
            );
            loadCounts();
        })
        .catch((err) => showMsg("regMsg", "Network error: " + err.message, false));
}

/* ---------- Booking flow ---------- */
function confirmBooking() {
    const pid =
        el("patientIdInput").value || localStorage.getItem("hms_patient_id");
    if (!pid) {
        showMsg(
            "bookingMsg",
            "Please register or enter your patient ID first",
            false
        );
        return;
    }
    const docId = el("doctorSelect").value;
    if (!docId) {
        showMsg("bookingMsg", "Select a doctor", false);
        return;
    }
    if (!selectedSlot || selectedSlot.doctor !== docId) {
        showMsg("bookingMsg", "Choose a slot for the selected doctor", false);
        return;
    }

    // Build the appointment payload expected by backend: patient: { id }, provider: 'Doctor Name', startTime, endTime
    const doctor = doctors.find((d) => d.id === docId);
    const payload = {
        patient: { id: Number(pid) },
        provider: doctor.name,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
    };
    fetch(API_BASE + "/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then(async (res) => {
            if (!res.ok) {
                const t = await res.text();
                showMsg("bookingMsg", "Booking failed: " + t, false);
                return;
            }
            const appt = await res.json();
            // mark slot as booked locally to reflect instantly
            const sList = generatedSlots[docId] || [];
            const found = sList.find(
                (s) => s.start === selectedSlot.start && s.end === selectedSlot.end
            );
            if (found) found.booked = true;
            selectedSlot = null;
            showMsg("bookingMsg", "Appointment booked (ID: " + appt.id + ")", true);
            loadMyAppointments(pid);
            loadCounts();
        })
        .catch((err) =>
            showMsg("bookingMsg", "Network error: " + err.message, false)
        );
}

/* ---------- Load counts & appointments ---------- */
function loadCounts() {
    // patients count
    fetch(API_BASE + "/patients")
        .then((r) => (r.ok ? r.json() : []))
        .then((list) => {
            el("totalPatients").textContent = Array.isArray(list) ? list.length : 0;
        })
        .catch(() => (el("totalPatients").textContent = "0"));

    // appointments count (upcoming)
    fetch(API_BASE + "/appointments")
        .then((r) => (r.ok ? r.json() : []))
        .then((list) => {
            const upcoming = Array.isArray(list)
                ? list.filter((a) => a.status === "SCHEDULED")
                : [];
            el("totalAppointments").textContent = upcoming.length;
        })
        .catch(() => (el("totalAppointments").textContent = "0"));
}

function loadMyAppointments(patientId) {
    const pid =
        patientId ||
        el("patientIdInput").value ||
        localStorage.getItem("hms_patient_id");
    if (!pid) {
        el("myAppts").innerHTML = '<div class="muted">No patient selected</div>';
        return;
    }
    fetch(API_BASE + "/appointments")
        .then((r) => (r.ok ? r.json() : []))
        .then((list) => {
            const mine = list.filter((a) => String(a.patient?.id) === String(pid));
            if (!mine.length) {
                el("myAppts").innerHTML =
                    '<div class="muted">No upcoming appointments</div>';
                return;
            }
            const rows = mine
                .map(
                    (a) =>
                        `<tr><td>${a.id}</td><td>${a.provider}</td><td>${new Date(
                            a.startTime
                        ).toLocaleString()}</td><td>${a.status}</td></tr>`
                )
                .join("");
            el(
                "myAppts"
            ).innerHTML = `<table><thead><tr><th>ID</th><th>Doctor</th><th>Start</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`;
        })
        .catch(
            () =>
                (el("myAppts").innerHTML = '<div class="muted">Failed to load</div>')
        );
}

/* ---------- helpers ---------- */
function scrollToSection(id) {
    document
        .querySelector("#" + id)
        .scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- init ---------- */
renderDoctors();
loadCounts();
// prefill stored patient id
const stored = localStorage.getItem("hms_patient_id");
if (stored) el("patientIdInput").value = stored;
loadMyAppointments(stored);

// update slots when doctor select changes
el("doctorSelect").addEventListener("change", (e) => {
    openDoctorSlots(e.target.value);
});
