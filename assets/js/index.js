// game parameters

const BALL_SPEED = 0.5; // starting ball speed as a fraction of screen height per second
const BALL_SPEED_MAX = 1.5; // max ball speed as a multiple of starting speed
const BALL_SPIN = 0.2; // ball deflection off the paddle (0 = no spin, 1 =  high spin)
const BRICK_ROWS = 8; // starting nummer of brick rows
const BRICK_COLUMNS = 14; // number of brick columns
const BRICK_GAP = 0.3; // brick gap as a fraction of wall width
const GAME_LIVES = 3; // starting number of games lives
const KEY_SCORE = "Highscore"; // save key for local storage of high score
const MARGIN = 6; // number of empty rows above the bricks
const MAX_LEVEL = 10; // maximum game level (+2 rows for each level) 
const MIN_BOUNCE_ANGLE = 30; // minimum bounce angle from the horizontal in degrees
const PADDLE_WIDTH = 0.08; // paddle width as a fraction of screen width
const PADDLE_SIZE = 1.5; // paddle size as a multiple of wall thickness
const PADDLE_SPEED = 0.5; // paddle speed as a fraction of screen width per 
const POWERUP_BONUS = 50; // bonus points for collecting a powerup when a powerup is in play
const POWERUP_CHANCE = 1; // probability of a powerup under a brick (between 0 and 1)
const POWERUP_SPEED = 0.05; // powerup drop speed as a fraction of the screen height
const WALL = 0.015; // wall/ball/paddle size as a fraction of shortest screen dimension

// colors
const COLOR_BACKGROUND = "black";
const COLOR_BALL = "#0095DD";
const COLOR_PADDLE = "#0095DD";
const COLOR_STICKYPADDLE = "red";
const COLOR_SUPERBALL = "red";
const COLOR_TEXT = "#0095DD";
const COLOR_WALL = "black";

// text
const TEXT_FONT = "Arial";
const TEXT_GAME_OVER = "GAME OVER";
const TEXT_LEVEL = "LEVEL";
const TEXT_LIVES = "LIVES";
const TEXT_SCORE = "SCORE";
const TEXT_SCORE_HIGH = "HIGH SCORE";
const TEXT_SOUND = "SOUND";
const TEXT_WIN = "YOU WIN!";

// definitions
const Direction = {
    LEFT: 0,
    RIGHT: 1,
    STOP: 2
}

const PowerUpType = {
    EXTENSION: {color: "#0095DD"},
    LIFE: {color: "#0095DD"},
    MULTI: {color: "#0095DD"},
    STICKY: {color: "#0095DD"},
    SUPER: {color: "#0095DD"}
}

// set up the game canvas and context
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

// set up sound effects
var fxBrick = new Audio("assets/sounds/brick.wav");
var fxPaddle = new Audio("assets/sounds/paddle.wav");
var fxPowerup = new Audio("assets/sounds/powerup.wav");
var fxWall = new Audio("assets/sounds/wall.wav");

// game variables
var ball, balls = [], bricks = [], multiball, numOfBalls = 3, paddle, powerUps = [];
var gameOver, muted, paused, win;
var powerUpExtension = false, powerUpMulti = false, powerUpSticky = false, powerUpSuper = false;
var level, lives, score, scoreHigh, sound;
var numBricks, textSize, touchX;

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
var timeDelta, timeLast, timeMessageFrame;
requestAnimationFrame(loop);

function loop(timeNow) {
    if (!timeLast) { 
        timeLast = timeNow;
    }

    // calculate time difference
    timeDelta = (timeNow - timeLast) / 1000; // divided by thousand to set it in s instead of ms
    timeLast = timeNow;
    
    //update
    if(!gameOver) {
        if(!paused) {
        updatePaddle(timeDelta);
        updateBall(timeDelta);
        updateBricks(timeDelta);
        updatePowerUps(timeDelta);
        }
    }
    
    //draw
    drawBackGround();
    drawWalls();
    drawPowerUps();
    drawPaddle();
    drawBricks();
    drawText();
    drawBall();

    console.log(powerUpMulti);
           
    //call the next loop
    requestAnimationFrame(loop);
}

