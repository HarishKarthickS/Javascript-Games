document.addEventListener('DOMContentLoaded', () => {
  const cardArray = [
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' },
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' }
  ];

  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  const timerDisplay = document.querySelector('#timer');
  const restartButton = document.querySelector('#restart');
  const difficultySelect = document.querySelector('#difficulty');
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  let time = 0;
  let timer;
  let bestTime = localStorage.getItem('bestTime') || Infinity;

  const matchSound = new Audio('sounds/match.mp3');
  const wrongSound = new Audio('sounds/wrong.mp3');

  function startTimer() {
    timer = setInterval(() => {
      time++;
      timerDisplay.textContent = time;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
    if (time < bestTime) {
      bestTime = time;
      localStorage.setItem('bestTime', bestTime);
      alert(`New best time: ${bestTime}s`);
    }
  }

  function createBoard(difficulty) {
    grid.innerHTML = '';
    let numCards;
    switch (difficulty) {
      case 'easy':
        numCards = 4;
        break;
      case 'medium':
        numCards = 5;
        break;
      case 'hard':
        numCards = 6;
        break;
      default:
        numCards = 4;
    }

    let selectedCards = cardArray.slice(0, numCards).concat(cardArray.slice(0, numCards));
    selectedCards.sort(() => 0.5 - Math.random());

    selectedCards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.setAttribute('data-id', index);
      cardElement.innerHTML = `
        <div class="front"></div>
        <div class="back"><img src="${card.img}" alt="${card.name}"></div>
      `;
      cardElement.addEventListener('click', () => flipCard(index, selectedCards));
      grid.appendChild(cardElement);
    });

    resultDisplay.textContent = 0;
    cardsWon = [];
    cardsChosen = [];
    cardsChosenId = [];
    time = 0;
    timerDisplay.textContent = time;
    startTimer();
  }

  function flipCard(index, selectedCards) {
    const cardElements = document.querySelectorAll('.card');
    const clickedCard = cardElements[index];

    if (cardsChosenId.length < 2 && !clickedCard.classList.contains('flipped')) {
      clickedCard.classList.add('flipped');
      cardsChosen.push(selectedCards[index].name);
      cardsChosenId.push(index);

      if (cardsChosen.length === 2) {
        setTimeout(() => checkForMatch(selectedCards), 500);
      }
    }
  }

  function checkForMatch(selectedCards) {
    const cardElements = document.querySelectorAll('.card');
    const [optionOneId, optionTwoId] = cardsChosenId;

    if (optionOneId === optionTwoId) {
      cardElements[optionOneId].classList.remove('flipped');
      alert('You clicked the same card!');
    } else if (cardsChosen[0] === selectedCards[optionTwoId].name) {
      alert('You found a match!');
      cardsWon.push(cardsChosen);
      matchSound.play();

      cardElements[optionOneId].style.pointerEvents = 'none';
      cardElements[optionTwoId].style.pointerEvents = 'none';
    } else {
      setTimeout(() => {
        cardElements[optionOneId].classList.remove('flipped');
        cardElements[optionTwoId].classList.remove('flipped');
        alert('Sorry, try again!');
        wrongSound.play();
      }, 500);
    }

    cardsChosen = [];
    cardsChosenId = [];
    resultDisplay.textContent = cardsWon.length;

    if (cardsWon.length === selectedCards.length / 2) {
      stopTimer();
      resultDisplay.textContent = `Congratulations! You found them all in ${time}s! Best time: ${bestTime}s`;
    }
  }

  restartButton.addEventListener('click', () => {
    createBoard(difficultySelect.value);
  });

  difficultySelect.addEventListener('change', () => {
    createBoard(difficultySelect.value);
  });

  createBoard(difficultySelect.value);
});
