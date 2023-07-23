let ballX, ballY, ballSpeedX, ballSpeedY;
const brickRows = 4, brickCols = 4, brickWidth = 75, brickHeight = 20, brickPadding = 20, offsetLeft = 15, offsetTop = 25;
let bricks = [];
let score = 0;
let lives = 3;
let paddleWidth, paddleHeight, paddleX, paddleY, paddleSpeed;
const ballRadius = 12.5; // Radius of the ball

function setup() {
  createCanvas(400, 400);

  ballX = width / 2;
  ballY = height / 2 + 20;
  ballSpeedX = 2;
  ballSpeedY = 2;

  paddleWidth = 90;
  paddleHeight = 15;
  paddleX = width / 2 - paddleWidth / 2;
  paddleY = height - paddleHeight - ballRadius;
  paddleSpeed = 5;

  for (let c = 0; c < brickCols; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRows; r++) {
      bricks[c][r] = { x: offsetLeft + c * (brickWidth + brickPadding), y: offsetTop + r * (brickHeight + brickPadding), hidden: false };
    }
  }
}

function startOver() {
  ballX = width / 2;
  ballY = height / 2 + 20;
  ballSpeedX = 2;
  ballSpeedY = 2;
  paddleX = width / 2 - paddleWidth / 2;
  paddleY = height - paddleHeight - ballRadius;
}

function checkEdges() {
  if (ballY - ballRadius <= 0) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX + ballRadius >= width || ballX - ballRadius <= 0) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballY + ballRadius >= height) {
    lives--;
    if (lives > 0) {
      startOver();
    } else {
      gameOver();
    }
  }
}

function paddleBounce() {
  if (
    ballX + ballRadius >= paddleX &&
    ballX - ballRadius <= paddleX + paddleWidth &&
    ballY + ballRadius >= paddleY &&
    ballY - ballRadius <= paddleY + paddleHeight &&
    ballSpeedY > 0
  ) {
    ballSpeedY = -ballSpeedY;
  }
}

function brickContact() {
  for (let r = 0; r < brickRows; r++) {
    for (let c = 0; c < brickCols; c++) {
      const brick = bricks[c][r];
      if (!brick.hidden) {
        if (
          ballX + ballRadius >= brick.x &&
          ballX - ballRadius <= brick.x + brickWidth &&
          ballY + ballRadius >= brick.y &&
          ballY - ballRadius <= brick.y + brickHeight
        ) {
          ballSpeedY = -ballSpeedY;
          brick.hidden = true;
          score++;
        }
      }
    }
  }
}

function drawBricks() {
  for (let r = 0; r < brickRows; r++) {
    for (let c = 0; c < brickCols; c++) {
      const brick = bricks[c][r];
      if (!brick.hidden) {
        fill("#3399FF80");
        rect(brick.x, brick.y, brickWidth, brickHeight);
      }
    }
  }
}

function drawPaddle() {
  fill("grey");
  rect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function gameOver() {
  background("black");
  textSize(30);
  fill("white");
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
}

function draw() {
  background("black");

  if (lives <= 0) {
    gameOver();
    return;
  }

  textSize(15);
  fill("white");
  text('Score: ' + score.toString() + ' Lives: ' + lives.toString(), 10, 20);

  drawBricks();
  drawPaddle();

  ellipse(ballX, ballY, ballRadius * 2);

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  checkEdges();

  if (keyIsDown(LEFT_ARROW)) {
    paddleX = constrain(paddleX - paddleSpeed, 0, width - paddleWidth);
  }

  if (keyIsDown(RIGHT_ARROW)) {
    paddleX = constrain(paddleX + paddleSpeed, 0, width - paddleWidth);
  }

  paddleBounce();
  brickContact();
}
