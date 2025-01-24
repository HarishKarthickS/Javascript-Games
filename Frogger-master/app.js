const timeLeftDisplay = document.querySelector('#time-left');
const livesDisplay = document.querySelector('#lives');
const scoreDisplay = document.querySelector('#score');
const resultDisplay = document.querySelector('#result');
const startPauseButton = document.querySelector('#start-pause-button');
const themeSelector = document.querySelector('#theme-selector');
const grid = document.querySelector('.grid');

const backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true;

const jumpSound = new Audio('jump.mp3');
const collisionSound = new Audio('collision.mp3');
const winSound = new Audio('win.mp3');
const loseSound = new Audio('lose.mp3');

// Populate grid
for (let i = 0; i < 81; i++) {
    const div = document.createElement('div');
    grid.appendChild(div);
}

let currentIndex = 76; // Starting position
const squares = document.querySelectorAll('.grid div');
const width = 9;
let timerId;
let outcomeTimerId;
let currentTime = 20;
let lives = 3;
let score = 0;
let level = 1;

squares[4].classList.add('ending-block');
squares[76].classList.add('starting-block', 'frog');

for (let i = 18; i < 27; i++) squares[i].classList.add('log-left');
for (let i = 27; i < 36; i++) squares[i].classList.add('log-right');
for (let i = 45; i < 48; i++) squares[i].classList.add('car-left');
for (let i = 54; i < 57; i++) squares[i].classList.add('car-right');

function moveFrog(e) {
    squares[currentIndex].classList.remove('frog');
    switch (e.key) {
        case 'ArrowLeft':
            if (currentIndex % width !== 0) currentIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentIndex % width < width - 1) currentIndex += 1;
            break;
        case 'ArrowUp':
            if (currentIndex - width >= 0) currentIndex -= width;
            break;
        case 'ArrowDown':
            if (currentIndex + width < width * width) currentIndex += width;
            break;
    }
    squares[currentIndex].classList.add('frog');
    jumpSound.play();
}

function moveElements() {
    currentTime--;
    timeLeftDisplay.textContent = currentTime;
    moveLogs();
    moveCars();
    if (currentTime === 0) loseLife();
}

function moveLogs() {
    squares.forEach((square, i) => {
        if (square.classList.contains('log-left')) {
            square.classList.remove('log-left');
            squares[(i + 1) % 81].classList.add('log-left');
        }
        if (square.classList.contains('log-right')) {
            square.classList.remove('log-right');
            squares[(i - 1 + 81) % 81].classList.add('log-right');
        }
    });
}

function moveCars() {
    squares.forEach((square, i) => {
        if (square.classList.contains('car-left')) {
            square.classList.remove('car-left');
            squares[(i + 1) % 81].classList.add('car-left');
        }
        if (square.classList.contains('car-right')) {
            square.classList.remove('car-right');
            squares[(i - 1 + 81) % 81].classList.add('car-right');
        }
    });
}

function checkOutcomes() {
    if (squares[currentIndex].classList.contains('car-left') ||
        squares[currentIndex].classList.contains('car-right') ||
        currentTime <= 0) {
        loseLife();
    }

    if (squares[currentIndex].classList.contains('ending-block')) {
        winGame();
    }
}

function loseLife() {
    lives--;
    livesDisplay.textContent = lives;
    collisionSound.play();
    resetGame();
    if (lives === 0) endGame('Game Over!');
}

function winGame() {
    score += 10;
    scoreDisplay.textContent = score;
    winSound.play();
    level++;
    currentTime += 10;
    resetGame();
}

function resetGame() {
    squares[currentIndex].classList.remove('frog');
    currentIndex = 76;
    squares[currentIndex].classList.add('frog');
}

function endGame(message) {
    resultDisplay.textContent = message;
    clearInterval(timerId);
    clearInterval(outcomeTimerId);
    document.removeEventListener('keyup', moveFrog);
    backgroundMusic.pause();
}

startPauseButton.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        clearInterval(outcomeTimerId);
        document.removeEventListener('keyup', moveFrog);
        backgroundMusic.pause();
        timerId = null;
    } else {
        timerId = setInterval(moveElements, 1000);
        outcomeTimerId = setInterval(checkOutcomes, 50);
        document.addEventListener('keyup', moveFrog);
        backgroundMusic.play();
    }
});

themeSelector.addEventListener('change', (e) => {
    document.body.className = `theme-${e.target.value}`;
});
