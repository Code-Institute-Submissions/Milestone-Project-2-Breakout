// variables for enabling rendering graphics

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// variables to make the ball move

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 1;
let dy = -1;

// variables to adjust collision frame

let ballRadius = 2;

// variables to move the paddle

let paddleHeight = 2;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// variables to control the paddle

let rightPressed = false;
let leftPressed = false;

// variables to create the brick wall

let brickRowCount = 5;
let brickColumnCount = 10;
let brickWidth = 25;
let brickHeight = 5;
let brickPadding = 5;
let brickOffsetTop = 5;
let brickOffsetLeft = 5;

// creating the two dimensional array for the bricks

var bricks = [];

    for(var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for(var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {x: 0, y: 0, status: 1};
        }
    }

// drawing on the canvas

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath;
    
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
            let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks [c][r].x = brickX;
            bricks [c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

function movement() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if(y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval);
        }
    }

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

// moving the paddle

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(control) {
    if (control.key == "Right" || control.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (control.key == "Left" || control.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(control) {
    if (control.key == "Right" || control.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (control.key == "Left" || control.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let collisionBrick = bricks[c][r];
            if(collisionBrick.status == 1) {
            if(x > collisionBrick.x && x < collisionBrick.x+brickWidth && y > collisionBrick.y && y < collisionBrick.y+brickHeight) {
                dy = -dy;
                collisionBrick.status = 0;
                }
            }
        }
    }
}

let interval = setInterval(movement, 10);
