// variables for enabling rendering graphics

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// variables to make the ball move

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// variables to adjust collision frame

let ballRadius = 3;

// variables to move the paddle

let paddleHeight = 5;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// variables to control the paddle

let rightPressed = false;
let leftPressed = false;

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

function movement() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    if(y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
        dy = -dy;
    }

    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }
   
     if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }

    if(leftPressed) {
        paddleX -= 7;
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

setInterval(movement, 10);
