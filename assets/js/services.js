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

// our service2
document.addEventListener("DOMContentLoaded", () => {
  const serviceBoxes = document.querySelectorAll(".service-box");

  serviceBoxes.forEach((box) => {
    const bg = box.getAttribute("data-bg");
    box.style.backgroundImage = "none";

    box.addEventListener("mouseenter", () => {
      box.style.backgroundImage = `url(${bg})`;
    });

    box.addEventListener("mouseleave", () => {
      box.style.backgroundImage = "none";
    });
  });
});

// testimonial
const testimonials = [
  {
    photo: "assets/img/home/process1.webp",
    text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    name: "Sophia Martinez",
    role: "Client Manager",
  },
  {
    photo: "assets/img/home/process1.webp",
    text: "Using Lorem Ipsum allows designers to focus on content structure, giving more importance to layout.",
    name: "Liam Johnson",
    role: "Business Owner",
  },
  {
    photo: "assets/img/home/process1.webp",
    text: "The tool gave us flexibility and saved us time. We’re very happy with the end result.",
    name: "Emma Wilson",
    role: "Marketing Head",
  },
];

let current = 0;
const photo = document.getElementById("testimonial-photo");
const text = document.getElementById("testimonial-text");
const name = document.getElementById("testimonial-name");
const role = document.getElementById("testimonial-role");
const dots = document.querySelectorAll(".testimonial-dots .dot");

function showTestimonial(index) {
  const t = testimonials[index];
  photo.src = t.photo;
  text.innerText = `"${t.text}"`;
  name.innerText = t.name;
  role.innerText = t.role;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
}

setInterval(() => {
  current = (current + 1) % testimonials.length;
  showTestimonial(current);
}, 4000);

showTestimonial(current);

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