// update x and y velocities of the balls
function applyBallSpeed(angle) {
    if(!powerUpMulti){
        var ball = balls[2];
        ball.xv = ball.speed * Math.cos(angle);
        ball.yv = -ball.speed * Math.sin(angle);
    } else {
        for (i = numOfBalls -1; i >= 0; i--) {
            let minBounceAngle = MIN_BOUNCE_ANGLE / 180 * Math.PI;
            let range = Math.PI - minBounceAngle * 2;
            let angle = Math.random() * range + minBounceAngle; 
            var ball = balls[i];
            ball.xv = ball.speed * Math.cos(angle);
            ball.yv = -ball.speed * Math.sin(angle);
        }
    }
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
    textSize = rowH * MARGIN * 0.15;

    // column dimensions
    let totalSpaceX = width - wall * 2;
    let columnW = (totalSpaceX - gap) / BRICK_COLUMNS;
    let w = columnW - gap;

    // populate the bricks array
    bricks = [];
    let columns = BRICK_COLUMNS;
    let rows = BRICK_ROWS + level * 2;
    let color, left, top, rank, rankHigh, score, speedMult;
    numBricks = columns * rows;
    rankHigh = rows * 0.5 - 1;
    for (let i = 0; i < rows; i++) {
        bricks[i] = [];
        rank = Math.floor(i * 0.5);
        score = (rankHigh - rank) * 2 + 1;
        speedMult = 1 + (rankHigh - rank) / rankHigh * (BALL_SPEED_MAX - 1);
        color = getBrickColor(rank, rankHigh);
        top = wall + (MARGIN + i) * rowH;
        for (let j = 0; j < columns; j++) {
            left = wall + gap + j * columnW;
            bricks[i][j] = new Brick(left, top, w, h, color, score, speedMult);
        }
    }
}

function drawBackGround() {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0 , 0, canvas.width, canvas.height);
}

function clearDisplay() {
    ctx.clearRect(0, height * 0.13, width, textSize * 1.2);
}

function drawPaddle() {
    ctx.fillStyle = powerUpSticky ? COLOR_STICKYPADDLE : COLOR_PADDLE;
    ctx.fillRect(paddle.x - paddle.width * 0.5, paddle.y - paddle.height * 0.5, paddle.width, paddle.height);
}

function drawPowerUps() {
    ctx.lineWidth = wall * 0.35;
    for (let powerUp of powerUps) {
        ctx.fillStyle = powerUp.type.color;
        ctx.strokeStyle = powerUp.type.color;
        ctx.fillRect(powerUp.x - powerUp.w * 0.5, powerUp.y - powerUp.h * 0.5, powerUp.w, powerUp.h);
    }
}

