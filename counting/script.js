// Game state
let gameState = 'welcome'; // welcome, playing, paused, complete, gameover
let level = 1;
let score = 0;
let lives = 3;
let hints = 3;
let currentCard = null;
let gameTimer = null;
let startTime = null;
let levelTime = 0;
let cardPairs = 0;
let matchedPairs = 0;

// DOM elements
const welcomeScreen = document.getElementById('welcomeScreen');
const gameBoard = document.getElementById('gameBoard');
const completeScreen = document.getElementById('completeScreen');
const gameoverScreen = document.getElementById('gameoverScreen');
const progressFill = document.getElementById('progressFill');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const homeBtn = document.getElementById('homeBtn');
const hintBtn = document.getElementById('hintBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const replayBtn = document.getElementById('replayBtn');
const menuBtn = document.getElementById('menuBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const quitGameBtn = document.getElementById('quitGameBtn');

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    homeBtn.addEventListener('click', goHome);
    hintBtn.addEventListener('click', useHint);
    nextLevelBtn.addEventListener('click', nextLevel);
    replayBtn.addEventListener('click', replayLevel);
    menuBtn.addEventListener('click', goHome);
    tryAgainBtn.addEventListener('click', startGame);
    quitGameBtn.addEventListener('click', goHome);
    
    // Number card listeners
    document.querySelectorAll('.number-card').forEach(card => {
        card.addEventListener('click', () => flipCard(card));
    });
    
    // Show welcome screen
    showWelcomeScreen();
});

// Start game
function startGame() {
    gameState = 'playing';
    level = 1;
    score = 0;
    lives = 3;
    hints = 3;
    matchedPairs = 0;
    cardPairs = 4;
    levelTime = 0;
    
    updateStats();
    resetCards();
    showGameBoard();
    
    // Start timer
    startTime = Date.now();
    gameTimer = setInterval(updateTimer, 1000);
}

// Show welcome screen
function showWelcomeScreen() {
    welcomeScreen.style.display = 'block';
    gameBoard.style.display = 'none';
    completeScreen.style.display = 'none';
    gameoverScreen.style.display = 'none';
}

// Show game board
function showGameBoard() {
    welcomeScreen.style.display = 'none';
    gameBoard.style.display = 'block';
    completeScreen.style.display = 'none';
    gameoverScreen.style.display = 'none';
}

// Show level complete screen
function showCompleteScreen() {
    welcomeScreen.style.display = 'none';
    gameBoard.style.display = 'none';
    completeScreen.style.display = 'block';
    gameoverScreen.style.display = 'none';
}

// Show game over screen
function showGameOverScreen() {
    welcomeScreen.style.display = 'none';
    gameBoard.style.display = 'none';
    completeScreen.style.display = 'none';
    gameoverScreen.style.display = 'block';
}

// Update stats
function updateStats() {
    document.querySelector('.level-number').textContent = level;
    document.querySelector('.score-number').textContent = score;
    document.querySelector('.lives-number').textContent = '❤️'.repeat(lives);
    document.querySelector('.hint-count').textContent = `(${hints})`;
    
    // Update progress
    const progress = Math.round((matchedPairs / cardPairs) * 100);
    progressFill.style.width = progress + '%';
    document.querySelector('.progress-percentage').textContent = progress + '%';
}

// Reset cards
function resetCards() {
    document.querySelectorAll('.number-card').forEach(card => {
        card.classList.remove('flipped', 'matched', 'correct', 'incorrect');
    });
}

// Flip card
function flipCard(card) {
    if (gameState !== 'playing') return;
    if (card.classList.contains('flipped')) return;
    if (currentCard === card) return;
    
    card.classList.add('flipped');
    
    // Check for match
    if (!currentCard) {
        currentCard = card;
    } else {
        checkMatch(currentCard, card);
        currentCard = null;
    }
}

// Check match
function checkMatch(card1, card2) {
    const num1 = parseInt(card1.dataset.number);
    const num2 = parseInt(card2.dataset.number);
    
    if (num1 === num2) {
        // Match
        card1.classList.add('matched', 'correct');
        card2.classList.add('matched', 'correct');
        matchedPairs++;
        score += 10;
        
        // Check if level complete
        if (matchedPairs === cardPairs) {
            setTimeout(levelComplete, 500);
        }
    } else {
        // No match
        card1.classList.add('incorrect');
        card2.classList.add('incorrect');
        lives--;
        
        // Flip back after delay
        setTimeout(() => {
            card1.classList.remove('flipped', 'incorrect');
            card2.classList.remove('flipped', 'incorrect');
        }, 1000);
        
        // Check if game over
        if (lives === 0) {
            setTimeout(gameOver, 500);
        }
    }
    
    updateStats();
}

// Level complete
function levelComplete() {
    gameState = 'complete';
    clearInterval(gameTimer);
    showCompleteScreen();
}

// Game over
function gameOver() {
    gameState = 'gameover';
    clearInterval(gameTimer);
    showGameOverScreen();
}

// Pause game
function pauseGame() {
    if (gameState === 'playing') {
        gameState = 'paused';
        clearInterval(gameTimer);
        pauseBtn.textContent = '▶️';
    } else if (gameState === 'paused') {
        gameState = 'playing';
        startTime = Date.now() - (levelTime * 1000);
        gameTimer = setInterval(updateTimer, 1000);
        pauseBtn.textContent = '⏸️';
    }
}

// Go home
function goHome() {
    gameState = 'welcome';
    clearInterval(gameTimer);
    showWelcomeScreen();
}

// Use hint
function useHint() {
    if (gameState !== 'playing' || hints === 0) return;
    
    // Find unflipped cards
    const unflippedCards = Array.from(document.querySelectorAll('.number-card:not(.flipped):not(.matched)'));
    if (unflippedCards.length > 0) {
        const randomCard = unflippedCards[Math.floor(Math.random() * unflippedCards.length)];
        randomCard.classList.add('flipped');
        hints--;
        updateStats();
    }
}

// Next level
function nextLevel() {
    level++;
    score = 0;
    lives = 3;
    hints = 3;
    matchedPairs = 0;
    cardPairs = Math.min(4 + level * 2, 12);
    levelTime = 0;
    
    updateStats();
    resetCards();
    showGameBoard();
    
    // Start timer
    startTime = Date.now();
    gameTimer = setInterval(updateTimer, 1000);
}

// Replay level
function replayLevel() {
    score = 0;
    lives = 3;
    hints = 3;
    matchedPairs = 0;
    levelTime = 0;
    
    updateStats();
    resetCards();
    showGameBoard();
    
    // Start timer
    startTime = Date.now();
    gameTimer = setInterval(updateTimer, 1000);
}

// Update timer
function updateTimer() {
    levelTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(levelTime / 60);
    const seconds = levelTime % 60;
}

// Auto-flip cards for demonstration
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.querySelectorAll('.number-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('flipped');
                setTimeout(() => {
                    card.classList.remove('flipped');
                }, 1500);
            }, index * 500);
        });
    }, 1000);
});