document.addEventListener("DOMContentLoaded", () => {
  // Config
  const ENABLE_AUTOSAVE = false;
  const STORAGE_KEY = "dbc-intake-autosave";

  // Sections
  const sections = Array.from(
    document.querySelectorAll("#dbc-sections .dbc-section")
  );
  let current = sections.findIndex((s) => s.classList.contains("active"));
  if (current < 0) current = 0;

  const topTitleEl = document.getElementById("dbc-current-title");

  // === Signature pad refs ==
  const canvas = document.getElementById("signaturePad");
  const sigClear = document.getElementById("sigClear");
  const sigHidden = document.getElementById("signatureData");
  const signatureDate = document.getElementById("signatureDate");

  let ctx = null,
    drawing = false;

  // Default today's date
  if (signatureDate && !signatureDate.value) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    signatureDate.value = `${y}-${m}-${d}`;
  }

  // Signature canvas sizing
  const fit = () => {
    if (!canvas || canvas.offsetParent === null) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const w = canvas.clientWidth || canvas.parentElement?.clientWidth || 600;
    const h = 200;
    canvas.width = Math.floor(w * ratio);
    canvas.height = Math.floor(h * ratio);
    canvas.style.height = h + "px";
    ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
  };

  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  };
  const start = (e) => {
    if (!ctx) fit();
    drawing = true;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawing || !ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = () => {
    drawing = false;
    if (sigHidden && canvas) sigHidden.value = canvas.toDataURL("image/png");
  };

  // Section title
  const sectionTitle = (sec) => {
    const fromData = sec.getAttribute("data-title");
    if (fromData) return fromData;
    const h = sec.querySelector("h3, .section-title");
    if (h) return h.textContent.trim();
    const idx = sections.indexOf(sec) + 1;
    return `Section ${idx}`;
  };
  const updateTopTitle = (i) => {
    if (topTitleEl) topTitleEl.textContent = sectionTitle(sections[i]);
  };

  function showStep(i) {
    if (i < 0 || i >= sections.length) return;
    sections.forEach((sec, idx) => {
      sec.classList.toggle("d-none", idx !== i);
      sec.classList.toggle("active", idx === i);
    });
    current = i;
    updateTopTitle(i);
    if (canvas && sections[i]?.contains(canvas)) requestAnimationFrame(fit);
    document
      .querySelector("#dbc-intake")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Validation
  function markInvalid(el) {
    el.classList.add("is-invalid");
  }
  function clearInvalid(el) {
    el.classList.remove("is-invalid");
  }

  // === Custom Validation Rules ===
  function customValidations(field) {
    const val = field.value.trim();

    // Names
    if (
      field.previousElementSibling?.textContent.includes("Full Name") ||
      field.previousElementSibling?.textContent.includes("Business Name")
    ) {
      if (/\d/.test(val)) {
        field.setCustomValidity("Name should not contain numbers.");
        return false;
      }
      if (val && val[0] !== val[0].toUpperCase()) {
        field.setCustomValidity("First letter should be capital.");
        return false;
      }
    }

    // DOB
    if (field.id === "dob" || field.name === "dob") {
      const dob = new Date(val);
      if (!isNaN(dob.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        const d = today.getDate() - dob.getDate();
        if (m < 0 || (m === 0 && d < 0)) age--;
        if (age < 18) {
          field.setCustomValidity("You must be at least 18 years old.");
          return false;
        }
      }
    }

    // Phone number
    if (field.type === "tel") {
      const phoneRegex = /^\+\d{1,3}\d{10}$/; // +1XXXXXXXXXX
      if (!phoneRegex.test(val)) {
        field.setCustomValidity(
          "Phone must start with country code and have 10 digits after it."
        );
        return false;
      }
    }

    // Email
    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
      if (!emailRegex.test(val)) {
        field.setCustomValidity("Email must include @ and end with .com.");
        return false;
      }
    }

    field.setCustomValidity("");
    return true;
  }

  function validateCurrent() {
    const form = sections[current]?.querySelector("form");
    if (!form) return true;

    form.querySelectorAll(".is-invalid").forEach(clearInvalid);

    const requiredFields = Array.from(form.querySelectorAll("[required]"));
    let ok = true;
    for (const field of requiredFields) {
      if (
        !customValidations(field) ||
        !field.checkValidity() ||
        !field.value?.trim()
      ) {
        ok = false;
        markInvalid(field);
      }
    }

    if (!ok) {
      const first =
        form.querySelector(".is-invalid") || form.querySelector(":invalid");
      if (first) {
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        first.focus({ preventScroll: true });
      }
    }

    return ok;
  }

  document.addEventListener("input", (e) => {
    const target = e.target;
    if (target.matches("input, select, textarea")) {
      customValidations(target);
      if (
        target.required &&
        target.checkValidity() &&
        target.value.trim() !== ""
      ) {
        clearInvalid(target);
      }
      if (ENABLE_AUTOSAVE) saveAll();
    }
  });
  document.addEventListener("change", (e) => {
    const target = e.target;
    if (target.matches("input, select, textarea")) {
      customValidations(target);
      if (
        target.required &&
        target.checkValidity() &&
        target.value.trim() !== ""
      ) {
        clearInvalid(target);
      }
      if (ENABLE_AUTOSAVE) saveAll();
    }
  });

  // Navigation
  const next = () => {
    if (validateCurrent() && current < sections.length - 1)
      showStep(current + 1);
  };
  const prev = () => {
    if (current > 0) showStep(current - 1);
  };

  document.addEventListener("click", (e) => {
    const nextBtn = e.target.closest("[data-next], .next");
    if (nextBtn) {
      e.preventDefault();
      next();
      return;
    }
    const prevBtn = e.target.closest("[data-prev], .prev");
    if (prevBtn) {
      e.preventDefault();
      prev();
      return;
    }
  });

  // Autosize textareas
  document.querySelectorAll("textarea[data-autosize]").forEach((ta) => {
    const resize = () => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    };
    resize();
    ta.addEventListener("input", resize);
  });

  // Signature events
  if (canvas) {
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);

    canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        start(e);
      },
      { passive: false }
    );
    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        move(e);
      },
      { passive: false }
    );
    canvas.addEventListener("touchend", end);

    if (sigClear)
      sigClear.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sigHidden.value = "";
      });

    window.addEventListener("resize", () => {
      if (canvas && canvas.offsetParent !== null) fit();
    });
  }

  // === Preview ===================================
  const previewBtn = document.getElementById("previewBtn");
  if (previewBtn) {
    previewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!validateCurrent()) return;

      const data = {};
      document
        .querySelectorAll(
          "#dbc-sections input, #dbc-sections select, #dbc-sections textarea"
        )
        .forEach((el) => {
          const label =
            el.closest("label")?.innerText ||
            el.placeholder ||
            el.name ||
            el.id ||
            "Field";
          if (el.type === "checkbox") {
            if (!data[label]) data[label] = [];
            if (el.checked) data[label].push("✔");
          } else if (el.type === "radio") {
            if (el.checked) data[label] = el.value || "✔";
          } else {
            data[label] = el.value;
          }
        });

      let html =
        "<h3 class='mb-3'>Preview Your Intake</h3><ul class='list-group'>";
      Object.entries(data).forEach(([k, v]) => {
        if (!v || (Array.isArray(v) && v.length === 0)) return;
        html += `<li class="list-group-item"><strong>${k}:</strong> ${
          Array.isArray(v) ? v.join(", ") : v
        }</li>`;
      });
      html += "</ul>";

      const modalEl = document.getElementById("dbcConfirmModal");
      if (modalEl) {
        modalEl.querySelector(".modal-title").textContent = "Preview";
        modalEl.querySelector(".modal-body").innerHTML = html;
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  }

  // === Submit ==================================
  const lastForm = sections.at(-1)?.querySelector("form");
  const modalEl = document.getElementById("dbcConfirmModal");
  if (lastForm && modalEl && typeof bootstrap !== "undefined") {
    lastForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateCurrent()) return;
      modalEl.querySelector(".modal-title").textContent =
        "Thank you for reaching out";
      modalEl.querySelector(".modal-body").textContent =
        "Your intake has been submitted. The DBC team will review and contact you soon.";
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    });
  }

  // Autosave
  function saveAll() {
    if (!ENABLE_AUTOSAVE) return;
    const data = {};
    document
      .querySelectorAll(
        "#dbc-sections input, #dbc-sections select, #dbc-sections textarea"
      )
      .forEach((el) => {
        const key =
          el.id ||
          el.name ||
          el.closest(".dbc-section")?.getAttribute("data-title") +
            ":" +
            (el.placeholder || el.type);
        if (el.type === "checkbox" || el.type === "radio") {
          data[key] = el.checked;
        } else {
          data[key] = el.value;
        }
      });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  function loadAll() {
    if (!ENABLE_AUTOSAVE) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      document
        .querySelectorAll(
          "#dbc-sections input, #dbc-sections select, #dbc-sections textarea"
        )
        .forEach((el) => {
          const key =
            el.id ||
            el.name ||
            el.closest(".dbc-section")?.getAttribute("data-title") +
              ":" +
              (el.placeholder || el.type);
          if (!(key in data)) return;
          if (el.type === "checkbox" || el.type === "radio") {
            el.checked = !!data[key];
          } else {
            el.value = data[key];
          }
        });
    } catch (_) {}
  }
  if (ENABLE_AUTOSAVE) loadAll();

  // Init
  sections.forEach((s, i) => s.classList.toggle("d-none", i !== current));
  updateTopTitle(current);
  if (canvas && sections[current]?.contains(canvas)) fit();
});

// === Restrict phone input length ===
const phoneInput = document.getElementById("phoneNumber");
if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    let val = phoneInput.value;

    // Ensure it starts with +
    if (!val.startsWith("+")) {
      val = "+" + val.replace(/[^0-9]/g, "");
    }

    // Allow only digits after +
    val = "+" + val.substring(1).replace(/\D/g, "");

    // Split into country code + 10 digits max
    const match = val.match(/^(\+\d{1,3})(\d*)$/);
    if (match) {
      let country = match[1];
      let number = match[2].slice(0, 10); // max 10 digits
      val = country + number;
    }

    phoneInput.value = val;
  });
}
