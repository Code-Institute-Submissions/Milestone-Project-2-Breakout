// game parameters

const BALL_SPEED = 0.5; // Starting ball speed as a fraction of screen height per second
const BALL_SPIN = 0.2; // Ball deflection off the paddle (0 = no spin, 1 =  high spin)
const BRICK_ROWS = 8; // Starting nummer of brick rows
const BRICK_COLUMNS = 14; // Number of brick columns
const BRICK_GAP = 0.3; // Brick gap as a fraction of wall width
const MARGIN = 6; // Number of empty rows above the bricks
const MAX_LEVEL = 10; // maximum game level (+2 rows for each level) 
const MIN_BOUNCE_ANGLE = 30; // minimum bounce angle from the horizontal in degrees
const PADDLE_WIDTH = 0.1; // Paddle width as a fraction of screen width
const PADDLE_SPEED = 0.5; // Paddle speed as a fraction of screen width per second
const WALL = 0.02; // Wall/ball/paddle size as a fraction of shortest screen dimension


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

// game variables
var ball, bricks = [], level, paddle, touchX;

// derived dimensions
var height, width, wall;
setDimensions();

// event listeners
canvas.addEventListener("touchcancel", touchCancel);
canvas.addEventListener("touchend", touchEnd);
canvas.addEventListener("touchmove", touchMove);
canvas.addEventListener("touchstart", touchStart);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
window.addEventListener("resize", setDimensions);

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
    updateBricks(timeDelta);

    //draw
    drawBackGround();
    drawWalls();
    drawPaddle();
    drawBricks();
    drawBall();

    //call the next loop
    requestAnimationFrame(loop);
}

// update x and y velocities of the ball
function applyBallSpeed(angle) {
    ball.xv = ball.speed * Math.cos(angle);
    ball.yv = -ball.speed * Math.sin(angle);
}

