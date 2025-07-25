const phrases = [
  "Need a Website That Doesn’t Just Look Good—But Converts?",
  "Struggling With Off-the-Shelf Software That Doesn’t Fit?",
  "Want to Turn Your Brand Into a Revenue-Generating Machine?",
];

let currentIndex = 0;
const textElement = document.getElementById("rotating-text");

setInterval(() => {
  currentIndex = (currentIndex + 1) % phrases.length;
  textElement.textContent = phrases[currentIndex];
}, 4000); // change text every 4 seconds
