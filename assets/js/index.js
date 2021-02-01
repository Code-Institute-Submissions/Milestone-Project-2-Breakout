// variables for enabling rendering graphics

let canvas = document.getElementById("gameCanvas");
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;
let ctx = canvas.getContext("2d");

// variables to make the ball move

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;

// variables to adjust collision frame

let ballRadius = 3;

// variables to move the paddle

let paddleHeight = 3;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// variables to control the paddle

let rightPressed = false;
let leftPressed = false;

// variables to create the brick wall

let brickRowCount = 5;
let brickColumnCount = 10;
let brickWidth = 50;
let brickHeight = 10;
let brickPadding = 5;
let brickOffsetTop = 10;
let brickOffsetLeft = 25;

// variables to create powerups

let powerUpWidth = 5;
let powerUpHeight = 5;
let powerUpPadding = 5;
let powerUpOffsetLeft = 20;
let powerUpOffsetTop = 25;

// variables to make the powerup move

let powerUpX = 0;
let powerUpY = 0;
let dPowerUpY = 2;

// variables to count powerup

let powerUpCount = 0;
const powerUpLimit = 3;

// variables to make the powerup drop

let drop1 = false;
let drop2 = false;
let drop3 = false;

// variables score

let score = 0;

// variables lives

let lives = 3;

// variables start / pause

let paused = false;

// variables detection

let powerUpColumn;
let powerUpRow;

// creating the two dimensional array for the bricks

let bricks = [];

for (let column = 1; column <= brickColumnCount; column++) {
    bricks[column] = [];
    for (let row = 1; row <= brickRowCount; row++) {
        bricks[column][row] = { x: 0, y: 0, status: 1, powerUp: 0 };
    }
}

// generate powerup

function generatePowerUp() {
for(powerUpCount = 0; powerUpCount < powerUpLimit; powerUpCount++) {
    let powerUpColumn = Math.floor(Math.random() * brickColumnCount) + 1;
    let powerUpRow = Math.floor(Math.random() * brickRowCount) + 1;
    bricks[powerUpColumn][powerUpRow] = { x: 0, y: 0, status: 1, powerUp: 1, powerUpCount: powerUpCount, powerUpKind: 0, powerUpActive: 1 };
    console.log(powerUpColumn + " " + powerUpRow);
    console.log(bricks[powerUpColumn][powerUpRow]);
    for (var column = 1; column <= brickColumnCount; column++) {
        for (let row = 1; row <= brickRowCount; row++) {
            if (bricks[column][row].powerUp === 1 && bricks[column][row].powerUpCount === 0) {
                powerUp1X = (column * (brickWidth + brickPadding) + ((brickWidth / 2) - (powerUpWidth / 2)) - brickOffsetLeft);
                powerUp1Y = (row * (brickHeight + brickPadding) + ((brickHeight / 2) - (powerUpHeight / 2)) + brickOffsetTop);
                bricks[column][row].x = powerUp1X;
                bricks[column][row].y = powerUp1Y;
            }
            if (bricks[column][row].powerUp === 1 && bricks[column][row].powerUpCount === 1) {
                powerUp2X = (column * (brickWidth + brickPadding) + ((brickWidth / 2) - (powerUpWidth / 2)) - brickOffsetLeft);
                powerUp2Y = (row * (brickHeight + brickPadding) + ((brickHeight / 2) - (powerUpHeight / 2)) + brickOffsetTop);
                bricks[column][row].x = powerUp2X;
                bricks[column][row].y = powerUp2Y;
            }
            if (bricks[column][row].powerUp === 1 && bricks[column][row].powerUpCount === 2) {
                powerUp3X = (column * (brickWidth + brickPadding) + ((brickWidth / 2) - (powerUpWidth / 2)) - brickOffsetLeft);
                powerUp3Y = (row * (brickHeight + brickPadding) + ((brickHeight / 2) - (powerUpHeight / 2)) + brickOffsetTop);
                bricks[column][row].x = powerUp3X;
                bricks[column][row].y = powerUp3Y;
            }
        }
    }
}
}

