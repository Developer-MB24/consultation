document.addEventListener("DOMContentLoaded", () => {
  // Sections and steps
  const sections = [
    "dbc-section-1",
    "dbc-section-2",
    "dbc-section-3",
    "dbc-section-4",
    "dbc-section-5",
    "dbc-section-6",
  ].map((id) => document.getElementById(id));

  const stepEls = [
    "dbc-step-0",
    "dbc-step-1",
    "dbc-step-2",
    "dbc-step-3",
    "dbc-step-4",
    "dbc-step-5",
  ].map((id) => document.getElementById(id));

  const lineEls = Array.from(
    document.querySelectorAll(".dbc-step-progress .dbc-line")
  );

  let current = sections.findIndex((s) => s.classList.contains("active"));
  if (current < 0) current = 0;

  function showStep(i) {
    if (i < 0 || i >= sections.length) return;

    sections.forEach((sec, idx) => {
      sec.classList.toggle("show", idx === i);
      sec.classList.toggle("active", idx === i);
    });

    stepEls.forEach((el, idx) => {
      el.classList.toggle("active", idx === i);
      el.classList.toggle("completed", idx < i);
    });

    lineEls.forEach((line, idx) => {
      line.classList.toggle("completed", idx < i);
    });

    current = i;
  }

  function validateCurrent() {
    const form = sections[current]?.querySelector("form");
    if (!form) return true;
    const ok = form.checkValidity();
    form.classList.add("was-validated");
    return ok;
  }

  // Wire Next/Prev buttons (no inline handlers needed)
  document.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!validateCurrent()) return;
      showStep(current + 1);
    });
  });

  document.querySelectorAll("[data-prev]").forEach((btn) => {
    btn.addEventListener("click", () => showStep(current - 1));
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

  // “Other” helpers
  const entityOtherRadio = document.getElementById("entityOtherRadio");
  const entityOtherInput = document.getElementById("entityOther");
  if (entityOtherRadio && entityOtherInput) {
    entityOtherInput.addEventListener(
      "focus",
      () => (entityOtherRadio.checked = true)
    );
  }
  const svcOtherCheck = document.getElementById("svcOtherCheck");
  const svcOtherText = document.getElementById("svcOtherText");
  if (svcOtherCheck && svcOtherText) {
    svcOtherText.addEventListener(
      "focus",
      () => (svcOtherCheck.checked = true)
    );
  }

  // Signature (optional: clear button)
  const canvas = document.getElementById("signaturePad");
  const sigClear = document.getElementById("sigClear");
  const sigHidden = document.getElementById("signatureData");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let drawing = false;

    const fit = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const w = canvas.clientWidth;
      const h = 200; // matches your HTML height
      canvas.width = w * ratio;
      canvas.height = h * ratio;
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
    };
    fit();
    window.addEventListener("resize", fit);

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    };
    const start = (e) => {
      drawing = true;
      const { x, y } = pos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    const move = (e) => {
      if (!drawing) return;
      const { x, y } = pos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const end = () => {
      drawing = false;
      if (sigHidden) sigHidden.value = canvas.toDataURL("image/png");
    };

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
        fit();
        if (sigHidden) sigHidden.value = "";
      });
  }

  // Submit -> show modal (kept simple)
  const finalForm = document.getElementById("dbc-form-6");
  const modalEl = document.getElementById("dbcConfirmModal");
  if (finalForm && modalEl) {
    finalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateCurrent()) return;
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    });
  }

  // Start at Section 1
  showStep(current);
});
