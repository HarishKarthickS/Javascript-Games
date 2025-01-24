const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
const width = 15;
const aliensRemoved = [];
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;
let level = 1;
const levelSpeed = 600;
const levelUpSpeed = 50;

// Create grid
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

// Aliens
let alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

const bossInvader = [100]; // Boss appears at index 100

function draw() {
    // Draw regular aliens
    alienInvaders.forEach((alien, i) => {
        if (!aliensRemoved.includes(i)) {
            squares[alien].classList.add("invader");
        }
    });

    // Draw boss if applicable
    if (level > 3 && bossInvader.length) {
        squares[bossInvader[0]].classList.add("boss");
    }
}

draw();

squares[currentShooterIndex].classList.add("shooter");

// Remove aliens
function remove() {
    alienInvaders.forEach(alien => {
        squares[alien].classList.remove("invader");
    });
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter");
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && isGoingRight) {
        alienInvaders = alienInvaders.map(alien => alien + width + 1);
        direction = -1;
        isGoingRight = false;
    }

    if (leftEdge && !isGoingRight) {
        alienInvaders = alienInvaders.map(alien => alien + width - 1);
        direction = 1;
        isGoingRight = true;
    }

    alienInvaders = alienInvaders.map(alien => alien + direction);

    draw();

    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = `GAME OVER | Score: ${results}`;
        clearInterval(invadersId);
    }

    if (aliensRemoved.length === alienInvaders.length) {
        increaseLevel(); // Move to the next level
    }
}

invadersId = setInterval(moveInvaders, levelSpeed);

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex -= width;

        if (currentLaserIndex < 0) {
            clearInterval(laserId);
            return;
        }

        squares[currentLaserIndex].classList.add("laser");

        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.remove("invader");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultDisplay.innerHTML = `Score: ${results} | Level: ${level}`;

        } else if (squares[currentLaserIndex].classList.contains("boss")) {
            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.remove("boss");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);
            clearInterval(laserId);
            bossHealth--;

            if (bossHealth <= 0) {
                aliensRemoved.push(bossInvader[0]);
                results += 10;
                resultDisplay.innerHTML = `Score: ${results} | Level: ${level}`;
            }
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener('keydown', shoot);

let bossHealth = 5;

function increaseLevel() {
    // Level up
    level++;
    resultDisplay.innerHTML = `Level: ${level} | Score: ${results}`;
    clearInterval(invadersId);
    invadersId = setInterval(moveInvaders, levelSpeed - level * levelUpSpeed);

    // Reset aliens after level up
    resetAliens();
}

function resetAliens() {
    alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ];

    if (level > 3) {
        bossInvader[0] = 100; // Boss appears after level 3
        bossHealth = 5;
    }

    aliensRemoved.length = 0; // Reset aliens removed at the start of the new level
    draw(); // Redraw the grid for the new level
}
