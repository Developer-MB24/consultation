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
