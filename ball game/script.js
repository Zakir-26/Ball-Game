 // Get canvas and context
 const canvas = document.getElementById('gameCanvas');
 const ctx = canvas.getContext('2d');

 // Set initial values
 let ballX = canvas.width / 2;
 let ballY = canvas.height / 6;
 let ballRadius = 15;
 let ballSpeed = 2;
 let gameOver = false;
 let paused = false;
 let score = 0;
 let highScore =0;

 // Update high score button text
 document.getElementById('highScoreButton').textContent = `High Score: ${highScore}`;
 
 // Add gravity
 let gravity = 0.05625;

 // Add obstacles
 let obstacles = [];
 let obstacleSpeed = 2.5;
 let obstacleWidth = 50;
 let obstacleHeight = 10;
 let obstacleSpawnRate = 40; // in frames
 let frameCount = 0;
 
// Add event listener for user input
 document.addEventListener('click', () => {
   if (!gameOver&&!paused) {
     // Move ball upwards when user clicks
     ballSpeed = -3.0;
     score++;
     updateScore();
     updateHighScore ();
     
   }
 });
 

 // Add event listener for restart button
 document.getElementById('restartButton').addEventListener('click', () => {
   // Reset game state
   ballX = canvas.width / 2;
   ballY = canvas.height / 2;
   gameOver = false;
   paused = false;
   score = 0;
   updateScore();
   obstacles = [];

   // Start game loop
   gameLoop();
 });

 // Add event listener for pause button
 document.getElementById('pauseButton').addEventListener('click', () => {
   // Toggle paused state
   paused = !paused;

   // Update pause button text
   document.getElementById('pauseButton').textContent = paused ? 'Resume' : 'Pause';

   // Continue game loop if not paused
   if (!paused) {
     gameLoop();
   }
 });

 function updateScore() {
     document.getElementById('score').textContent = `Score: ${score}`;
 }
 
function updateHighScore() {
     if (score > highScore) {
         highScore = score;
         document.getElementById('highScoreButton').textContent = `High Score: ${highScore}`;
     }
}


 function spawnObstacle() {
     const y = Math.random() * (canvas.height - obstacleHeight);
     const obstacle = {x: canvas.width, y, width: obstacleWidth, height: obstacleHeight};
     obstacles.push(obstacle);
 }

 function updateObstacles() {
     obstacles.forEach(obstacle => {
         obstacle.x -= obstacleSpeed;
     });

     obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
 }

 function drawObstacles() {
     ctx.fillStyle = 'brown';
     obstacles.forEach(obstacle => {
         ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
     });
 }

 function checkCollision() {
     obstacles.forEach(obstacle => {
         if (ballX + ballRadius > obstacle.x && ballX - ballRadius < obstacle.x + obstacle.width &&
             ballY + ballRadius > obstacle.y && ballY - ballRadius < obstacle.y + obstacle.height) {
             gameOver = true;
             updateHighScore();
             alert(`Game Over! Your final score is ${score}`);
             return;
         }
     });
 }

// Game loop
function gameLoop() {
  if (!paused && !gameOver) {
    requestAnimationFrame(gameLoop);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky background
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cloud
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(50, 50, 20, 0, Math.PI * 2);
    ctx.arc(70, 50, 20, 0, Math.PI * 2);
    ctx.arc(90, 50, 20, 0, Math.PI * 2);
    ctx.arc(60, 70, 20, 0, Math.PI * 2);
    ctx.arc(80, 70, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.closePath();

    // Draw top and bottom borders
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, ballRadius);
    ctx.fillRect(0, canvas.height - ballRadius, canvas.width, ballRadius);
    ctx.closePath();

    // Draw obstacles
    drawObstacles();

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();

    // Update ball position
    ballY += ballSpeed;
    ballSpeed += gravity;

    // Check for collision with top and bottom borders
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
      gameOver = true;
      alert(`Game Over! Your final score is ${score}`);
      return;
    }

    // Check for collision with obstacles
    checkCollision();

    // Update obstacles
    updateObstacles();
    frameCount++;
    if (frameCount % obstacleSpawnRate === 0) {
      spawnObstacle();
      frameCount = 0;
    }
  }
}

// Start game loop
gameLoop();