function drawText() {
    ctx.fillStyle = COLOR_TEXT;

    // dimensions
    let labelSize = textSize * 0.9;
    let margin = wall * 2;
    let maxWidth = width - margin *2;
    let maxWidth1 = maxWidth * 0.2;
    let maxWidth2 = maxWidth * 0.2;
    let maxWidth3 = maxWidth * 0.2;
    let maxWidth4 = maxWidth * 0.2;
    let maxWidth5 = maxWidth * 0.2;
    let x1 = margin;
    let x2 = width * 0.25;
    let x3 = width * 0.5;
    let x4 = width * 0.75;
    let x5 = width - margin;
    let yLabel = wall + labelSize;
    let yValue = yLabel + textSize * 1.2;

    // labels
    ctx.font = labelSize + "px " + TEXT_FONT;
    ctx.textAlign = "left";
    ctx.fillText(TEXT_SCORE, x1, yLabel, maxWidth1);
    ctx.textAlign = "center";
    ctx.fillText(TEXT_LIVES, x2, yLabel, maxWidth2);
    ctx.fillText(TEXT_LEVEL, x3, yLabel, maxWidth3);
    ctx.fillText(TEXT_SCORE_HIGH, x4, yLabel, maxWidth4);
    ctx.textAlign = "right";
    ctx.fillText(TEXT_SOUND, x5, yLabel, maxWidth5);

    // values
    ctx.font = textSize + "px " + TEXT_FONT;
    ctx.textAlign = "left";
    ctx.fillText(score, x1, yValue, maxWidth1);
    ctx.textAlign = "center";
    ctx.fillText(lives, x2, yValue, maxWidth2);
    ctx.fillText(level, x3, yValue, maxWidth3);
    ctx.fillText(scoreHigh, x4, yValue, maxWidth4);
    ctx.textAlign = "right";
    ctx.fillText(sound, x5, yValue, maxWidth5);

    // game over
    if (gameOver) {
        let text = win ? TEXT_WIN : TEXT_GAME_OVER;
        ctx.font = textSize + "px " + TEXT_FONT;
        ctx.textAlign = "center";
        ctx.fillText(text, width * 0.5, height * 0.15, maxWidth);
    }

    // mute        
    if (muted) {
        sound = "OFF";  
    } else if (!muted) {
        sound = "ON";
    }

    // pause
    if(!gameOver) {
        if (paused) {
            let text = "PAUSED";
            ctx.font = textSize + "px " + TEXT_FONT;
            ctx.textAlign = "center";
            ctx.fillText(text, width * 0.5, height * 0.15, maxWidth);
         }    
    }
}

