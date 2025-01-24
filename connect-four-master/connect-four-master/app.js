document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const result = document.querySelector('#result');
  const displayCurrentPlayer = document.querySelector('#current-player');
  const resetButton = document.querySelector('#reset');
  const toggleAIButton = document.querySelector('#toggle-ai');
  
  let currentPlayer = 1;
  let gameOver = false;
  let isAI = false;
  let timer;

  // Create the grid
  for (let i = 0; i < 42; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    grid.appendChild(cell);
  }

  const squares = document.querySelectorAll('.grid div');

  const winningArrays = [
    // Horizontal
    [0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6],
    [7, 8, 9, 10], [8, 9, 10, 11], [9, 10, 11, 12], [10, 11, 12, 13],
    [14, 15, 16, 17], [15, 16, 17, 18], [16, 17, 18, 19], [17, 18, 19, 20],
    [21, 22, 23, 24], [22, 23, 24, 25], [23, 24, 25, 26], [24, 25, 26, 27],
    [28, 29, 30, 31], [29, 30, 31, 32], [30, 31, 32, 33], [31, 32, 33, 34],
    [35, 36, 37, 38], [36, 37, 38, 39], [37, 38, 39, 40], [38, 39, 40, 41],
    // Vertical
    [0, 7, 14, 21], [7, 14, 21, 28], [14, 21, 28, 35],
    [1, 8, 15, 22], [8, 15, 22, 29], [15, 22, 29, 36],
    [2, 9, 16, 23], [9, 16, 23, 30], [16, 23, 30, 37],
    [3, 10, 17, 24], [10, 17, 24, 31], [17, 24, 31, 38],
    [4, 11, 18, 25], [11, 18, 25, 32], [18, 25, 32, 39],
    [5, 12, 19, 26], [12, 19, 26, 33], [19, 26, 33, 40],
    [6, 13, 20, 27], [13, 20, 27, 34], [20, 27, 34, 41],
    // Diagonal
    [3, 9, 15, 21], [4, 10, 16, 22], [10, 16, 22, 28], [5, 11, 17, 23], [11, 17, 23, 29], [17, 23, 29, 35],
    [6, 12, 18, 24], [12, 18, 24, 30], [18, 24, 30, 36], [13, 19, 25, 31], [19, 25, 31, 37], [20, 26, 32, 38],
    [0, 8, 16, 24], [1, 9, 17, 25], [9, 17, 25, 33], [2, 10, 18, 26], [10, 18, 26, 34], [3, 11, 19, 27],
    [7, 15, 23, 31], [8, 16, 24, 32], [16, 24, 32, 40], [9, 17, 25, 33], [17, 25, 33, 41], [10, 18, 26, 34],
  ];

  // AI move logic
  function aiMove() {
    const availableColumns = [];
    for (let i = 0; i < 7; i++) {
      if (!squares[(5 * 7) + i].classList.contains('taken')) {
        availableColumns.push(i);
      }
    }

    if (availableColumns.length === 0) return;

    let moveMade = false;
    for (let i = 0; i < availableColumns.length; i++) {
      const column = availableColumns[i];
      for (let row = 5; row >= 0; row--) {
        const cellIndex = row * 7 + column;
        if (!squares[cellIndex].classList.contains('taken')) {
          const copyOfSquares = [...squares];
          copyOfSquares[cellIndex].classList.add('taken', 'player-two');
          if (checkWinning(copyOfSquares, 'player-two')) {
            placePiece(cellIndex);
            moveMade = true;
            break;
          }
          copyOfSquares[cellIndex].classList.add('player-one');
          if (checkWinning(copyOfSquares, 'player-one')) {
            placePiece(cellIndex);
            moveMade = true;
            break;
          }
        }
      }
      if (moveMade) break;
    }

    if (!moveMade) {
      const randomMove = availableColumns[Math.floor(Math.random() * availableColumns.length)];
      placePiece(randomMove);
    }
  }

  function checkWinning(squares, player) {
    for (let y = 0; y < winningArrays.length; y++) {
      const [a, b, c, d] = winningArrays[y];
      if (
        squares[a].classList.contains(player) &&
        squares[b].classList.contains(player) &&
        squares[c].classList.contains(player) &&
        squares[d].classList.contains(player)
      ) {
        return true;
      }
    }
    return false;
  }

  function placePiece(index) {
    if (gameOver) return;

    const column = index % 7;
    let placed = false;

    for (let i = 5; i >= 0; i--) {
      const cellIndex = i * 7 + column;
      if (!squares[cellIndex].classList.contains('taken')) {
        squares[cellIndex].classList.add('taken');
        squares[cellIndex].classList.add(currentPlayer === 1 ? 'player-one' : 'player-two');
        placed = true;
        break;
      }
    }

    if (placed) {
      checkBoard();
      if (!gameOver) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        displayCurrentPlayer.textContent = `Player ${currentPlayer}`;
        if (isAI && currentPlayer === 2 && !gameOver) aiMove();
      }
    }
  }

  function checkBoard() {
    for (let y = 0; y < winningArrays.length; y++) {
      const square1 = squares[winningArrays[y][0]];
      const square2 = squares[winningArrays[y][1]];
      const square3 = squares[winningArrays[y][2]];
      const square4 = squares[winningArrays[y][3]];

      if (
        square1.classList.contains('player-one') &&
        square2.classList.contains('player-one') &&
        square3.classList.contains('player-one') &&
        square4.classList.contains('player-one')
      ) {
        result.innerHTML = 'Player One Wins!';
        gameOver = true;
      }
      if (
        square1.classList.contains('player-two') &&
        square2.classList.contains('player-two') &&
        square3.classList.contains('player-two') &&
        square4.classList.contains('player-two')
      ) {
        result.innerHTML = 'Player Two Wins!';
        gameOver = true;
      }
    }
  }

  function startTimer() {
    let timeLeft = 10;
    result.innerHTML = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      result.innerHTML = `Time Left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        passTurn();
      }
    }, 1000);
  }

  function passTurn() {
    if (!gameOver) {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      displayCurrentPlayer.textContent = `Player ${currentPlayer}`;
      startTimer();
    }
  }

  squares.forEach(square => {
    square.addEventListener('click', () => {
      if (!gameOver && !square.classList.contains('taken')) {
        placePiece(parseInt(square.dataset.index));
        if (isAI && !gameOver) aiMove();
      }
    });
  });

  resetButton.addEventListener('click', () => {
    squares.forEach(square => {
      square.classList.remove('taken', 'player-one', 'player-two');
    });
    result.innerHTML = '';
    currentPlayer = 1;
    displayCurrentPlayer.textContent = 'Player 1';
    gameOver = false;
    clearInterval(timer);
    startTimer();
  });

  toggleAIButton.addEventListener('click', () => {
    isAI = !isAI;
    currentPlayer = isAI ? 2 : 1;
    displayCurrentPlayer.textContent = `Player ${currentPlayer}`;
  });

  startTimer();
});
