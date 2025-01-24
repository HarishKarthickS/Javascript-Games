const computerChoiceDisplay = document.getElementById('computer-choice');
const userChoiceDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('result');
const possibleChoices = document.querySelectorAll('button');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');
const drawsDisplay = document.getElementById('draws');

let userChoice;
let computerChoice;
let result;
let playerScore = 0;
let computerScore = 0;
let wins = 0;
let losses = 0;
let draws = 0;

possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', (e) => {
  if (e.target.id !== 'reset') {
    e.target.disabled = true; // Disable button during animation
    setTimeout(() => {
      e.target.disabled = false; // Re-enable button after animation
    }, 500); // Match the animation duration

    userChoice = e.target.id;
    userChoiceDisplay.innerHTML = userChoice;
    generateComputerChoice();
    getResult();
    updateScore();
    updateStats();
    highlightWinner();
  }
}));

document.getElementById('reset').addEventListener('click', resetGame);

function generateComputerChoice() {
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  if (randomNumber === 1) {
    computerChoice = 'rock';
  }
  if (randomNumber === 2) {
    computerChoice = 'scissors';
  }
  if (randomNumber === 3) {
    computerChoice = 'paper';
  }
  computerChoiceDisplay.innerHTML = computerChoice;
}

function getResult() {
  if (computerChoice === userChoice) {
    result = `It's a draw! Both chose ${userChoice}.`;
    draws++;
    playSound('draw.mp3');
  } else if ((computerChoice === 'rock' && userChoice === 'paper') ||
             (computerChoice === 'paper' && userChoice === 'scissors') ||
             (computerChoice === 'scissors' && userChoice === 'rock')) {
    result = `You win! ${userChoice} beats ${computerChoice}.`;
    playerScore++;
    wins++;
    playSound('win.mp3');
  } else {
    result = `You lose! ${computerChoice} beats ${userChoice}.`;
    computerScore++;
    losses++;
    playSound('lose.mp3');
  }
  resultDisplay.innerHTML = result;
}

function updateScore() {
  document.getElementById('player-score').innerText = `Player Score: ${playerScore}`;
  document.getElementById('computer-score').innerText = `Computer Score: ${computerScore}`;
}

function updateStats() {
  winsDisplay.innerText = wins;
  lossesDisplay.innerText = losses;
  drawsDisplay.innerText = draws;
}

function highlightWinner() {
  const userButton = document.getElementById(userChoice);
  const computerButton = document.getElementById(computerChoice);

  if (userButton && computerButton) {
    userButton.style.backgroundColor = result.includes('win') ? 'green' : 'red';
    computerButton.style.backgroundColor = result.includes('win') ? 'red' : 'green';
  }
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  wins = 0;
  losses = 0;
  draws = 0;
  updateScore();
  updateStats();
  resultDisplay.innerHTML = '';
  computerChoiceDisplay.innerHTML = '';
  userChoiceDisplay.innerHTML = '';
  document.querySelectorAll('button').forEach(button => {
    button.style.backgroundColor = '';
    button.classList.remove('active', 'loser');
  });
}

function playSound(sound) {
  try {
    const audio = new Audio(sound);
    audio.play().catch(() => console.log("Audio playback failed."));
  } catch (error) {
    console.log("Error playing sound:", error);
  }
}