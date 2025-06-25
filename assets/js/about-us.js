// our skill
document.querySelectorAll(".skill-box").forEach((skill) => {
  const imgSrc = skill.getAttribute("data-image");
  const skillText = skill.querySelector(".skill-text");
  const iconWrapper = skill.querySelector(".icon-circle");

  // Create hover-content if not already
  if (!skill.querySelector(".hover-content")) {
    const hoverContent = document.createElement("div");
    hoverContent.classList.add("hover-content");

    const textClone = skillText.cloneNode(true);
    const iconClone = iconWrapper.cloneNode(true);
    const img = document.createElement("img");
    img.src = imgSrc;
    img.classList.add("hover-image");
    img.alt = "Skill Image";

    hoverContent.appendChild(textClone);
    hoverContent.appendChild(img);
    hoverContent.appendChild(iconClone);

    skill.appendChild(hoverContent);
  }

  skill.addEventListener("mouseenter", () => {
    skill.classList.add("hovered");
  });

  skill.addEventListener("mouseleave", () => {
    skill.classList.remove("hovered");
  });
});

// video section

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playBtn");
  const videoModal = document.getElementById("videoModal");
  const closeBtn = document.getElementById("closeBtn");
  const videoIframe = document.getElementById("videoIframe");
  const closeModal = document.getElementById("closeModal");

  const youtubeUrl = "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1";

  playBtn.addEventListener("click", () => {
    videoIframe.src = youtubeUrl;
    videoModal.classList.add("active");
  });

  const closePopup = () => {
    videoModal.classList.remove("active");
    videoIframe.src = ""; // Stop the video
  };

  closeBtn.addEventListener("click", closePopup);
  closeModal.addEventListener("click", closePopup);
});

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
