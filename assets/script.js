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

// variables to draw the paddle

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// variables to control the paddle

let rightpressed = false;
let leftpressed = false;

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

function moveBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();

    if(y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
        dy = -dy;
    }

    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }
   
    x += dx;
    y += dy;
}

setInterval(moveBall, 10);
