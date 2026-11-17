const questions = [
  {
    question: "Which language is primarily used for structuring web pages?",
    options: ["Python", "HTML", "CSS", "JavaScript"],
    answer: 1,
    explanation: "HTML (HyperText Markup Language) is used to structure web pages.",
  },
  {
    question: "Which language is used to style web pages?",
    options: ["CSS", "SQL", "Java", "HTML"],
    answer: 0,
    explanation: "CSS (Cascading Style Sheets) controls colors, fonts and layout.",
  },
  {
    question: "Which keyword creates a variable that cannot be reassigned?",
    options: ["var", "let", "const", "set"],
    answer: 2,
    explanation: "const makes a variable that cannot be given a new value.",
  },
  {
    question: "What does DOM stand for?",
    options: ["Data Object Model", "Document Object Model", "Display Order Map", "Digital Online Menu"],
    answer: 1,
    explanation: "DOM stands for Document Object Model. It is how JavaScript sees the page.",
  },
  {
    question: "Which HTTP method is normally used to get data from a server?",
    options: ["POST", "PUT", "DELETE", "GET"],
    answer: 3,
    explanation: "GET is used to ask a server for data.",
  },
  {
    question: "Which symbol is used for an ID selector in CSS?",
    options: ["#", ".", "*", "&"],
    answer: 0,
    explanation: "A hash sign selects an element by its id, like #title.",
  },
  {
    question: "What does JSON stand for?",
    options: ["Java Source Object Name", "JavaScript Object Notation", "Joint Script Online Network", "Java Standard Output Node"],
    answer: 1,
    explanation: "JSON stands for JavaScript Object Notation. It is a simple way to store data.",
  },
  {
    question: "Which array method makes a new array by changing every item?",
    options: ["filter()", "push()", "map()", "find()"],
    answer: 2,
    explanation: "map() runs a function on every item and returns a new array.",
  },
  {
    question: "Which Git command sends your commits to GitHub?",
    options: ["git clone", "git push", "git init", "git add"],
    answer: 1,
    explanation: "git push uploads your local commits to the remote repository.",
  },
  {
    question: "Which HTML tag makes the biggest heading?",
    options: ["<h6>", "<head>", "<h1>", "<title>"],
    answer: 2,
    explanation: "<h1> is the largest and most important heading.",
  },
];

const timePerQuestion = 60;

let current = 0;
let score = 0;
let timeLeft = timePerQuestion;
let timerId = null;
let answered = false;
let results = [];

const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const reviewBtn = document.getElementById("review-btn");
const retryBtn = document.getElementById("retry-btn");

const questionNumber = document.getElementById("question-number");
const timerText = document.getElementById("timer");
const progress = document.getElementById("progress");
const scoreText = document.getElementById("score");
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");

const feedback = document.getElementById("feedback");
const feedbackIcon = document.getElementById("feedback-icon");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackText = document.getElementById("feedback-text");

const finalScore = document.getElementById("final-score");
const finalMessage = document.getElementById("final-message");
const reviewList = document.getElementById("review-list");

const letters = ["A", "B", "C", "D"];

const normalClass =
  "flex items-center justify-between w-full border-2 border-black rounded-lg px-3 py-2 text-left font-semibold cursor-pointer hover:bg-gray-100";
const correctClass =
  "flex items-center justify-between w-full border-2 border-green-600 bg-green-100 rounded-lg px-3 py-2 text-left font-semibold";
const wrongClass =
  "flex items-center justify-between w-full border-2 border-red-500 bg-red-100 rounded-lg px-3 py-2 text-left font-semibold";
const plainClass =
  "flex items-center justify-between w-full border-2 border-black rounded-lg px-3 py-2 text-left font-semibold opacity-60";

const checkIcon =
  '<span class="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">✓</span>';

function showScreen(screen) {
  startScreen.classList.add("hidden");
  questionScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

function updateScore() {
  scoreText.textContent = "Score: " + score;
}

function updateTimer() {
  const seconds = String(timeLeft).padStart(2, "0");
  timerText.textContent = "00:" + seconds;
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = timePerQuestion;
  updateTimer();

  timerId = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      timeUp();
    }
  }, 1000);
}

