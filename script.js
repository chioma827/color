const colors = [  
    "red", "blue", "green", "yellow",  
    "purple", "orange", "pink", "cyan",   
    "magenta", "lime", "teal", "navy",   
    "gold", "salmon", "coral", "violet",   
    "indigo", "lavender", "brown", "beige"  
];  

let chosenColor;  
let score = 0;  
let timeLeft = 30;  
let timerInterval;  
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];  

// DOM Elements  
const colorDisplay = document.getElementById("colorDisplay");  
const colorInput = document.getElementById("colorInput");  
const guessButton = document.getElementById("guessButton");  
const resultDisplay = document.getElementById("result");  
const resetButton = document.getElementById("resetButton");  
const scoreDisplay = document.getElementById("score");  
const timerDisplay = document.getElementById("timeLeft");  
const leaderboardDisplay = document.getElementById("leaderboard");  
const difficultySelect = document.getElementById("difficulty");  
const themeSelect = document.getElementById("theme");  
const playerNameInput = document.getElementById("playerName");  

function applyTheme(theme) {  
    document.body.className = theme;  
}  

function selectColor() {  
    const difficulty = difficultySelect.value;  
    let availableColors = colors;  

    if (difficulty === "easy") {  
        availableColors = colors.slice(0, 5); // 5 colors  
    } else if (difficulty === "medium") {  
        availableColors = colors.slice(0, 10); // 10 colors  
    } // hard mode uses all colors  

    chosenColor = availableColors[Math.floor(Math.random() * availableColors.length)];  
    colorDisplay.style.backgroundColor = chosenColor;  
}  

function startTimer() {  
    timeLeft = 30;  
    timerDisplay.textContent = timeLeft;  

    timerInterval = setInterval(() => {  
        timeLeft--;  
        timerDisplay.textContent = timeLeft;  

        if (timeLeft <= 0) {  
            clearInterval(timerInterval);  
            resultDisplay.textContent = "Time's up! You lost!";  
            disableGame();  
        }  
    }, 1000);  
}  

function disableGame() {  
    guessButton.disabled = true;  
    colorInput.disabled = true;  
}  

function enableGame() {  
    guessButton.disabled = false;  
    colorInput.disabled = false;  
}  

function checkGuess() {  
    const userGuess = colorInput.value.toLowerCase();  
  
    if (userGuess === chosenColor) {  
        resultDisplay.textContent = "Congratulations! You guessed it right!";  
        score += 1; // Increase score  
        scoreDisplay.textContent = `Score: ${score}`;  
        colorDisplay.classList.add("animate"); // Add animation  

        // Reset animations after playing  
        setTimeout(() => {  
            colorDisplay.classList.remove("animate");  
            selectColor(); // Select a new color after a short delay  
            startTimer(); // Restart timer for the next round  
        }, 1000);  
    } else {  
        resultDisplay.textContent = `Try again! Hint: It's a ${getColorHint(chosenColor)} color.`;  
    }  
}  

function getColorHint(color) {  
    const hints = {  
        red: "warm",  
        blue: "cool",  
        green: "natural",  
        yellow: "bright",  
        purple: "royal",  
        orange: "vibrant",  
        pink: "soft",  
        cyan: "aqua",  
        magenta: "bold",  
        lime: "fresh",  
        teal: "calm",  
        navy: "deep",  
        gold: "luxurious",  
        salmon: "peachy",  
        coral: "reddish-orange",  
        violet: "graceful",  
        indigo: "dusk",  
        lavender: "floral",  
        brown: "earthy",  
        beige: "neutral"  
    };  
    return hints[color] || "colorful";  
}  

function resetGame() {  
    colorInput.value = '';  
    resultDisplay.textContent = '';  
    enableGame();  
    selectColor();  
    startTimer();  
}  

function updateLeaderboard() {  
    const playerName = playerNameInput.value.trim();  
    if (!playerName) {  
        alert("Please enter your name for the leaderboard.");  
        return;  
    }  

    leaderboard.push({ name: playerName, score: score });  
    leaderboard.sort((a, b) => b.score - a.score); // Sort scores in descending order  
    leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores  
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard)); // Store in localStorage  
    displayLeaderboard();  
}  

function displayLeaderboard() {  
    leaderboardDisplay.innerHTML = ''; // Clear current leaderboard  
    leaderboard.forEach((entry, index) => {  
        const li = document.createElement('li');  
        li.textContent = `#${index + 1}: ${entry.name} - ${entry.score}`;  
        leaderboardDisplay.appendChild(li);  
    });  
}  

// Event Listeners  
guessButton.addEventListener("click", checkGuess);  
resetButton.addEventListener("click", () => {  
    updateLeaderboard();  
    resetGame();  
});  
themeSelect.addEventListener("change", (e) => applyTheme(e.target.value));  

// Retrieve and apply saved theme on page load  
document.addEventListener("DOMContentLoaded", () => {  
    const savedTheme = themeSelect.value;  
    applyTheme(savedTheme);  
    displayLeaderboard(); // Display leaderboard on page load  
});  

// Start the game  
selectColor();  
startTimer();  