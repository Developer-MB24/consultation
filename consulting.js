function scrollToNext() {
  const nextSection = document.getElementById("next-section");
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: "smooth" });
  }
}
