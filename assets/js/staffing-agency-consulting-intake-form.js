document.addEventListener("DOMContentLoaded", () => {
  // Sections
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

  // --- Signature pad refs ---
  const canvas = document.getElementById("signaturePad");
  const sigClear = document.getElementById("sigClear");
  const sigHidden = document.getElementById("signatureData");
  let ctx = null;
  let drawing = false;

  const fit = () => {
    if (!canvas) return;

    if (canvas.offsetParent === null) return;

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
    if (sigHidden && canvas) {
      sigHidden.value = canvas.toDataURL("image/png");
    }
  };

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

    if (canvas && sections[i] && sections[i].contains(canvas)) {
      requestAnimationFrame(fit);
    }
  }

  function validateCurrent() {
    const form = sections[current]?.querySelector("form");
    if (!form) return true;
    const ok = form.checkValidity();
    form.classList.add("was-validated");
    return ok;
  }

  //  Next/Prev buttons
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

  // Signature events (added once)
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

    window.addEventListener("resize", () => {
      if (canvas && canvas.offsetParent !== null) fit();
    });

    if (sigClear)
      sigClear.addEventListener("click", () => {
        if (!ctx) fit();
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (sigHidden) sigHidden.value = "";
      });
  }

  const finalForm = document.getElementById("dbc-form-6");
  const modalEl = document.getElementById("dbcConfirmModal");
  if (finalForm && modalEl && window.bootstrap) {
    finalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateCurrent()) return;
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    });
  }

  showStep(current);
});