function drawBall() {
        if(!powerUpMulti) {
            var ball = balls[2];
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
            ctx.fillStyle = powerUpSuper ? COLOR_SUPERBALL : COLOR_BALL;
            ctx.fill();
            ctx.closePath();
        } else {
            for (i = numOfBalls -1; i >= 0; i--) {
                var ball = balls[i];
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
                ctx.fillStyle = powerUpSuper ? COLOR_SUPERBALL : COLOR_BALL;
                ctx.fill();
                ctx.closePath();
            }
        }   
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
    ctx.lineWidth = wall;
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

    if (fraction >= 0.25 && fraction <= 0.50) {
        r = 0;
        g = 149;
        b = 221;
    }

     if (fraction >= 0.50 && fraction <= 0.75) {
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
            if(gameOver) {
                newGame();
            }
            break;
        case 37: // left arrow for moving paddle to the left
            movePaddle(Direction.LEFT);
            break;
        case 39: // right arrow for moving paddle to the right
            movePaddle(Direction.RIGHT);
            break;
        case 77: // m button to mute the sounds
            toggleMute();
            break;
        case 80: // p button to pause the game
            togglePause();
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

function newBall() {
    powerUpExtension = false;
    powerUpSticky = false;
    powerUpSuper = false;
    powerUpMulti = false;
    // paddle = new Paddle();
    balls = [];
    for(let i = 0; i < numOfBalls; i++) {
        ball = new Ball();
        ball.x = Math.random() * width;
        balls.push(ball);
    }
    balls[2].x = paddle.x;
}

function newPaddle() {
    paddle = new Paddle();
}

function newGame() {
    gameOver = false;
    level = 0;
    lives = GAME_LIVES;
    score = 0;
    win = false;
    paddle = new Paddle();
    balls = [];
    
    // get  high score from local storage
    let scoreStr = localStorage.getItem(KEY_SCORE);
    if (scoreStr == null) {
        scoreHigh = 0;
    } else {
        scoreHigh = parseInt(scoreStr);
    }

    // start a new level
    newLevel();
}

function newLevel() {
    powerUps = [];
    touchX = null;
    newPaddle();
    newBall();
    createBricks();
}

function outOfBounds() {
    lives--;
    if (lives == 0) {
        gameOver = true;
    }
    newPaddle();
    newBall();
}

function serve() {
    // ball already in motion
    if (ball.yv != 0) {
        return false;
    }

    // random angle (not less than min bounce angle)
    let minBounceAngle = MIN_BOUNCE_ANGLE / 180 * Math.PI;
    let range = Math.PI - minBounceAngle * 2;
    let angle = Math.random() * range + minBounceAngle;
    applyBallSpeed(powerUpSticky ? Math.PI / 2 : angle);
    if(!muted) {
        fxPaddle.play();
    }
    return true;
}

function setDimensions() {
    height = window.innerHeight; // PIXELS
    width = window.innerWidth;
    wall = WALL * (height < width ? height : width);
    canvas.width = width;
    canvas.height = height;
    ctx.textBaseline = "middle";
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
        if(gameOver) {
             newGame();
        }
        return;
    }
    touchX = event.touches[0].clientX;
}

function togglePause() {
    if (!paused) {
        paused = true;
    } else if (paused) {
        paused = false;
    }
}

function toggleMute() {
    if (!muted) {
        muted = true;
    } else if (muted) {
        muted = false;
    }
}

function updateBall(delta) {
   
    for(let i = 0; i < numOfBalls; i++) {
        ball = balls[i];
        ball.x += ball.xv * delta;
        ball.y += ball.yv * delta;
    
    // bounce the ball off walls
    if (ball.x < wall + ball.radius * 0.5) {
        ball.x = wall + ball.radius * 0.5;
        ball.xv = -ball.xv;
        if(!muted) {
            fxWall.play();
        }
        // spinBall();
    } else if (ball.x > canvas.width - wall - ball.radius * 0.5) {
        ball.x = canvas.width - wall - ball.radius * 0.5;
        ball.xv = -ball.xv;
        if(!muted) {
            fxWall.play();
        }
        // spinBall();
    } else if (ball.y <  wall + ball.radius * 0.5) {
        ball.y <  wall + ball.radius * 0.5;
        ball.yv = -ball.yv;
        if(!muted) {
            fxWall.play();
        }
        // spinBall();
    }

    // bounce the ball off the paddle 
    if (ball.y > paddle.y - paddle.height * 0.5 - ball.radius * 0.5
        && ball.y < paddle.y
        && ball.x > paddle.x - paddle.width * 0.5 - ball.radius * 0.5
        && ball.x < paddle.x + paddle.width * 0.5 + ball.radius * 0.5
    ) {
        ball.y = paddle.y - paddle.height * 0.5 - ball.radius * 0.5;
        if (powerUpSticky){
            ball.xv = 0;
            ball.yv = 0;
        } else {
            ball.yv = -ball.yv;
            // spinBall();
        }
        if(!muted) {
            fxPaddle.play();
        }
    }
    
    // handle out of bounds
    if (ball.y > canvas.height) {
        outOfBounds();
    }
    }  
}


function updateBricks(delta) {

    // check for ball collisions
    OUTER: for (let i = 0; i < bricks.length; i++) {
        for(let j = 0; j < BRICK_COLUMNS; j++) {
            if (bricks[i][j] != null && bricks[i][j].intersect(ball)) {
                updateScore(bricks[i][j].score);
                ball.setSpeed(bricks[i][j].speedMult);

                // set ball to the edge of the brick
                if (ball.yv < 0) {
                    ball.y = bricks[i][j].bot + ball.radius * 0.5;
                } else {
                    ball.y = bricks[i][j].top - ball.radius * 0.5;
                }
                
                // create a powerup
                if (Math.random() <= POWERUP_CHANCE) {
                    let px = bricks[i][j].left + bricks[i][j].w / 2;
                    let py = bricks[i][j].top + bricks[i][j].h / 2;
                    let pSize = bricks[i][j].w / 10;
                    let pKeys = Object.keys(PowerUpType);
                    let pKey = pKeys[Math.floor(Math.random() * pKeys.length)];
                    powerUps.push(new PowerUp(px, py, pSize, PowerUpType[pKey]));
                }

                // bounce the ball (if not a superball) and destroy the brick
                if (!powerUpSuper) {
                ball.yv = -ball.yv;
                }
                bricks[i][j] = null;
                numBricks--;
                if(!muted) {
                    fxBrick.play();
                }
                spinBall();
                break OUTER;
            }
        }
    }

    // next level
    if (numBricks == 0) {
        if (level < MAX_LEVEL) {
            level++;
            newLevel();
        } else {
            gameOver = true;
            win = true;
            newPaddle();
            newBall();
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
    let lastPaddleX = paddle.x;
    paddle.x += paddle.xv * delta;

    // stop paddle at walls
    if (paddle.x < wall + paddle.width * 0.5) {
        paddle.x = wall + paddle.width * 0.5;
    } else if (paddle.x > canvas.width - wall - paddle.width * 0.5) {
        paddle.x = canvas.width - wall - paddle.width * 0.5;
    }


    // move the stationary ball with paddle
    if (ball.yv == 0) {
        ball.x += paddle.x - lastPaddleX;
    }
    
    // collect powerup
    for (let i = powerUps.length - 1; i >= 0; i--) {
        if (
            powerUps[i].x + powerUps[i].w * 0.5 > paddle.x - paddle.width * 0.5
            && powerUps[i].x - powerUps[i].w * 0.5 < paddle.x + paddle.width * 0.5
            && powerUps[i].y + powerUps[i].h * 0.5 > paddle.y + paddle.height * 0.5
            && powerUps[i].y - powerUps[i].h * 0.5 < paddle.y + paddle.height * 0.5
        ) {
            switch(powerUps[i].type) {
                case PowerUpType.EXTENSION:
                    // double the width of the paddle
                    if (powerUpExtension) {
                        score += POWERUP_BONUS;
                    } else {
                        powerUpExtension = true;
                        paddle.width *= 2;
                    }
                    break;                   
                case PowerUpType.LIFE:
                    // add a life
                    lives++;
                    break;
                case PowerUpType.STICKY:
                     if (powerUpSticky) {
                        score += POWERUP_BONUS;
                    } else {
                        powerUpSticky = true;
                    }
                    break;  
                case PowerUpType.SUPER:
                     if (powerUpSuper) {
                        score += POWERUP_BONUS;
                    } else {
                        powerUpSuper = true;
                    }
                    break;          
                case PowerUpType.MULTI:
                     if (powerUpMulti) {
                        score += POWERUP_BONUS;
                    } else {
                        powerUpMulti = true;
                        numOfBalls = 3;
                    }
                    break;
            }
            powerUps.splice(i, 1);
            if(!muted) {
                fxPowerup.play();
            }
        }
    }
}

function updatePowerUps(delta) {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        powerUps[i].y += powerUps[i].yv * delta;

        // delete off-screen powerups
        if (powerUps[i].y - powerUps[i].h * 0.5 > height) {
            powerUps.splice(i, 1);
        }
    }
}

function updateScore(brickScore) {
    score += brickScore;

    // check for a high score
    if (score > scoreHigh) {
        scoreHigh = score;
        localStorage.setItem(KEY_SCORE, scoreHigh);
    }
}

function Ball() {
    this.radius = wall / 2;
    this.x = paddle.x;
    this.y = paddle.y - paddle.height;
    this.speed = BALL_SPEED * height; 
    this.xv = 0;
    this.yv = 0;
   
    this.setSpeed = function(speedMult) {
    this.speed = Math.max(this.speed, BALL_SPEED * height * speedMult);
    }
}

function Brick(left, top, w, h, color, score, speedMult) {
    this.w = w;
    this.h = h;
    this.bot = top + h;
    this.left = left;
    this.right = left + w;
    this.top = top;
    this.color = color;
    this.score = score;
    this.speedMult = speedMult;

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
    this.height = wall * PADDLE_SIZE;
    this.x = canvas.width / 2;
    this.y = canvas.height - this.height * 3;
    this.speed = PADDLE_SPEED * width; 
    this.xv = 0;
}

function PowerUp(x, y, size, type) {
    this.w = size;
    this.h = size;
    this.x = x;
    this.y = y;
    this.type = type;
    this.yv = POWERUP_SPEED * height;
}