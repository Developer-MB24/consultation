// animation.js

window.addEventListener("DOMContentLoaded", () => {
  // Animate .animated-title elements on scroll
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observerInstance.unobserve(entry.target); // Animate once
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll(".animated-title").forEach((el) => {
    observer.observe(el);
  });
});

// nav
document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".dropdown");
  const dropdownToggle = dropdown.querySelector(".nav-link");
  const dropdownMenu = dropdown.querySelector(".dropdown-menu");

  function enableHoverDropdown() {
    dropdown.addEventListener("mouseenter", showDropdown);
    dropdown.addEventListener("mouseleave", hideDropdown);
  }

  function disableHoverDropdown() {
    dropdown.removeEventListener("mouseenter", showDropdown);
    dropdown.removeEventListener("mouseleave", hideDropdown);
    dropdownMenu.classList.remove("show");
  }

  function showDropdown() {
    dropdownMenu.classList.add("show");
  }

  function hideDropdown() {
    dropdownMenu.classList.remove("show");
  }

  function handleResize() {
    if (window.innerWidth >= 992) {
      enableHoverDropdown();
    } else {
      disableHoverDropdown();
    }
  }

  handleResize();

  window.addEventListener("resize", handleResize);

  dropdownToggle.addEventListener("click", function (e) {});
});

// modal content

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const consent = document.getElementById("smsConsent");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!consent.checked) {
        consent.classList.add("is-invalid");
        return;
      }

      const modal = new bootstrap.Modal(
        document.getElementById("thankYouModal")
      );
      modal.show();
      form.reset();
    });
  }
});
