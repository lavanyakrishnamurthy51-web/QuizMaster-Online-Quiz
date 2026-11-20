
/* ===============================
   QUIZMASTER - JAVASCRIPT
================================ */

// Quiz questions
const quizData = {
    web: [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Home Tool Markup Language",
                "Hyperlinks Text Management Language"
            ],
            answer: 0
        },
        {
            question: "Which language is used to style web pages?",
            options: ["Python", "CSS", "C++", "SQL"],
            answer: 1
        },
        {
            question: "Which tag is used for the largest heading in HTML?",
            options: ["<h6>", "<head>", "<h1>", "<header>"],
            answer: 2
        },
        {
            question: "Which HTML tag creates a hyperlink?",
            options: ["<link>", "<a>", "<href>", "<url>"],
            answer: 1
        },
        {
            question: "Which language is used to make web pages interactive?",
            options: ["JavaScript", "HTML", "CSS", "XML"],
            answer: 0
        }
    ],

    programming: [
        {
            question: "Which data type stores whole numbers?",
            options: ["String", "Integer", "Boolean", "Character"],
            answer: 1
        },
        {
            question: "Which symbol is used for comments in Python?",
            options: ["//", "/* */", "#", "<!-- -->"],
            answer: 2
        },
        {
            question: "Which loop repeats while a condition is true?",
            options: ["if", "while", "print", "switch"],
            answer: 1
        },
        {
            question: "Which function displays output in Python?",
            options: ["input()", "show()", "print()", "displayText()"],
            answer: 2
        },
        {
            question: "What is a function?",
            options: [
                "A reusable block of code",
                "A computer screen",
                "A data type",
                "An error"
            ],
            answer: 0
        }
    ],

    cs: [
        {
            question: "What is the full form of CPU?",
            options: [
                "Central Processing Unit",
                "Computer Personal Unit",
                "Central Program Utility",
                "Control Processing User"
            ],
            answer: 0
        },
        {
            question: "Which data structure follows FIFO?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            answer: 1
        },
        {
            question: "Which data structure follows LIFO?",
            options: ["Queue", "Array", "Stack", "Linked List"],
            answer: 2
        },
        {
            question: "Which is an operating system?",
            options: ["Windows", "Python", "HTML", "Java"],
            answer: 0
        },
        {
            question: "What is the full form of RAM?",
            options: [
                "Read Access Memory",
                "Random Access Memory",
                "Run Active Memory",
                "Rapid Application Memory"
            ],
            answer: 1
        }
    ]
};

// Variables
let questions = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answers = [];
let playerName = "";
let categoryName = "";
let difficultyName = "";
let timeLeft = 20;
let timerInterval = null;
let questionLocked = false;

// Timer settings
function getTimeLimit() {
    const difficulty = document.getElementById("difficulty").value;

    if (difficulty === "easy") return 20;
    if (difficulty === "medium") return 15;
    return 10;
}

// Shuffle questions
function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// Show one section and hide others
function showSection(sectionId) {
    const sections = [
        "homeSection",
        "quizSection",
        "resultSection",
        "leaderboardSection",
        "dashboardSection"
    ];

    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = id === sectionId ? "block" : "none";
        }
    });
}

// Start quiz
function startQuiz() {
    playerName = document.getElementById("playerName").value.trim();

    if (playerName === "") {
        alert("Please enter your name!");
        return;
    }

    const category = document.getElementById("category").value;
    difficultyName = document.getElementById("difficulty").value;

    if (category === "web") categoryName = "Web Development";
    if (category === "programming") categoryName = "Programming";
    if (category === "cs") categoryName = "Computer Science";

    questions = shuffleArray(quizData[category]);

    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    answers = [];

    showSection("quizSection");
    displayQuestion();
}

// Display question
function displayQuestion() {
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    questionLocked = false;
    selectedAnswer = null;

    const question = questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document.getElementById("questionText").textContent = question.question;

    document.getElementById("optionsContainer").innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "option-btn";
        button.textContent = option;

        button.onclick = function () {
            selectAnswer(index, button);
        };

        document.getElementById("optionsContainer").appendChild(button);
    });

    updateProgress();
    startTimer();
}

// Select answer
function selectAnswer(index, button) {
    if (questionLocked) return;

    questionLocked = true;
    selectedAnswer = index;

    clearInterval(timerInterval);

    const correctAnswer = questions[currentQuestion].answer;
    const optionButtons = document.querySelectorAll("#optionsContainer button");

    optionButtons.forEach(btn => {
        btn.disabled = true;
    });

    if (index === correctAnswer) {
        score++;
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
        optionButtons[correctAnswer].classList.add("correct");
    }

    saveAnswer(index);

    setTimeout(() => {
        currentQuestion++;
        displayQuestion();
    }, 1000);
}

// Save answer for review
function saveAnswer(index) {
    const question = questions[currentQuestion];

    answers.push({
        question: question.question,
        options: question.options,
        selected: index,
        correct: question.answer,
        isCorrect: index === question.answer
    });
}

// Timer
function startTimer() {
    clearInterval(timerInterval);

    timeLeft = getTimeLimit();

    document.getElementById("timer").textContent = "⏱️ " + timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;

        document.getElementById("timer").textContent = "⏱️ " + timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);

            if (!questionLocked) {
                questionLocked = true;

                answers.push({
                    question: questions[currentQuestion].question,
                    options: questions[currentQuestion].options,
                    selected: null,
                    correct: questions[currentQuestion].answer,
                    isCorrect: false
                });

                const optionButtons = document.querySelectorAll("#optionsContainer button");
                optionButtons.forEach(btn => btn.disabled = true);

                setTimeout(() => {
                    currentQuestion++;
                    displayQuestion();
                }, 800);
            }
        }
    }, 1000);
}

