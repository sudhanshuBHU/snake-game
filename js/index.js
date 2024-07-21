// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
// const musicSound = new Audio('music/music.mp3');
let speed = 3;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 10, y: 10 }
];

food = { x: 15, y: 10 };
bonusFoodCoordinates = { x: 8, y: 8 };

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

let count = 0;
let bonusStatus = false;
let foodScore = 0;
let bonusFoodScore = 0;

function updateBonusFood() {
    bonusFoodCoordinates = {
        x: Math.round(17 * Math.random()),
        y: Math.round(17 * Math.random())
    }
}

function displayBonusFood() {

    bonusElement = document.createElement('div');
    bonusElement.style.gridRowStart = bonusFoodCoordinates.y;
    bonusElement.style.gridColumnStart = bonusFoodCoordinates.x;
    bonusElement.classList.add('bonus')
    board.appendChild(bonusElement);

}

// promise
function delayFunc() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            count = 0;
            updateBonusFood();
            bonusStatus = false;
        }, 4000); // after 4 sec
    })
}

function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        // musicSound.pause();
        inputDir = { x: 0, y: 0 };
        speed = 3;
        count = 0;
        foodScore = 0;
        bonusFoodScore = 0;
        bonusStatus = false;
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 10, y: 10 }];
        // musicSound.play();
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        foodDiv.innerHTML = "Food: " + foodScore;
        bonusFoodDiv.innerHTML = "Bonus Food: " + bonusFoodScore;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        speed += 0.5;
        count += 1; // set count for bonus food
        foodScore += 1;

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        foodDiv.innerHTML = "Food: " + foodScore;

        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }
    // if bonus food is eaten
    else if (snakeArr[0].x === bonusFoodCoordinates.x && snakeArr[0].y === bonusFoodCoordinates.y) {
        foodSound.play();
        score += 5;
        bonusFoodScore += 1;

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        bonusFoodDiv.innerHTML = "Bonus Food: " + bonusFoodScore;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        updateBonusFood();
        bonusStatus = false;
        count = 0;
    }
    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    if (count >= 4) {
        displayBonusFood();
        if (!bonusStatus) {
            delayFunc().then(() => {
                bonusStatus = false;
            })
        }
        bonusStatus = true;
    }
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);


}


// Main logic starts here
window.requestAnimationFrame(main);
let hiscore = localStorage.getItem("hiscore");

if (!hiscore) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}


window.addEventListener('keydown', e => {
    inputDir = { x: 1, y: 0 } // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            // console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            // console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            // console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            // console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }

});

function upDirection() {
    inputDir.x = 0;
    inputDir.y = -1;
}
function downDirection() {
    inputDir.x = 0;
    inputDir.y = 1;
}
function rightDirection() {
    inputDir.x = 1;
    inputDir.y = 0;
}
function leftDirection() {
    inputDir.x = -1;
    inputDir.y = 0;
}



