function scrollToNextSection() {
  const next = document.getElementById("next");
  if (next) {
    next.scrollIntoView({ behavior: "smooth" });
  }
}

// section 3
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

// services

document.addEventListener("DOMContentLoaded", () => {
  const hoverImage = document.querySelector(".hover-image");
  const items = document.querySelectorAll(".service-item");

  items.forEach((item) => {
    item.addEventListener("mouseenter", (e) => {
      const imgSrc = item.getAttribute("data-img");
      hoverImage.style.backgroundImage = `url(${imgSrc})`;
      hoverImage.style.display = "block";
    });

    item.addEventListener("mousemove", (e) => {
      hoverImage.style.top = e.pageY - 100 + "px";
      hoverImage.style.left = e.pageX + 20 + "px";
    });

    item.addEventListener("mouseleave", () => {
      hoverImage.style.display = "none";
    });
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

// our team
document.addEventListener("DOMContentLoaded", () => {
  const teamRows = document.querySelectorAll(".team-row");
  const floatingImage = document.getElementById("floatingImage");
  const imageWrapper = floatingImage.parentElement;

  teamRows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      // Remove active from all rows
      teamRows.forEach((r) => r.classList.remove("active"));
      row.classList.add("active");

      // Update image
      const imgPath = row.getAttribute("data-image");
      floatingImage.src = imgPath;

      // Move image to match hovered row
      const top = row.offsetTop + row.offsetHeight / 2;
      imageWrapper.style.top = `${top}px`;

      // Show image
      imageWrapper.classList.add("active");
    });

    row.addEventListener("mouseleave", () => {
      row.classList.remove("active");
      imageWrapper.classList.remove("active");
    });
  });
});

// testimonial
document.addEventListener("DOMContentLoaded", () => {
  const testimonials = [
    {
      text: "Stay one step ahead of your competition with our thorough market research and competitive analysis...",
      name: "James Walker",
      title: "CLIENT MANAGER",
      image: "assets/img/home/process1.webp",
    },
    {
      text: "This consulting firm transformed our entire approach to strategic planning. Their insights are gold.",
      name: "Rachel Singh",
      title: "OPERATIONS LEAD",
      image: "assets/img/home/process1.webp",
    },
    {
      text: "Their team gave us actionable market advice and delivered way beyond expectations.",
      name: "Carlos Rivera",
      title: "MARKETING DIRECTOR",
      image: "assets/img/home/process1.webp",
    },
    {
      text: "We’ve seen over 40% growth thanks to their recommendations. Truly outstanding service!",
      name: "Linda Zhang",
      title: "BUSINESS OWNER",
      image: "assets/img/home/process1.webp",
    },
  ];

  const textEl = document.getElementById("testimonial-text");
  const nameEl = document.getElementById("testimonial-name");
  const titleEl = document.getElementById("testimonial-title");
  const imageEl = document.getElementById("testimonial-image");
  const dotEls = document.querySelectorAll("#testimonial-dots .dot");

  dotEls.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.dataset.index);

      // Update content
      textEl.textContent = testimonials[index].text;
      nameEl.textContent = testimonials[index].name;
      titleEl.textContent = testimonials[index].title;
      imageEl.src = testimonials[index].image;

      // Update active dot
      dotEls.forEach((d) => d.classList.remove("active"));
      dot.classList.add("active");
    });
  });
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
