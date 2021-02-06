// game parameters

const BALL_SPEED = 0.5; // STARTING BALL SPEED AS A FRACTION OF SCREEN WIDTH PER SECOND
const HEIGHT = 600; // PIXELS
const PADDLE_SPEED = 0.7; // FRACTION OF SCREEN WIDTH PER SECOND

// derived dimension
const WIDTH =  HEIGHT * 1.3;
const WALL = WIDTH / 300;
const BALL_RADIUS = 3;
const PADDLE_HEIGHT = 5;
const PADDLE_WIDTH = 75;

// colors
const COLOR_BACKGROUND = "black";
const COLOR_WALL = "#0095DD";
const COLOR_PADDLE = "#0095DD";
const COLOR_BALL = "#0095DD";

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
var ball, paddle;

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
    updateBall(timeDelta);

    console.log(ball.y > paddle.y - paddle.height * 0.5 - ball.radius * 0.5);
    console.log(ball.y < paddle.y);
    console.log(ball.x > paddle.x - paddle.width * 0.5 - ball.radius * 0.5);
    console.log(ball.x < paddle.x + paddle.width * 0.5 + ball.radius * 0.5);

    //draw
    drawBackGround();
    drawWalls();
    drawPaddle();
    drawBall();

    //call the next loop
    requestAnimationFrame(loop);
}

function applyBallSpeed(angle) {
    // update x and y velocities of the ball
    ball.xv = ball.speed * Math.cos(angle);
    ball.yv = -ball.speed * Math.sin(angle);
}

function drawBackGround() {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0 , 0, canvas.width, canvas.height);
}

function drawPaddle() {
    ctx.fillStyle = COLOR_PADDLE;
    ctx.fillRect(paddle.x - paddle.width * 0.5, paddle.y - paddle.height * 0.5, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = COLOR_BALL;
    ctx.fill();
    ctx.closePath();
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
        case 32: // spacebar to serve the ball
            serve();
            break;
        case 37: // left arrow for moving paddle to the left
            movePaddle(Direction.LEFT);
            break;
        case 39: // right arrow for moving paddle to the right
            movePaddle(Direction.RIGHT);
            break;
    }
}

function keyUp(event) {
    switch (event.keyCode) {
        case 37: // left arrow for stop moving paddle to the left
        case 39: // right arrow for stop moving paddle to the right
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
    ball = new Ball();
}

function serve() {

    // ball already in motion
    if (ball.yv != 0) {
        return;
    }

    // random angle
    let angle = Math.random() * Math.PI / 2 + Math.PI / 4;
    applyBallSpeed(angle);
}

function updateBall(delta) {
    ball.x += ball.xv * delta;
    ball.y += ball.yv * delta;

    // bounce the ball off walls
    if (ball.x < WALL + ball.radius * 0.5) {
        ball.x = WALL + ball.radius * 0.5;
        ball.xv = -ball.xv;
    } else if (ball.x > canvas.width - WALL - ball.radius * 0.5) {
        ball.x = canvas.width - WALL - ball.radius * 0.5;
        ball.xv = -ball.xv;
    } else if (ball.y <  WALL + ball.radius * 0.5) {
        ball.y <  WALL + ball.radius * 0.5;
        ball.yv = -ball.yv;
    }

    // bounce the ball off the paddle 
    if (ball.y > paddle.y - paddle.height * 0.5 - ball.radius * 0.5
        && ball.y < paddle.y
        && ball.x > paddle.x - paddle.width * 0.5 - ball.radius * 0.5
        && ball.x < paddle.x + paddle.width * 0.5 + ball.radius * 0.5
    ) {
        ball.y = paddle.y - paddle.height * 0.5 - ball.radius * 0.5;
        ball.yv = -ball.yv;
    }
    
    // move the stationary ball with paddle
    if (ball.yv == 0) {
        ball.x = paddle.x;
    }
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
    this.y = canvas.height - this.height;
    this.speed = PADDLE_SPEED * WIDTH; 
    this.xv = 0;
}

function Ball() {
    this.radius = BALL_RADIUS;
    this.x = paddle.x;
    this.y = paddle.y - paddle.height - this.radius;
    this.speed = BALL_SPEED * WIDTH; 
    this.xv = 0;
    this.yv = 0;
}

