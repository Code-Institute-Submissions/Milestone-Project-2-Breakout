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

// counting te score

let score = 0;

// initializing lives

let lives = 3;

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

// moving the paddle

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

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

function mouseMoveHandler(control) {
    let relativeX = control.clientX;
    if(relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
    
}

// detect collision

function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let collisionBrick = bricks[c][r];
            if(collisionBrick.status == 1) {
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

    requestAnimationFrame(draw);
}

draw();
