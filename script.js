
const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");
const turnIcon = document.getElementById("turn-icon");
const turnCaption = document.getElementById("turn-caption");
const turnBanner = document.getElementById("turn-banner");
const turnIndicator = document.querySelector(".turn-indicator");

const roundNumber = document.getElementById("round-number");

const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const scoreDraw = document.getElementById("score-draw");

const restartButton = document.getElementById("restart");
const resetScoreButton = document.getElementById("reset-score");

const winningCombinations = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6]
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let round = 1;

let scores = {
    X: 0,
    O: 0,
    draw: 0
};

// Update the current player's information
function updateTurn() {
    turnIcon.textContent = currentPlayer;

    turnIcon.style.color =
        currentPlayer === "X" ? "#9a8cff" : "#ff83b5";

    turnIcon.style.background =
        currentPlayer === "X" ? "#9a8cff17" : "#ff83b517";

    turnCaption.textContent = "YOUR MOVE";
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    turnBanner.style.borderColor =
        currentPlayer === "X" ? "#9a8cff20" : "#ff83b520";

    turnBanner.style.background =
        currentPlayer === "X" ? "#9a8cff0b" : "#ff83b508";

    turnIndicator.style.color =
        currentPlayer === "X" ? "#9a8cff" : "#ff83b5";
}

// Find a winning combination
function checkWinner() {
    return winningCombinations.find(combination => {
        const [a, b, c] = combination;

        return (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        );
    });
}

// Handle cell clicks
function handleCellClick(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    // Do not allow moves after a match ends
    if (!gameActive || board[index] !== "") {
        return;
    }

    // Place the current player's mark
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.disabled = true;

    cell.classList.add(
        currentPlayer === "X" ? "mark-x" : "mark-o"
    );

    // Check for a winner
    const winningLine = checkWinner();

    if (winningLine) {
        finishGame(currentPlayer, winningLine);
        return;
    }

    // Check for a draw
    if (board.every(value => value !== "")) {
        finishDraw();
        return;
    }

    // Switch between X and O
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurn();
}

// Finish the game when a player wins
function finishGame(winner, winningLine) {
    gameActive = false;
    scores[winner]++;

    winningLine.forEach(index => {
        cells[index].classList.add("winner");
    });

    cells.forEach(cell => {
        cell.disabled = true;
    });

    statusText.textContent = `Player ${winner} wins!`;
    turnCaption.textContent = "MATCH COMPLETE";
    turnIcon.textContent = "★";
    turnIcon.style.color = "#66dfb0";
    turnIcon.style.background = "#66dfb018";

    turnBanner.style.background = "#66dfb00b";
    turnBanner.style.borderColor = "#66dfb044";
    turnIndicator.style.color = "#66dfb0";

    updateScores();
}

// Finish the game when all cells are filled
function finishDraw() {
    gameActive = false;
    scores.draw++;

    statusText.textContent = "It's a draw!";
    turnCaption.textContent = "MATCH COMPLETE";
    turnIcon.textContent = "=";
    turnIcon.style.color = "#b7b8cd";
    turnIcon.style.background = "#ffffff0a";

    turnBanner.style.background = "#ffffff05";
    turnBanner.style.borderColor = "#ffffff18";
    turnIndicator.style.color = "#b7b8cd";

    cells.forEach(cell => {
        cell.disabled = true;
    });

    updateScores();
}

// Update scoreboard
function updateScores() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreDraw.textContent = scores.draw;
}

// Start a new round without clearing scores
function restartGame() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;

    round++;
    roundNumber.textContent = String(round).padStart(2, "0");

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
        cell.classList.remove("mark-x", "mark-o", "winner");
    });

    updateTurn();
}

// Reset scores and start again
function resetScore() {
    scores = {
        X: 0,
        O: 0,
        draw: 0
    };

    round = 0;
    updateScores();
    restartGame();
}

// Register event listeners
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

restartButton.addEventListener("click", restartGame);
resetScoreButton.addEventListener("click", resetScore);

// Initial setup
updateTurn();
updateScores();
