// Tetris Game Implementation
const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

// Game variables
let grid;
let currentPiece;
let nextPiece;
let score = 0;
let lines = 0;
let level = 1;
let gameOver = false;
let paused = false;
let gameLoop;

// Game constants
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 24;

// Tetris pieces with rotations
const TETROMINOS = {
    I: {
        shape: [
            [[0, 1, 0, 0],
             [0, 1, 0, 0],
             [0, 1, 0, 0],
             [0, 1, 0, 0]],
            [[0, 0, 0, 0],
             [1, 1, 1, 1],
             [0, 0, 0, 0],
             [0, 0, 0, 0]],
            [[0, 0, 1, 0],
             [0, 0, 1, 0],
             [0, 0, 1, 0],
             [0, 0, 1, 0]],
            [[0, 0, 0, 0],
             [0, 0, 0, 0],
             [1, 1, 1, 1],
             [0, 0, 0, 0]]
        ],
        color: '#00ffff'
    },
    O: {
        shape: [
            [[1, 1],
             [1, 1]]
        ],
        color: '#ffff00'
    },
    T: {
        shape: [
            [[0, 1, 0],
             [1, 1, 1],
             [0, 0, 0]],
            [[0, 1, 0],
             [0, 1, 1],
             [0, 1, 0]],
            [[0, 0, 0],
             [1, 1, 1],
             [0, 1, 0]],
            [[0, 1, 0],
             [1, 1, 0],
             [0, 1, 0]]
        ],
        color: '#a020f0'
    },
    S: {
        shape: [
            [[0, 1, 1],
             [1, 1, 0],
             [0, 0, 0]],
            [[0, 1, 0],
             [0, 1, 1],
             [0, 0, 1]],
            [[0, 0, 0],
             [0, 1, 1],
             [1, 1, 0]],
            [[1, 0, 0],
             [1, 1, 0],
             [0, 1, 0]]
        ],
        color: '#00ff00'
    },
    Z: {
        shape: [
            [[1, 1, 0],
             [0, 1, 1],
             [0, 0, 0]],
            [[0, 0, 1],
             [0, 1, 1],
             [0, 1, 0]],
            [[0, 0, 0],
             [1, 1, 0],
             [0, 1, 1]],
            [[0, 1, 0],
             [1, 1, 0],
             [1, 0, 0]]
        ],
        color: '#ff0000'
    },
    J: {
        shape: [
            [[1, 0, 0],
             [1, 1, 1],
             [0, 0, 0]],
            [[0, 1, 1],
             [0, 1, 0],
             [0, 1, 0]],
            [[0, 0, 0],
             [1, 1, 1],
             [0, 0, 1]],
            [[0, 1, 0],
             [0, 1, 0],
             [1, 1, 0]]
        ],
        color: '#0000ff'
    },
    L: {
        shape: [
            [[0, 0, 1],
             [1, 1, 1],
             [0, 0, 0]],
            [[0, 1, 0],
             [0, 1, 0],
             [0, 1, 1]],
            [[0, 0, 0],
             [1, 1, 1],
             [1, 0, 0]],
            [[1, 1, 0],
             [0, 1, 0],
             [0, 1, 0]]
        ],
        color: '#ffa500'
    }
};

// Initialize game
function initGame() {
    // Create grid
    grid = [];
    for (let row = 0; row < ROWS; row++) {
        grid[row] = [];
        for (let col = 0; col < COLS; col++) {
            grid[row][col] = null;
        }
    }

    // Reset variables
    score = 0;
    lines = 0;
    level = 1;
    gameOver = false;
    paused = false;

    // Create first pieces
    currentPiece = createPiece();
    nextPiece = createPiece();

    // Update UI
    updateScore();
    updateLines();
    updateLevel();
    drawNextPiece();

    // Hide screens
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameoverScreen').style.display = 'none';
    document.getElementById('pauseScreen').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'block';

    // Start game loop
    startGameLoop();
}

// Create random Tetris piece
function createPiece() {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const tetromino = TETROMINOS[randomPiece];
    
    return {
        type: randomPiece,
        shape: tetromino.shape[0],
        rotation: 0,
        x: Math.floor(COLS / 2) - Math.floor(tetromino.shape[0][0].length / 2),
        y: 0,
        color: tetromino.color
    };
}

// Start game loop
function startGameLoop() {
    const dropInterval = 1000 / level;
    let lastDropTime = 0;
    
    gameLoop = (timestamp) => {
        if (paused || gameOver) {
            if (!gameOver) {
                requestAnimationFrame(gameLoop);
            }
            return;
        }

        if (timestamp - lastDropTime > dropInterval) {
            moveDown();
            lastDropTime = timestamp;
        }

        drawGame();
        requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
}

// Draw game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let row = 0; row <= ROWS; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, row * BLOCK_SIZE);
        ctx.stroke();
    }
    for (let col = 0; col <= COLS; col++) {
        ctx.beginPath();
        ctx.moveTo(col * BLOCK_SIZE, 0);
        ctx.lineTo(col * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
    }

    // Draw grid blocks
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (grid[row][col]) {
                drawBlock(col, row, grid[row][col]);
            }
        }
    }

    // Draw current piece
    if (currentPiece) {
        drawPiece(currentPiece);
    }
}

// Draw block
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    
    // Add highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE / 3);
}

// Draw piece
function drawPiece(piece) {
    const { shape, x, y, color } = piece;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                drawBlock(x + col, y + row, color);
            }
        }
    }
}

