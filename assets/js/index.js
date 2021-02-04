// game parameters

const HEIGHT = 600; // PIXELS
const PADDLE_SPEED = 0.7; // FRACTION OF SCREEN WIDTH PER SECOND

// derived dimension
const WIDTH =  HEIGHT * 1.3;
const WALL = WIDTH / 300;
const PADDLE_HEIGHT = WALL;
const PADDLE_WIDTH = PADDLE_HEIGHT * 30; 

// colors
const COLOR_BACKGROUND = "black";
const COLOR_WALL = "#0095DD";
const COLOR_PADDLE = "#0095DD";

// definitions
const Direction = {
    LEFT: 0,
    RIGHT: 1,
    STOP: 2
}

// game canvas
var canvas = document.createElement("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

// set up the context
var ctx = canvas.getContext("2d");
ctx.lineWidth = WALL;

// game variables
var paddle;

// start a new game
newGame();

// event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// set up game loop
var timeDelta, timeLast;
requestAnimationFrame(loop);

function loop(timeNow) {
    if (!timeLast) {
        timeLast = timeNow;
    }

    // calculate time difference
    timeDelta = (timeNow - timeLast) / 1000; // divided by thousand to set it in s instead of ms
    timeLast = timeNow;

    //update
    updatePaddle(timeDelta);

    //draw
    drawBackGround();
    drawWalls();
    drawPaddle();

    //call the next loop
    requestAnimationFrame(loop);
}

function drawBackGround() {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0 , 0, canvas.width, canvas.height);
}

function drawPaddle() {
    ctx.fillStyle = COLOR_PADDLE;
    ctx.fillRect(paddle.x - paddle.width * 0.5, paddle.y - paddle.height * 0.5, paddle.width, paddle.height);
}

function drawWalls() {
    let halfWall = WALL * 0.5;
    ctx.strokeStyle = COLOR_WALL;
    ctx.beginPath();
    ctx.moveTo(halfWall, HEIGHT);
    ctx.lineTo(halfWall, halfWall);
    ctx.lineTo(WIDTH - halfWall, halfWall);
    ctx.lineTo(WIDTH - halfWall, HEIGHT);
    ctx.stroke();
}

function keyDown(event) {
    switch (event.keyCode) {
        case 37: //left arrow for moving paddle to the left
            movePaddle(Direction.LEFT);
            break;
        case 39: //right arrow for moving paddle to the right
            movePaddle(Direction.RIGHT);
            break;
    }
}

function keyUp(event) {
    switch (event.keyCode) {
        case 37: //left arrow for stop moving paddle to the left
        case 39: //right arrow for stop moving paddle to the right
            movePaddle(Direction.STOP);
            break;
    }
}

function movePaddle(direction) {
    switch (direction) {
        case Direction.LEFT:
            paddle.xv = -paddle.speed;
            break;
        case Direction.RIGHT:
            paddle.xv = paddle.speed;
            break;
        case Direction.STOP:
            paddle.xv = 0;
            break;
    }
}

function newGame() {
    paddle = new Paddle();
}

function updatePaddle(delta) {
    paddle.x += paddle.xv * delta;

    // stop paddle at walls
    if (paddle.x < WALL + paddle.width * 0.5) {
        paddle.x = WALL + paddle.width * 0.5;
    } else if (paddle.x > canvas.width - WALL - paddle.width * 0.5) {
        paddle.x = canvas.width - WALL - paddle.width * 0.5;
    }
    
}

function Paddle() {
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.x = canvas.width / 2;
    this.y = canvas.height - this.height * 3;
    this.speed = PADDLE_SPEED * WIDTH; 
    this.xv = 0;
}