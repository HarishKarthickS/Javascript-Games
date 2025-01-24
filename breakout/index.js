const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const gameOverDisplay = document.querySelector('#game-over');
const youWinDisplay = document.querySelector('#you-win');
const restartButtons = document.querySelectorAll('button');

const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;
let xDirection = -2;
let yDirection = 2;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

let balls = [ballCurrentPosition]; // Array to support multiple balls
let timerId;
let score = 0;

const blocks = [];
for (let i = 10; i <= 450; i += 110) {
    for (let j = 270; j >= 210; j -= 30) {
        blocks.push(new Block(i, j));
    }
}

function Block(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
}

// Add blocks to the grid
function addBlocks() {
    blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.classList.add('block');
        blockElement.style.left = block.bottomLeft[0] + 'px';
        blockElement.style.bottom = block.bottomLeft[1] + 'px';
        grid.appendChild(blockElement);
    });
}
addBlocks();

// Add user paddle
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

// Add ball(s)
const ballElements = [];
function addBalls() {
    balls.forEach(ballPos => {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.style.left = ballPos[0] + 'px';
        ball.style.bottom = ballPos[1] + 'px';
        grid.appendChild(ball);
        ballElements.push(ball);
    });
}
addBalls();

// Draw user paddle
function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

// Draw ball(s)
function drawBalls() {
    ballElements.forEach((ball, index) => {
        ball.style.left = balls[index][0] + 'px';
        ball.style.bottom = balls[index][1] + 'px';
    });
}

// Move user
function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 20;
                drawUser();
            }
            break;
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - blockWidth) {
                currentPosition[0] += 20;
                drawUser();
            }
            break;
    }
}

document.addEventListener('keydown', moveUser);

// Move ball(s)
function moveBalls() {
    balls.forEach((ballPos, index) => {
        ballPos[0] += xDirection;
        ballPos[1] += yDirection;

        // Ball collisions
        checkCollisions(ballPos, index);
    });
    drawBalls();
}

function checkCollisions(ballPos, index) {
    // Block collision
    blocks.forEach((block, i) => {
        if (
            ballPos[0] > block.bottomLeft[0] &&
            ballPos[0] < block.bottomRight[0] &&
            ballPos[1] + ballDiameter > block.bottomLeft[1] &&
            ballPos[1] < block.topLeft[1]
        ) {
            const blockElements = Array.from(document.querySelectorAll('.block'));
            blockElements[i].classList.remove('block');
            blocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.textContent = `Score: ${score}`;

            // Spawn power-up
            if (Math.random() < 0.3) spawnPower(block.bottomLeft);
        }
    });

    // Wall collisions
    if (ballPos[0] >= boardWidth - ballDiameter || ballPos[0] <= 0) {
        xDirection = -xDirection;
    }
    if (ballPos[1] >= boardHeight - ballDiameter) {
        yDirection = -yDirection;
    }

    // Paddle collision
    if (
        ballPos[0] > currentPosition[0] &&
        ballPos[0] < currentPosition[0] + blockWidth &&
        ballPos[1] <= currentPosition[1] + blockHeight &&
        ballPos[1] >= currentPosition[1]
    ) {
        changeDirection();
    }

    // Game over
    if (ballPos[1] <= 0) {
        balls.splice(index, 1);
        if (balls.length === 0) {
            gameOverDisplay.classList.remove('hidden');
            clearInterval(timerId);
            document.removeEventListener('keydown', moveUser);
        }
    }

    // Check for win
    if (blocks.length === 0) {
        youWinDisplay.classList.remove('hidden');
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
    }
}

// Change ball direction
function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
    } else if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
    } else if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
    } else if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
    }
}

// Power-ups
function spawnPower(position) {
    const powerUp = document.createElement('div');
    powerUp.classList.add('power-up');
    powerUp.style.left = position[0] + 'px';
    powerUp.style.bottom = position[1] + 'px';
    grid.appendChild(powerUp);

    let powerInterval = setInterval(() => {
        let powerBottom = parseInt(powerUp.style.bottom);
        if (powerBottom <= 0) {
            powerUp.remove();
            clearInterval(powerInterval);
        } else {
            powerUp.style.bottom = powerBottom - 2 + 'px';

            // Check for paddle collision
            if (
                parseInt(powerUp.style.left) > currentPosition[0] &&
                parseInt(powerUp.style.left) < currentPosition[0] + blockWidth &&
                parseInt(powerUp.style.bottom) < currentPosition[1] + blockHeight
            ) {
                powerUp.remove();
                clearInterval(powerInterval);

                // Apply power-up effect
                if (Math.random() < 0.5) {
                    enlargePaddle();
                } else {
                    spawnExtraBall();
                }
            }
        }
    }, 20);
}

function enlargePaddle() {
    user.style.width = blockWidth + 50 + 'px';
    setTimeout(() => (user.style.width = blockWidth + 'px'), 5000);
}

function spawnExtraBall() {
    balls.push([ballStart[0], ballStart[1]]);
    addBalls();
}

// Restart game
restartButtons.forEach(button => {
    button.addEventListener('click', () => {
        location.reload();
    });
});

// Start the game loop
timerId = setInterval(moveBalls, 20);