// drawing on the canvas

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var column = 1; column <= brickColumnCount; column++) {
        for (let row = 1; row <= brickRowCount; row++) {
            if (bricks[column][row].status === 1) {
                let brickX = (column * (brickWidth + brickPadding) - brickOffsetLeft);
                let brickY = (row * (brickHeight + brickPadding) + brickOffsetTop);
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPowerUp1() {
    ctx.beginPath();
    ctx.rect(powerUp1X, powerUp1Y, powerUpWidth, powerUpHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPowerUp2() {
    ctx.beginPath();
    ctx.rect(powerUp2X, powerUp2Y, powerUpWidth, powerUpHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPowerUp3() {
    ctx.beginPath();
    ctx.rect(powerUp3X, powerUp3Y, powerUpWidth, powerUpHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// gamecontrols

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(control) {
    switch (control.code) {
        case "Right":
            rightPressed = true;
            break;
        case "ArrowRight":
            rightPressed = true;
            break;
        case "Left":
            leftPressed = true;
            break;
        case "ArrowLeft":
            leftPressed = true;
            break;
        case "Space":
            togglePause();
    }
}

function keyUpHandler(control) {
    switch (control.code) {
        case "Right":
            rightPressed = false;
            break;
        case "ArrowRight":
            rightPressed = false;
            break;
        case "Left":
            leftPressed = false;
            break;
        case "ArrowLeft":
            leftPressed = false;
    }
}

function mouseMoveHandler(control) {
    let relativeX = control.clientX;
    if (relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// starting / pausing the game

function togglePause() {
    if (!paused) {
        paused = true;
    } else if (paused) {
        paused = false;
    }
}

// detect collision

function collisionDetection() {
    for (let column = 1; column <= brickColumnCount; column++) {
        for (let row = 1; row <= brickRowCount; row++) {
            collisionBrick = bricks[column][row];
            if (collisionBrick.status === 1) {
                if (x > collisionBrick.x && x < collisionBrick.x + brickWidth && y > collisionBrick.y && y < collisionBrick.y + brickHeight) {
                    dy = -dy;
                    collisionBrick.status = 0;
                    score++; 
                    if (collisionBrick.powerUp === 1 && collisionBrick.powerUpCount === 0) {
                        drop1 = true;
                    }
                    if (collisionBrick.powerUp === 1 && collisionBrick.powerUpCount === 1) {
                        drop2 = true;
                    }
                    if (collisionBrick.powerUp === 1 && collisionBrick.powerUpCount === 2) {
                        drop3 = true;
                    }

                }
                if (score == brickRowCount * brickColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                }

            }
        }
    }
}

// score board and lives

function drawScore() {
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("SCORE: " + score, 30, 20);
}

function drawLives() {
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("LIVES: " + lives, canvas.width - 75, 20);
}

// Here all game functionalities come together

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPowerUp1();
    drawPowerUp2();
    drawPowerUp3();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
      
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (drop1 && powerUp1Y + dPowerUpY > canvas.height) {
        if(drop1 && powerUp1X > paddleX && powerUp1X < paddleX + paddleWidth) {
            powerUp1Active = true;
            console.log(powerUp1Active);
        } else {
            powerUp1Active = false;
            console.log(powerUp1Active);
        }
    }

    if (drop2 && powerUp2Y + dPowerUpY > canvas.height) {
        if(drop2 && powerUp2X > paddleX && powerUp2X < paddleX + paddleWidth) {
            powerUp2Active = true;
            console.log(powerUp2Active);
        } else {
            powerUp2Active = false;
            console.log(powerUp2Active);
        }
    }

    if (drop3 && powerUp3Y + dPowerUpY > canvas.height) {
        if(drop3 && powerUp3X > paddleX && powerUp3X < paddleX + paddleWidth) {
            powerUp3Active = true;
            console.log(powerUp3Active);
        } else {
            powerUp3Active = false;
            console.log(powerUp3Active);
        }
    }

    if (paused) {

        if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
            dx = -dx;
        }

        if (rightPressed) {
            paddleX += 5;
            if (paddleX + paddleWidth > canvas.width) {
                paddleX = canvas.width - paddleWidth;
            }
        }

        if (leftPressed) {
            paddleX -= 5;
            if (paddleX < 0) {
                paddleX = 0;
            }
        }

        
        if (drop1 && powerUp1Y < canvas.height) {
            powerUp1Y += dPowerUpY;
        } 

         if (drop2 && powerUp2Y < canvas.height) {
            powerUp2Y += dPowerUpY;
        } 

         if (drop3 && powerUp3Y < canvas.height) {
            powerUp3Y += dPowerUpY;
        } 

        if (powerUp1Y > canvas.height) {
            drop1 = false;
        }

        if (powerUp2Y > canvas.height) {
            drop2 = false;
        }

        if (powerUp3Y > canvas.height) {
            drop3 = false;
        }

        x += dx;
        y += dy;

    }

    requestAnimationFrame(draw);

}


generatePowerUp();
draw();