function createBricks() {
    
    // row dimensions
    let minY = wall;
    let maxY = ball.y - ball.radius * 3.5;
    let totalSpaceY = maxY - minY;
    let totalRows = MARGIN + BRICK_ROWS + MAX_LEVEL * 2;
    let rowH = totalSpaceY / totalRows;
    let gap = wall * BRICK_GAP;
    let h = rowH - gap;

    // column dimensions
    let totalSpaceX = width - wall * 2;
    let columnW = (totalSpaceX - gap) / BRICK_COLUMNS;
    let w = columnW - gap;

    // populate the bricks array
    bricks = [];
    let columns = BRICK_COLUMNS;
    let rows = BRICK_ROWS + level * 2;
    let color, left, top, rank, rankHigh;
    rankHigh = rows * 0.5 - 1;
    for (let i = 0; i < rows; i++) {
        bricks[i] = [];
        rank = Math.floor(i * 0.5);
        color = getBrickColor(rank, rankHigh);
        top = wall + (MARGIN + i) * rowH;
        for (let j = 0; j < columns; j++) {
            left = wall + gap + j * columnW;
            bricks[i][j] = new Brick(left, top, w, h, color);
        }
    }
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

function drawBricks() {
    for (let row of bricks) {
        for (let brick of row) {
            if (brick == null) {
                continue;
            }
            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.left, brick.top, brick.w, brick.h);
        }
    }
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


// darkest blue = 0, mid blue 1 = 0.25, mid blue 2 = 0.50, light blue = 0.75
function getBrickColor(rank, highestRank) {
    let fraction = rank / highestRank;
    let r, g, b;

    // darkest blue to mid blue 1
    if (fraction < 0.25) {
        r = 0;
        g = 106;
        b = 157;
    }

    if (fraction > 0.25 && fraction < 0.50) {
        r = 0;
        g = 149;
        b = 221;
    }

     if (fraction > 0.50 && fraction < 0.75) {
        r = 7;
        g = 174;
        b = 225;
    }

    if (fraction > 0.75) {
        r = 34;
        g = 181;
        b = 252;
    }

    return "rgb(" + r + ", " + g + ", " + b + ")";
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
    level = 0;
    touchX = null;
    createBricks();
}

function outOfBounds() {
    // TO DO
    newGame();
}

function serve() {
    // ball already in motion
    if (ball.yv != 0) {
        return false;
    }

    // random angle
    let angle = Math.random() * Math.PI / 2 + Math.PI / 4;
    applyBallSpeed(angle);
    return true;
}

function setDimensions() {
    height = window.innerHeight; // PIXELS
    width = window.innerWidth;
    wall = WALL * (height < width ? height : width);
    canvas.width = width;
    canvas.height = height;
    ctx.lineWidth = wall;
    newGame();
}

function spinBall() {
    let upwards = ball.yv < 0;
    let angle = Math.atan2(-ball.yv, ball.xv);
    angle += (Math.random() * Math.PI / 2 - Math.PI / 4) * BALL_SPIN;

    // minimum bounce angle
    let minBounceAngle = MIN_BOUNCE_ANGLE / 180 * Math.PI;
    if(upwards) {       
        if (angle < minBounceAngle) {
            angle = minBounceAngle;
        } else if (angle > Math.PI - minBounceAngle) {
            angle = Math.PI - minBounceAngle;
        }
    } else {
        if (angle > -minBounceAngle) {
            angle = -minBounceAngle;
        } else if (angle < -Math.PI + minBounceAngle) {
            angle = -Math.PI + minBounceAngle;
        }
    }
    applyBallSpeed(angle);
}

function touchCancel(event) {
    touchX = null;
    movePaddle(Direction.STOP);
}

function touchEnd(event) {
    touchX = null;
    movePaddle(Direction.STOP);
}

function touchMove(event) {
    touchX = event.touches[0].clientX;
}

function touchStart(event) {
    if (serve()) {
        return;
    }
    touchX = event.touches[0].clientX;
}

function updateBall(delta) {
    ball.x += ball.xv * delta;
    ball.y += ball.yv * delta;

    // bounce the ball off walls
    if (ball.x < wall + ball.radius * 0.5) {
        ball.x = wall + ball.radius * 0.5;
        ball.xv = -ball.xv;
        spinBall();
    } else if (ball.x > canvas.width - wall - ball.radius * 0.5) {
        ball.x = canvas.width - wall - ball.radius * 0.5;
        ball.xv = -ball.xv;
        spinBall();
    } else if (ball.y <  wall + ball.radius * 0.5) {
        ball.y <  wall + ball.radius * 0.5;
        ball.yv = -ball.yv;
        spinBall();
    }

    // bounce the ball off the paddle 
    if (ball.y > paddle.y - paddle.height * 0.5 - ball.radius * 0.5
        && ball.y < paddle.y
        && ball.x > paddle.x - paddle.width * 0.5 - ball.radius * 0.5
        && ball.x < paddle.x + paddle.width * 0.5 + ball.radius * 0.5
    ) {
        ball.y = paddle.y - paddle.height * 0.5 - ball.radius * 0.5;
        ball.yv = -ball.yv;
        spinBall();
    }

    // handle out of bounds
    if (ball.y > canvas.height) {
        console.log("TEST");
        outOfBounds();
    }

    // move the stationary ball with paddle
    if (ball.yv == 0) {
        ball.x = paddle.x;
    }
}


function updateBricks(delta) {

    // check for ball collisions
    OUTER: for (let i = 0; i < bricks.length; i++) {
        for(let j = 0; j < BRICK_COLUMNS; j++) {
            if (bricks[i][j] != null && bricks[i][j].intersect(ball)) {
                bricks[i][j] = null;
                ball.yv = -ball.yv;
                spinBall();
                // TODO SCORE
                break OUTER;
            }
        }
    }
}

function updatePaddle(delta) {
    
    // handle touch
    if (touchX != null) {
        if (touchX > paddle.x + wall) {
            movePaddle(Direction.RIGHT);
        } else if (touchX < paddle.x - wall) {
            movePaddle(Direction.LEFT);
        } else {
            movePaddle(Direction.STOP);
        }
    }
    
    // move the paddle
    paddle.x += paddle.xv * delta;

    // stop paddle at walls
    if (paddle.x < wall + paddle.width * 0.5) {
        paddle.x = wall + paddle.width * 0.5;
    } else if (paddle.x > canvas.width - wall - paddle.width * 0.5) {
        paddle.x = canvas.width - wall - paddle.width * 0.5;
    }
    
}

function Ball() {
    this.radius = wall / 2;
    this.x = paddle.x;
    this.y = paddle.y - paddle.height;
    this.speed = BALL_SPEED * height; 
    this.xv = 0;
    this.yv = 0;
}

function Brick(left, top, w, h, color) {
    this.w = w;
    this.h = h;
    this.bot = top + h;
    this.left = left;
    this.right = left + w;
    this.top = top;
    this.color = color;

    this.intersect = function(ball) {
        let bBot = ball.y + ball.radius * 0.5;
        let bLeft = ball.x - ball.radius * 0.5;
        let bRight = ball.x + ball.radius * 0.5;
        let bTop = ball.y - ball.radius * 0.5;
        return this.left < bRight
                && bLeft < this.right
                && this.bot > bTop
                && bBot > this.top;
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