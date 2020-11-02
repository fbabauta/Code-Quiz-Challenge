// Pull elements you need from HTML- save to variables
var timerEl = document.getElementById("timer");
var headerEl = document.getElementById("header");
var introCardEl = document.getElementById("intro-card");
var finalScoreEl = document.getElementById("final-score");
var finishedCardEl = document.getElementById("finished-card");
var highscoreCardEl = document.getElementById("highscores-card");
var submitScoreEl = document.getElementById("submit-high-score");
var viewHighscoreEl = document.getElementById("view-highscore");
var goBackEl = document.getElementById("go-back-btn");
var clearScoresEl = document.getElementById("clear-scores-btn");
var initialsInputEl = document.getElementById("initials-input");

// Define global variables
var timer;
var secondsLeft;
var finalScore;
var highscoreArr = [];
var initials;

// Function constructor for Question object
function Question(ask, answers, corrAns) {
    this.ask = ask;
    this.answers = answers;
    this.corrAns = corrAns;
};

// Instances of Question object (quiz questions)
var q1 = new Question(
    "An element that is postitioned relative to it's nearest positioned ancestor has been assigned _______ positioning.",
    ["Static", "Relative", "Absolute", "Fixed"],
    "Absolute"
);

var q2 = new Question(
    "Which display property value allows you to hide an element from view?",
    ["Block", "None", "In-line Block", "Inline"],
    "None"
);

var q3 = new Question(
    "What types of data can be held in an array?",
    ["Strings and numbers", "Objects", "Other Arrays", "All the Above"],
    "All the Above"
);

var q4 = new Question(
    "Which is an example of an event handler?",
    ['"click"', '"keydown"', "A function that is called when an event occurs", "Both A and B"],
    "A function that is called when an event occurs"
);

var q5 = new Question(
    "Which method stops an event from bubbling up to it's parent elements?",
    ["event.stopPropagation();", "event.preventDefault();", "event.bubbleEvent();", "event.addEventListener();"],
    "event.stopPropagation();"
);

// Save questions to an array
var qArr = [q1, q2, q3, q4, q5];

// Function for displaying intro screen
function displayIntro() {
    introCardEl.classList.remove("display-none");
    finishedCardEl.classList.add("display-none");
    highscoreCardEl.classList.add("display-none");
    headerEl.classList.remove("display-none");
    rmvQuizCardEl();
};

// Function for displaying quiz screen
function displayQuiz() {
    introCardEl.classList.add("display-none");
    finishedCardEl.classList.add("display-none");
    highscoreCardEl.classList.add("display-none");
    headerEl.classList.remove("display-none");
};

// Function for displaying screen when quiz is finished
function displayFinished() {
    headerEl.classList.remove("display-none");
    introCardEl.classList.add("display-none");
    finishedCardEl.classList.remove("display-none");
    highscoreCardEl.classList.add("display-none");
    rmvQuizCardEl();
};

// Function for displaying high scores screen
function displayHighscores() {
    headerEl.classList.add("display-none");
    introCardEl.classList.add("display-none");
    finishedCardEl.classList.add("display-none");
    highscoreCardEl.classList.remove("display-none");
    rmvQuizCardEl();
};

// Function for creating new question card element
function addElement() {
    var questionCardEl = document.createElement("div");
    questionCardEl.innerHTML = '<div class="card text-left col-12 col-sm-10 col-md-9 col-lg-6" id = "quiz-card"><div><h2 class="card-title" id="question">Question will go here.</h2><ul><li><button class="btn" id="ans1">A: Answer 1</button></li><li><button class="btn" id="ans2">B: Answer 2</button></li><li><button class="btn" id="ans3">C: Answer 3</button></li><li><button class="btn" id="ans4">D: Answer 4</button></li></ul><div><p><span id="correct-or-not"></span></p></div></div></div>'
    document.body.appendChild(questionCardEl);
};

// Function for displaying each question and checking answers
function askQuestion(question) {
    // add quiz card element
    addElement();

    // render questions
    document.getElementById("question").textContent = question.ask;
    for (var i = 0; i < question.answers.length; i++) {
        document.getElementById("ans" + (i + 1)).textContent = question.answers[i];
    }
    // check if answer is correct
    checkCorrect(question);
};


