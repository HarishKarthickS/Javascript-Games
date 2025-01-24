const squares = document.querySelectorAll('.square');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');
const restartButton = document.querySelector('#restart');
const levelDisplay = document.querySelector('#level');

let result = 0;
let hitPosition = null;
let currentTime = 60;
let timerId = null;
let countDownTimerId = null;
let moleSpeed = 800;
let level = 1;

const hitSound = new Audio('path-to-hit-sound.mp3');
const missSound = new Audio('path-to-miss-sound.mp3');

// Function to choose a random square
function randomSquare() {
  squares.forEach(square => square.classList.remove('mole', 'bonus-mole', 'hit'));
  const randomSquare = squares[Math.floor(Math.random() * squares.length)];
  const isBonus = Math.random() > 0.8; // 20% chance for a bonus mole
  randomSquare.classList.add(isBonus ? 'bonus-mole' : 'mole');
  hitPosition = randomSquare.id;
}

// Add event listeners to squares for clicks
squares.forEach(square => {
  square.addEventListener('mousedown', () => {
    if (square.id === hitPosition) {
      if (square.classList.contains('bonus-mole')) {
        result += 5; // Bonus points
      } else {
        result++;
      }
      hitSound.play();
      square.classList.add('hit');
      score.textContent = result;
      hitPosition = null;
      updateLevel();
    } else {
      missSound.play();
    }
  });
});

// Move the mole at an interval
function moveMole() {
  clearInterval(timerId);
  const randomSpeed = Math.random() * (1200 - 400) + 400; // Random interval between 400ms and 1200ms
  timerId = setInterval(randomSquare, randomSpeed);
}

// Countdown timer
function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(countDownTimerId);
    clearInterval(timerId);
    alert(`GAME OVER! Your final score is ${result}`);
  }
}

// Update level
function updateLevel() {
  if (result % 10 === 0 && result > 0) { // Every 10 points, increase level
    level++;
    levelDisplay.textContent = level;
    moleSpeed = Math.max(300, moleSpeed - 50); // Increase speed with a limit
    moveMole();
    alert(`Level Up! Welcome to Level ${level}`);
  }
}

// Restart the game
function restartGame() {
  clearInterval(timerId);
  clearInterval(countDownTimerId);
  result = 0;
  currentTime = 60;
  moleSpeed = 800;
  level = 1;
  score.textContent = result;
  timeLeft.textContent = currentTime;
  levelDisplay.textContent = level;
  moveMole();
  countDownTimerId = setInterval(countDown, 1000);
}

// Initialize game
moveMole();
countDownTimerId = setInterval(countDown, 1000);
restartButton.addEventListener('click', restartGame);
