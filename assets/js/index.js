// game parameters

const BALL_SPEED = 0.5; // Starting ball speed as a fraction of screen height per second
const BALL_SPIN = 0.2; // Ball deflection off the paddle (0 = no spin, 1 =  high spin)
const PADDLE_WIDTH = 0.1; // Paddle width as a fraction of screen width
const PADDLE_SPEED = 0.5; // Paddle speed as a fraction of screen width per second
const WALL = 0.02 // Wall/ball/paddle size as a fraction of shortest screen dimension

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

// set up the game canvas and context
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

// derived dimension
var height, width, wall;
height = window.innerHeight; // PIXELS
width = window.innerWidth;
wall = WALL * (height < width ? height : width);
canvas.width = width;
canvas.height = height;
ctx.lineWidth = wall;

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

    //draw
    drawBackGround();
    drawWalls();
    drawPaddle();
    drawBall();

    //call the next loop
    requestAnimationFrame(loop);
}

function applyBallSpeed(angle) {
    
    // keep the angle between 30 and 150 degrees
    if (angle < Math.PI / 6) {
        angle = Math.PI / 6;
    } else if (angle > Math.PI * 5 / 6) {
        angle = Math.PI * 5 / 6;
    }

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
    let halfWall = wall * 0.5;
    ctx.strokeStyle = COLOR_WALL;
    ctx.beginPath();
    ctx.moveTo(halfWall, height);
    ctx.lineTo(halfWall, halfWall);
    ctx.lineTo(width - halfWall, halfWall);
    ctx.lineTo(width - halfWall, height);
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

function outOfBounds() {
    // TO DO
    newGame();
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
    if (ball.x < wall + ball.radius * 0.5) {
        ball.x = wall + ball.radius * 0.5;
        ball.xv = -ball.xv;
    } else if (ball.x > canvas.width - wall - ball.radius * 0.5) {
        ball.x = canvas.width - wall - ball.radius * 0.5;
        ball.xv = -ball.xv;
    } else if (ball.y <  wall + ball.radius * 0.5) {
        ball.y <  wall + ball.radius * 0.5;
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

        // modify the angle based off ball spin
        let angle = Math.atan2(-ball.yv, ball.xv);
        angle += (Math.random() * Math.PI / 2 - Math.PI / 4) * BALL_SPIN;
        applyBallSpeed(angle);
    }

    // handle out of bounds
    if (ball.y > canvas.height) {
        outOfBounds();
    }

    // move the stationary ball with paddle
    if (ball.yv == 0) {
        ball.x = paddle.x;
    }
}

function updatePaddle(delta) {
    paddle.x += paddle.xv * delta;

    // stop paddle at walls
    if (paddle.x < wall + paddle.width * 0.5) {
        paddle.x = wall + paddle.width * 0.5;
    } else if (paddle.x > canvas.width - wall - paddle.width * 0.5) {
        paddle.x = canvas.width - wall - paddle.width * 0.5;
    }
    
}

function Paddle() {
    this.width = PADDLE_WIDTH * width;
    this.height = wall * 1.25;
    this.x = canvas.width / 2;
    this.y = canvas.height - this.height * 2;
    this.speed = PADDLE_SPEED * width; 
    this.xv = 0;
}

function Ball() {
    this.radius = wall / 2;
    this.x = paddle.x;
    this.y = paddle.y - paddle.height;
    this.speed = BALL_SPEED * height; 
    this.xv = 0;
    this.yv = 0;
}