// Function for checking if answer is correct
function checkCorrect(question) {
    var quizCardEl = document.getElementById("quiz-card");
    var displayCorrEl = document.getElementById("correct-or-not");

    // when quiz card is clicked
    quizCardEl.addEventListener("click", function (event) {
        event.preventDefault();

        // if it was a button element that was clicked
        if (event.target.matches("button")) {

            // checks if answer is correct
            if (event.target.textContent === question.corrAns) {
                displayCorrEl.innerHTML = "<hr>Correct!";

                // if correct move on to next question
                nextQuestion(question);
            } else {
                displayCorrEl.innerHTML = "<hr>Wrong!";

                // if incorrect minus ten seconds
                if ((secondsLeft - 10) < 10) {
                    secondsLeft = 1;
                } else {
                    secondsLeft = secondsLeft - 10;
                }
            }
        }
    });
};

// Function for checking if there are more quesiton- if yes ask next question, if no end quiz
function nextQuestion(question) {
    setTimeout(function () {
        // remove quiz card element
        rmvQuizCardEl();

        // if there are more questions left render next question, else finsih quiz
        if ((qArr.indexOf(question) + 1) < qArr.length) {
            askQuestion(qArr[qArr.indexOf(question) + 1]);
        } else {
            finishQuiz();
        }
    }, 500)
};

// function for removing question card element if it exists
function rmvQuizCardEl() {
    var questionCardEl = document.getElementById("quiz-card");
    if (questionCardEl !== null) {
        questionCardEl.remove();
    };
};

// Function that gets called when the quiz is finished- saves final score, displays finished page, stops timer
function finishQuiz() {
    displayFinished();
    clearInterval(timer);
    finalScoreEl.textContent = secondsLeft;
    finalScore = secondsLeft;
};

// Function that navigates to and resets intro page- resets seconds, clears any existing timers
function navBeginning() {
    secondsLeft = 75;
    timerEl.textContent = secondsLeft;
    clearInterval(timer);
    displayIntro();
};

// Create a timer function
function startTimer() {
    clearInterval(timer);
    console.log("timer has started")
    timer = setInterval(function () {
        secondsLeft--;

        // update timerEl every second as timer counds down
        timerEl.textContent = secondsLeft;

        // when timer reaches zero stop timer and call finish function
        if (secondsLeft <= 0) {
            clearInterval(timer);
            finishQuiz();
        }
    }, 1000);
};

// Function that adds user score to high score list
function addNewHighscore() {
    // gets initials from user input
    initials = initialsInputEl.value;

    // checks to make sure input is not blank
    if (initials.trim() !== "") {

        // push to highscoreArr, create new element, display in DOM
        var li = document.createElement("li");
        highscoreArr.push({ initials, finalScore });
        li.textContent = initials + " - " + finalScore;
        document.getElementById("highscore-list").appendChild(li);
    }
    // pushes new score to local storage
    setLocalStorage();
};

// Function that sets local storage
function setLocalStorage() {
    var JSONhighscores = JSON.stringify(highscoreArr);
    localStorage.setItem("highscores", JSONhighscores);
};

// Ititialize function - pulls from local storage, renders high scores, opens intro page
function init() {
    var scores = localStorage.getItem("highscores");
    var JSONscores = JSON.parse(scores);

    // only pulls if there are scores to pull
    if (JSONscores !== null) {
        highscoreArr = JSONscores;
        renderHighscores();
    }
    navBeginning();
};

// Function that renders high scores from local storage
function renderHighscores() {
    for (var i = 0; i < highscoreArr.length; i++) {
        // creates new element
        var li = document.createElement("li");

        // pulls properties from parse highscoreArr- appends them to list
        var name = highscoreArr[i].initials;
        var score = highscoreArr[i].finalScore;
        li.textContent = name + " - " + score;
        document.getElementById("highscore-list").appendChild(li);
    }
};

// Add event litsener to start quiz button on intro page
document.getElementById("start-btn").addEventListener("click", function(event) {
    event.preventDefault();
    displayQuiz();
    startTimer();
    askQuestion(q1);
});

// Add event listener to submit score button on quiz finished page
submitScoreEl.addEventListener("click", function(event) {
    event.preventDefault();
    addNewHighscore();
    displayHighscores();
});

// Add event listener to go back button on high score page
goBackEl.addEventListener("click", function(event) {
    event.preventDefault();

    // navigate to intro page
    navBeginning();
});

// Add event listener to clear high scores button on high score page
clearScoresEl.addEventListener("click", function(event) {
    event.preventDefault();

    // clear scores array, update local storage, clear highscores list
    highscoreArr = [];
    setLocalStorage();
    document.getElementById("highscore-list").innerHTML = "";
});

// Add event listener for "view highscore" link
viewHighscoreEl.addEventListener("click", function(event) {
    event.preventDefault();
    displayHighscores();
});

// calls initialze function to start program
init();