const countries = [
  ["United States", "us"], ["Canada", "ca"], ["Mexico", "mx"], ["Brazil", "br"], ["Argentina", "ar"],
  ["United Kingdom", "gb"], ["France", "fr"], ["Germany", "de"], ["Spain", "es"], ["Italy", "it"],
  ["Portugal", "pt"], ["Netherlands", "nl"], ["Belgium", "be"], ["Switzerland", "ch"], ["Austria", "at"],
  ["Sweden", "se"], ["Norway", "no"], ["Finland", "fi"], ["Denmark", "dk"], ["Ireland", "ie"],
  ["Poland", "pl"], ["Czechia", "cz"], ["Greece", "gr"], ["Ukraine", "ua"], ["Romania", "ro"],
  ["Hungary", "hu"], ["Croatia", "hr"], ["Turkey", "tr"], ["Russia", "ru"], ["Iceland", "is"],
  ["Japan", "jp"], ["China", "cn"], ["South Korea", "kr"], ["India", "in"], ["Thailand", "th"],
  ["Vietnam", "vn"], ["Indonesia", "id"], ["Philippines", "ph"], ["Malaysia", "my"], ["Singapore", "sg"],
  ["Australia", "au"], ["New Zealand", "nz"], ["South Africa", "za"], ["Egypt", "eg"], ["Morocco", "ma"],
  ["Nigeria", "ng"], ["Kenya", "ke"], ["Ghana", "gh"], ["Ethiopia", "et"], ["Tanzania", "tz"]
];

let selectedCount = 20;
let roundCountries = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let answered = false;

const setupScreen = document.querySelector("#setupScreen");
const gameScreen = document.querySelector("#gameScreen");
const resultScreen = document.querySelector("#resultScreen");
const scoreEl = document.querySelector("#score");
const streakEl = document.querySelector("#streak");
const flagImage = document.querySelector("#flagImage");
const answersEl = document.querySelector("#answers");
const feedbackEl = document.querySelector("#feedback");
const nextButton = document.querySelector("#nextButton");
const progressLabel = document.querySelector("#progressLabel");
const progressBar = document.querySelector("#progressBar");

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showScreen(screen) {
  setupScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

function updateStats() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
}

function startGame() {
  roundCountries = shuffle(countries).slice(0, selectedCount);
  currentIndex = 0;
  score = 0;
  streak = 0;
  updateStats();
  showScreen(gameScreen);
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  nextButton.classList.add("hidden");
  feedbackEl.className = "feedback hidden";
  feedbackEl.textContent = "";

  const [correctName, code] = roundCountries[currentIndex];
  flagImage.src = `https://flagcdn.com/w640/${code}.png`;
  flagImage.alt = `Flag of a country, question ${currentIndex + 1}`;

  const distractors = shuffle(countries.filter(([name]) => name !== correctName)).slice(0, 3).map(([name]) => name);
  const options = shuffle([correctName, ...distractors]);
  answersEl.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = option;
    button.addEventListener("click", () => answerQuestion(option, correctName, button));
    answersEl.appendChild(button);
  });

  progressLabel.textContent = `Question ${currentIndex + 1} of ${selectedCount}`;
  progressBar.style.width = `${(currentIndex / selectedCount) * 100}%`;
}

function answerQuestion(selected, correctName, selectedButton) {
  if (answered) return;
  answered = true;

  const buttons = [...answersEl.querySelectorAll("button")];
  buttons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === correctName) button.classList.add("correct");
  });

  if (selected === correctName) {
    score++;
    streak++;
    feedbackEl.textContent = "Correct!";
    feedbackEl.className = "feedback correct";
  } else {
    streak = 0;
    selectedButton.classList.add("incorrect");
    feedbackEl.textContent = `Not quite — it was ${correctName}.`;
    feedbackEl.className = "feedback incorrect";
  }

  updateStats();
  nextButton.classList.remove("hidden");
  if (currentIndex === selectedCount - 1) nextButton.innerHTML = `See results <span aria-hidden="true">→</span>`;
}

function nextQuestion() {
  if (!answered) return;
  currentIndex++;
  if (currentIndex >= selectedCount) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  showScreen(resultScreen);
  progressBar.style.width = "100%";
  document.querySelector("#finalScore").textContent = `${score}/${selectedCount}`;
  document.querySelector("#finalLabel").textContent = "correct answers";

  const percent = score / selectedCount;
  let title = "Keep exploring!";
  let message = "Every flag you learn makes the world feel a little smaller.";
  if (percent === 1) {
    title = "Perfect round!";
    message = "You identified every flag. Outstanding knowledge!";
  } else if (percent >= .7) {
    title = "Great run!";
    message = "You know your flags. Just a few more and you'll be a master.";
  } else if (percent >= .4) {
    title = "Nice effort!";
    message = "You're building a strong world geography foundation.";
  }
  document.querySelector("#resultTitle").textContent = title;
  document.querySelector("#resultMessage").textContent = message;
}

document.querySelectorAll(".length-option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".length-option").forEach((option) => {
      option.classList.remove("active");
      option.setAttribute("aria-checked", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-checked", "true");
    selectedCount = Number(button.dataset.count);
  });
});

document.querySelector("#startButton").addEventListener("click", startGame);
nextButton.addEventListener("click", nextQuestion);
document.querySelector("#exitButton").addEventListener("click", () => showScreen(setupScreen));
document.querySelector("#playAgainButton").addEventListener("click", startGame);
document.querySelector("#changeLengthButton").addEventListener("click", () => showScreen(setupScreen));