// Draw next piece
function drawNextPiece() {
    // Clear canvas
    nextCtx.fillStyle = '#000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    // Draw piece
    const piece = nextPiece;
    const { shape, color } = piece;
    const offsetX = (nextCanvas.width - shape[0].length * NEXT_BLOCK_SIZE) / 2;
    const offsetY = (nextCanvas.height - shape.length * NEXT_BLOCK_SIZE) / 2;

    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                nextCtx.fillStyle = color;
                nextCtx.fillRect(
                    offsetX + col * NEXT_BLOCK_SIZE + 1,
                    offsetY + row * NEXT_BLOCK_SIZE + 1,
                    NEXT_BLOCK_SIZE - 2,
                    NEXT_BLOCK_SIZE - 2
                );
                
                // Add highlight
                nextCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                nextCtx.fillRect(
                    offsetX + col * NEXT_BLOCK_SIZE + 1,
                    offsetY + row * NEXT_BLOCK_SIZE + 1,
                    NEXT_BLOCK_SIZE - 2,
                    NEXT_BLOCK_SIZE / 3
                );
            }
        }
    }
}

// Check collision
function checkCollision(piece, offsetX = 0, offsetY = 0) {
    const { shape, x, y } = piece;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col + offsetX;
                const newY = y + row + offsetY;

                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }

                if (newY >= 0 && grid[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Lock piece
function lockPiece() {
    const { shape, x, y, color } = currentPiece;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const gridY = y + row;
                const gridX = x + col;
                if (gridY >= 0) {
                    grid[gridY][gridX] = color;
                }
            }
        }
    }

    // Clear lines
    clearLines();

    // Get next piece
    currentPiece = nextPiece;
    nextPiece = createPiece();
    drawNextPiece();

    // Check game over
    if (checkCollision(currentPiece)) {
        endGame();
    }
}

// Clear lines
function clearLines() {
    let linesCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        if (grid[row].every(cell => cell !== null)) {
            // Remove line
            grid.splice(row, 1);
            // Add new empty line at top
            grid.unshift(new Array(COLS).fill(null));
            linesCleared++;
            // Check same row again
            row++;
        }
    }

    if (linesCleared > 0) {
        // Calculate score
        const points = [0, 40, 100, 300, 1200];
        score += points[linesCleared] * level;
        lines += linesCleared;
        level = Math.floor(lines / 10) + 1;

        updateScore();
        updateLines();
        updateLevel();
    }
}

// Move piece down
function moveDown() {
    if (!checkCollision(currentPiece, 0, 1)) {
        currentPiece.y++;
    } else {
        lockPiece();
    }
}

// Move piece left
function moveLeft() {
    if (!checkCollision(currentPiece, -1, 0)) {
        currentPiece.x--;
    }
}

// Move piece right
function moveRight() {
    if (!checkCollision(currentPiece, 1, 0)) {
        currentPiece.x++;
    }
}

// Rotate piece
function rotate() {
    const tetromino = TETROMINOS[currentPiece.type];
    const nextRotation = (currentPiece.rotation + 1) % tetromino.shape.length;
    const nextShape = tetromino.shape[nextRotation];

    const previousShape = currentPiece.shape;
    currentPiece.shape = nextShape;
    currentPiece.rotation = nextRotation;

    // Wall kick
    let offset = 0;
    if (checkCollision(currentPiece)) {
        if (currentPiece.x > COLS / 2) {
            offset = -1;
        } else {
            offset = 1;
        }
        currentPiece.x += offset;
        if (checkCollision(currentPiece)) {
            currentPiece.x -= offset * 2;
            if (checkCollision(currentPiece)) {
                currentPiece.x += offset;
                currentPiece.shape = previousShape;
                currentPiece.rotation = (currentPiece.rotation - 1 + tetromino.shape.length) % tetromino.shape.length;
            }
        }
    }
}

// Hard drop
function hardDrop() {
    while (!checkCollision(currentPiece, 0, 1)) {
        currentPiece.y++;
    }
    lockPiece();
}

// Update UI
function updateScore() {
    document.querySelector('.score-number').textContent = score;
}

function updateLines() {
    document.querySelector('.lines-number').textContent = lines;
}

function updateLevel() {
    document.querySelector('.level-number').textContent = level;
}

// End game
function endGame() {
    gameOver = true;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLines').textContent = lines;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('gameoverScreen').style.display = 'flex';
}

// Pause/Resume
function togglePause() {
    if (gameOver) return;
    
    paused = !paused;
    if (paused) {
        document.getElementById('pauseScreen').style.display = 'flex';
    } else {
        document.getElementById('pauseScreen').style.display = 'none';
        startGameLoop();
    }
}

// Event listeners
document.getElementById('startBtn').addEventListener('click', initGame);
document.getElementById('resumeBtn').addEventListener('click', togglePause);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', initGame);
document.getElementById('retryBtn').addEventListener('click', initGame);
document.getElementById('quitBtn').addEventListener('click', () => {
    window.location.href = '../categories/index.html';
});
document.getElementById('menuBtn').addEventListener('click', () => {
    window.location.href = '../categories/index.html';
});
document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = '../main.html';
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (gameOver || paused) return;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            moveLeft();
            break;
        case 'ArrowRight':
            e.preventDefault();
            moveRight();
            break;
        case 'ArrowDown':
            e.preventDefault();
            moveDown();
            break;
        case 'ArrowUp':
            e.preventDefault();
            rotate();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
        case 'p':
        case 'P':
            e.preventDefault();
            togglePause();
            break;
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    if (gameOver || paused) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener('touchend', (e) => {
    if (gameOver || paused) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 30) {
            moveRight();
        } else if (deltaX < -30) {
            moveLeft();
        }
    } else {
        // Vertical swipe
        if (deltaY > 30) {
            moveDown();
        } else if (deltaY < -30) {
            rotate();
        }
    }
});

// Initialize canvas
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
nextCtx.fillStyle = '#000';
nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
