function scrollToNext() {
  const nextSection = document.getElementById("next-section");
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Animate  elements on scroll
const upObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-show");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-active");
          entry.target.classList.add("animate-show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".animate-title, .animate-up").forEach((el) => {
    observer.observe(el);
  });
});

// slider

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector("#alignmentCarousel");

  if (carousel) {
    const bsCarousel = new bootstrap.Carousel(carousel, {
      interval: 2500,
      ride: "carousel",
      wrap: true,
    });
  }
});
