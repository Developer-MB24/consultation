// animation.js

window.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.5 }
  );

  document
    .querySelectorAll(".animated-title")
    .forEach((el) => observer.observe(el));
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

  // Initial setup
  handleResize();

  // Update on window resize
  window.addEventListener("resize", handleResize);

  // Clicking the link should still navigate (do nothing here)
  dropdownToggle.addEventListener("click", function (e) {
    // Let default behavior continue (navigate to services.html)
  });
});

// mobile
// document.addEventListener("DOMContentLoaded", function () {
//   const mobileServicesLink = document.getElementById("mobileServicesLink");
//   const servicesSubmenu = document.getElementById("servicesSubmenu");

//   let tappedOnce = false;

//   mobileServicesLink.addEventListener("click", function (e) {
//     if (window.innerWidth < 992) {
//       // On mobile
//       if (!tappedOnce) {
//         e.preventDefault();
//         const bsCollapse = new bootstrap.Collapse(servicesSubmenu, {
//           toggle: true,
//         });
//         tappedOnce = true;
//       } else {
//         // Navigate on second tap
//         tappedOnce = false;
//       }
//     }
//   });
// });