// Next question
function nextQuestion() {
    if (questionLocked) return;

    if (selectedAnswer === null) {
        alert("Please select an answer first!");
        return;
    }

    currentQuestion++;
    displayQuestion();
}

// Progress bar
function updateProgress() {
    const progress = (currentQuestion / questions.length) * 100;

    document.getElementById("progressBar").style.width = progress + "%";
}

// Show result
function showResults() {
    clearInterval(timerInterval);
    showSection("resultSection");

    const percentage = Math.round((score / questions.length) * 100);
    const wrong = answers.filter(a => a.selected !== null && !a.isCorrect).length;
    const unanswered = answers.filter(a => a.selected === null).length;

    document.getElementById("finalScore").textContent =
        `${playerName}, your score is ${score} / ${questions.length} (${percentage}%)`;

    document.getElementById("correctCount").textContent = score;
    document.getElementById("wrongCount").textContent = wrong;
    document.getElementById("unansweredCount").textContent = unanswered;

    let message = "";

    if (percentage === 100) {
        message = "🌟 Perfect score! Excellent work!";
    } else if (percentage >= 80) {
        message = "🎉 Excellent performance!";
    } else if (percentage >= 60) {
        message = "👏 Good job! Keep practicing!";
    } else if (percentage >= 40) {
        message = "💪 Keep learning. You can improve!";
    } else {
        message = "📚 Practice more and try again!";
    }

    document.getElementById("performanceMessage").textContent = message;

    showReview();

    saveQuizHistory(percentage);
}

// Answer review
function showReview() {
    const reviewSection = document.getElementById("reviewSection");
    reviewSection.innerHTML = "";

    answers.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "review-card";

        const yourAnswer = item.selected === null
            ? "Not answered"
            : item.options[item.selected];

        const correctAnswer = item.options[item.correct];

        div.innerHTML = `
            <h3>Question ${index + 1}: ${item.question}</h3>
            <p>Your answer: ${yourAnswer}</p>
            <p>Correct answer: ${correctAnswer}</p>
            <p>${item.isCorrect ? "✅ Correct" : "❌ Incorrect"}</p>
        `;

        reviewSection.appendChild(div);
    });
}

// Save quiz history
function saveQuizHistory(percentage) {
    let history = JSON.parse(localStorage.getItem("quizHistory")) || [];

    history.push({
        name: playerName,
        category: categoryName,
        difficulty: difficultyName,
        score: score,
        total: questions.length,
        percentage: percentage,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("quizHistory", JSON.stringify(history));

    updateLeaderboard(percentage);
}

// Leaderboard
function updateLeaderboard(percentage) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.push({
        name: playerName,
        score: score,
        total: questions.length,
        percentage: percentage,
        category: categoryName
    });

    leaderboard.sort((a, b) => b.percentage - a.percentage);

    leaderboard = leaderboard.slice(0, 10);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Display leaderboard
function showLeaderboard() {
    showSection("leaderboardSection");

    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const list = document.getElementById("leaderboardList");

    list.innerHTML = "";

    if (leaderboard.length === 0) {
        list.innerHTML = "<p>No quiz scores yet. Play a quiz first!</p>";
        return;
    }

    leaderboard.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "review-card";

        div.innerHTML = `
            <h3>${index + 1}. ${item.name}</h3>
            <p>Score: ${item.score}/${item.total}</p>
            <p>Percentage: ${item.percentage}%</p>
            <p>Category: ${item.category}</p>
        `;

        list.appendChild(div);
    });
}

// Dashboard
function showDashboard() {
    showSection("dashboardSection");

    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

    document.getElementById("totalQuizzes").textContent = history.length;

    if (history.length === 0) {
        document.getElementById("averageScore").textContent = "0%";
        document.getElementById("bestScore").textContent = "0%";
        document.getElementById("chartContainer").innerHTML = "<p>No quiz data yet.</p>";
        document.getElementById("historyList").innerHTML = "<p>Play your first quiz to see history!</p>";
        return;
    }

    const average = Math.round(
        history.reduce((sum, item) => sum + item.percentage, 0) / history.length
    );

    const best = Math.max(...history.map(item => item.percentage));

    document.getElementById("averageScore").textContent = average + "%";
    document.getElementById("bestScore").textContent = best + "%";

    // Performance chart
    const chart = document.getElementById("chartContainer");
    chart.innerHTML = "";

    history.slice(-10).forEach((item, index) => {
        const bar = document.createElement("div");

        bar.style.cssText = `
            margin: 12px 0;
            padding: 10px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: ${Math.max(item.percentage, 5)}%;
            min-width: 120px;
            color: white;
            border-radius: 8px;
        `;

        bar.textContent = `Quiz ${index + 1}: ${item.percentage}%`;
        chart.appendChild(bar);
    });

    // Quiz history
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    [...history].reverse().forEach(item => {
        const div = document.createElement("div");
        div.className = "review-card";

        div.innerHTML = `
            <h3>${item.name} - ${item.category}</h3>
            <p>Score: ${item.score}/${item.total} (${item.percentage}%)</p>
            <p>Difficulty: ${item.difficulty}</p>
            <p>Date: ${item.date}</p>
        `;

        historyList.appendChild(div);
    });
}

// Play again
function playAgain() {
    clearInterval(timerInterval);
    showSection("homeSection");
}

// Home
function goHome() {
    clearInterval(timerInterval);
    showSection("homeSection");
}

// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
