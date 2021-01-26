// variables for enabling rendering graphics

let canvas = document.getElementById("gameCanvas");
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;
let ctx = canvas.getContext("2d");

// variables to make the ball move

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;

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
let brickOffsetTop = 25;
let brickOffsetLeft = 25;

// variables score

let score = 0;

// variables lives

let lives = 3;

// variables start / pause

let paused = false;

// creating the two dimensional array for the bricks and assigning the necessary attributes

let bricks = [];

    for(let column = 0; column < brickColumnCount; column++) {
        bricks[column] = [];
        for(let row = 0; row < brickRowCount; row++) {
            bricks[column][row] = {x: 0, y: 0, status: 1, powerUp: 0};
        }
    }
    
    for(let i = 0; i < 3; i++) {
        var powerUpColumn = Math.floor(Math.random() * brickColumnCount);
        var powerUpRow = Math.floor(Math.random() * brickRowCount);
        bricks[powerUpColumn][powerUpRow] = {x: 0, y: 0, status: 1, powerUp: 1};
        var powerUpBrick = bricks[powerUpColumn][powerUpRow];
        console.log(powerUpColumn + " " + powerUpRow);
        console.log(powerUpBrick);
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
    for(let column = 0; column < brickColumnCount; column++) {
        for(let row = 0; row < brickRowCount; row++) {
            if(bricks[column][row].status == 1) {
            let brickX = (column*(brickWidth+brickPadding))+brickOffsetLeft;
            let brickY = (row*(brickHeight+brickPadding))+brickOffsetTop;
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
    if(relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
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
    for(let column = 0; column < brickColumnCount; column++) {
        for(let row = 0; row < brickRowCount; row++) {
            var collisionBrick = bricks[column][row];
            if(collisionBrick.status == 1 && collisionBrick.powerUp == 0) {
                if(x > collisionBrick.x && x < collisionBrick.x+brickWidth && y > collisionBrick.y && y < collisionBrick.y+brickHeight) {
                    dy = -dy;
                    collisionBrick.status = 0;
                    score++;
                if (score == brickRowCount * brickColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                    }
                }
            }
            if(collisionBrick.status == 1 && collisionBrick.powerUp == 1) {
                if(x > collisionBrick.x && x < collisionBrick.x+brickWidth && y > collisionBrick.y && y < collisionBrick.y+brickHeight) {
                    dy = -dy;
                    collisionBrick.status = 0;
                    score++;
                    alert("powerup was hit.");
                if (score == brickRowCount * brickColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                    }
                }
            }
        }
    }
}

// score board and lives

function drawScore() {
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("SCORE: "+score, 25, 20);
}

function drawLives() {
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "0095DD";
    ctx.fillText("LIVES: "+lives, canvas.width - 80, 20);
}

// Here all game functionalities come together

function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
        lives--;
        if(!lives) {
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

    if (paused) {

    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }
   
     if(rightPressed) {
        paddleX += 5;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
   
    if(leftPressed) {
        paddleX -= 5;
        if (paddleX < 0) {
            paddleX = 0;
        }
    } 
        x += dx;
        y += dy;
    }

    requestAnimationFrame(draw);
    
}

draw();