
document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start");
    const difficultySelection = document.querySelector(".difficulty-selection");
    const container = document.querySelector(".container");
    const difficultyButtons = document.querySelectorAll(".difficulty");
    let gameSpeed = 100;

    startButton.addEventListener("click", () => {
        difficultySelection.style.display = "flex";
        startButton.parentElement.style.display = "none";
    });

    difficultyButtons.forEach(button => {
        button.addEventListener("click", () => {
            gameSpeed = parseInt(button.getAttribute("data-speed"));
            difficultySelection.style.display = "none";
            container.style.display = "flex";
            startGame(gameSpeed);
        });
    });
});

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 10, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press Ok to restart.");
    location.reload();
}

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY === 0) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY === 0) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX === 0) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX === 0) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(button => {
    button.addEventListener("click", () => changeDirection({ key: button.dataset.key }));
});

const startGame = (speed) => {
    changeFoodPosition();
    setIntervalId = setInterval(initGame, speed);
}

const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    snakeBody.forEach((segment, index) => {
        htmlMarkup += `<div class="head" style="grid-area: ${segment[1]} / ${segment[0]}"></div>`;
        if (index !== 0 && segment[0] === snakeX && segment[1] === snakeY) {
            gameOver = true;
        }
    });

    playBoard.innerHTML = htmlMarkup;
}

document.addEventListener("keydown", changeDirection);