function timeUp() {
  clearInterval(timerId);
  answered = true;
  score--;
  results.push({ selected: null });
  updateScore();
  nextQuestion();
}

function startQuiz() {
  current = 0;
  score = 0;
  results = [];
  reviewList.classList.add("hidden");
  progress.max = questions.length;
  showScreen(questionScreen);
  showQuestion();
}

function showQuestion() {
  const q = questions[current];
  answered = false;

  questionNumber.textContent = "Question " + (current + 1) + " of " + questions.length;
  progress.value = current;
  updateScore();
  questionText.textContent = q.question;
  feedback.classList.add("hidden");
  optionsBox.innerHTML = "";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = normalClass;
    button.textContent = letters[index] + ". " + option;
    button.addEventListener("click", () => chooseAnswer(index));
    optionsBox.appendChild(button);
  });

  nextBtn.textContent = current === questions.length - 1 ? "Results →" : "Next →";
  startTimer();
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const q = questions[current];
  const isCorrect = index === q.answer;
  const buttons = optionsBox.querySelectorAll("button");

  if (isCorrect) {
    score++;
  }

  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === q.answer) {
      button.className = correctClass;
      button.innerHTML = "<span>" + letters[i] + ". " + q.options[i] + "</span>" + checkIcon;
    } else if (i === index) {
      button.className = wrongClass;
    } else {
      button.className = plainClass;
    }
  });

  if (isCorrect) {
    feedbackIcon.textContent = "✓";
    feedbackIcon.className =
      "shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center";
    feedbackTitle.textContent = "Correct!";
    feedbackTitle.className = "font-extrabold text-green-600";
  } else {
    feedbackIcon.textContent = "✕";
    feedbackIcon.className =
      "shrink-0 w-6 h-6 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center";
    feedbackTitle.textContent = "Incorrect!";
    feedbackTitle.className = "font-extrabold text-red-500";
  }

  feedbackText.textContent = q.explanation;
  feedback.classList.remove("hidden");
  updateScore();

  results.push({ selected: index });
}

function nextQuestion() {
  current++;
  if (current === questions.length) {
    showResults();
  } else {
    showQuestion();
  }
}

function showResults() {
  clearInterval(timerId);
  showScreen(resultsScreen);
  finalScore.textContent = score + " / " + questions.length;

  if (score >= 8) {
    finalMessage.textContent = "Great job! 🎉";
  } else if (score >= 5) {
    finalMessage.textContent = "Good effort! 👍";
  } else {
    finalMessage.textContent = "Keep practicing! 💪";
  }

  buildReview();
}

function buildReview() {
  reviewList.innerHTML = "";

  questions.forEach((q, i) => {
    const selected = results[i].selected;
    const box = document.createElement("div");
    box.className = "border-2 border-gray-300 rounded-xl p-3";

    const title = document.createElement("p");
    title.className = "font-bold";
    title.textContent = i + 1 + ". " + q.question;

    const yourAnswer = document.createElement("p");
    yourAnswer.className = "text-sm";

    if (selected === null) {
      yourAnswer.textContent = "Your answer: Skipped (time ran out)";
      yourAnswer.className += " text-gray-500";
    } else if (selected === q.answer) {
      yourAnswer.textContent = "Your answer: " + q.options[selected];
      yourAnswer.className += " text-green-600";
    } else {
      yourAnswer.textContent = "Your answer: " + q.options[selected];
      yourAnswer.className += " text-red-500";
    }

    const correctAnswer = document.createElement("p");
    correctAnswer.className = "text-sm text-green-600";
    correctAnswer.textContent = "Correct answer: " + q.options[q.answer];

    box.appendChild(title);
    box.appendChild(yourAnswer);
    box.appendChild(correctAnswer);
    reviewList.appendChild(box);
  });
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);

reviewBtn.addEventListener("click", () => {
  reviewList.classList.toggle("hidden");
});

retryBtn.addEventListener("click", () => {
  showScreen(startScreen);
});

document.getElementById("total-questions-text").innerHTML = questions.length + "<br />Questions";
