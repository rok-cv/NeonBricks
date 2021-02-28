var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//sprememenljivke
var x = canvas.width / 2;
var y = canvas.height - 30;

//premik
var dx = 2.5;
var dy = -2.5;

//obseg žogice
var ballRadius = 8;

//plošček
var paddleHeight = 7;
var paddleWidth = 80;
var paddleX = (canvas.width - paddleWidth) / 2;

//tipke
var rightPressed = false;
var leftPressed = false;

//barva žogice
var color = getRandomColor();

//točke
var score = 0;

//življenja
var lives = 3;

var play;
var interval = false;

//kocke
var brickRowCount = 6;
var brickColumnCount = 5;
var brickWidth = 65;
var brickHeight = 8;
var brickPadding = 10;
var brickFromTop = 25;
var brickFromSide = 27;
//kreiranje tabele
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//izris kock
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding + 15) + brickFromSide;
        var brickY = r * (brickWidth + brickPadding - 43) + brickFromTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#00ffff";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
//podiranje kock
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var detect = bricks[c][r];
      if (detect.status == 1) {
        if (
          x > detect.x &&
          x < detect.x + brickWidth + 2 &&
          y > detect.y &&
          y < detect.y + brickHeight + 3
        ) {
          dy = -dy;
          detect.status = 0;
          color = getRandomColor();
          score += 14;
          if (score == brickColumnCount * brickRowCount * 14) {
            detect.status = 0;
            if (true) {
              swal("YOU WIN! \n SCORE: " + score);
              play = false;
            }
          }
        }
      }
    }
  }
}

//izris Žogice
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

//izris ploščka
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

//sprememba barve žogice
function getRandomColor() {
  var letters = "CDF89630".split("");
  var color = "#";
  for (var i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

//štetje točk
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#bbff99";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#bbff99";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

//izrisovanje
function draw() {
  if (play != false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();

    //premik žogice
    x += dx;
    y += dy;

    //L, D rob
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    //S, Z rob
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth + paddleHeight) {
        dx = 8 * ((x - (paddleX + paddleWidth / 2)) / paddleWidth);
        dy = -dy;
      } else {
        lives--;
        if (!lives) {
          swal("GAME OVER!");
          play = false;
          //document.location.reload();
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2.5;
          dy = -2.5;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }

    //plošček desno
    if (rightPressed) {
      paddleX += 6;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    }
    //plošček levo
    if (leftPressed) {
      paddleX -= 6;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }
    if (interval != false) {
      requestAnimationFrame(draw);
    }
  } else {
  }
}

//sledenje klikom
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//pritisnjen
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}
//ne pritisnjen
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }

  //sledenje miški
  document.addEventListener("mousemove", mouseMoveHandler, true);

  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }
}

draw();

function start() {
  play = true;
  interval = true;
  draw();
}

function stop() {
  play = false;
}

function ins() {
  play = false;
  swal(
    "WELLCOME!",
    "Tap START to play the game. Use left and right arrow keys to move or drag the puddle with your mouse."
  );
}
