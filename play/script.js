// Game State
let gameState = 'welcome'; // welcome, playing, paused, complete, gameover
let score = 0;
let level = 1;
let lives = 3;
let hintsRemaining = 3;
let progress = 0;
let flippedCards = [];
let matchedPairs = 0;
let gameTimer;
let timeElapsed = 0;

// DOM Elements - will be initialized on DOMContentLoaded
let welcomeScreen, gameBoard, pauseScreen, completeScreen, gameoverScreen;
let startBtn, pauseBtn, homeBtn, resumeBtn, restartBtn, quitBtn, nextLevelBtn, replayBtn, menuBtn, tryAgainBtn, quitGameBtn, hintBtn;
let wordCards, progressFill, levelNumber, scoreNumber, livesNumber;

// Initialize game
function initGame() {
    gameState = 'welcome';
    score = 0;
    level = 1;
    lives = 3;
    hintsRemaining = 3;
    progress = 0;
    flippedCards = [];
    matchedPairs = 0;
    timeElapsed = 0;
    
    // Update UI
    scoreNumber.textContent = score;
    levelNumber.textContent = level;
    livesNumber.textContent = '❤️'.repeat(lives);
    progressFill.style.width = '0%';
    document.querySelector('.progress-percentage').textContent = '0%';
    hintBtn.querySelector('.hint-count').textContent = `(${hintsRemaining})`;
    
    // Reset cards
    wordCards.forEach(card => {
        card.classList.remove('flipped', 'matched', 'wrong');
    });
    
    // Show welcome screen
    showScreen('welcome');
}

// Show specific screen
function showScreen(screen) {
    console.log('showScreen called with screen:', screen); // Debug log
    
    // Hide all screens
    welcomeScreen.style.display = 'none';
    gameBoard.style.display = 'none';
    pauseScreen.style.display = 'none';
    completeScreen.style.display = 'none';
    gameoverScreen.style.display = 'none';
    
    // Show selected screen
    switch(screen) {
        case 'welcome':
            welcomeScreen.style.display = 'block';
            console.log('Welcome screen shown'); // Debug log
            break;
        case 'playing':
            gameBoard.style.display = 'block';
            console.log('Game board shown'); // Debug log
            startTimer();
            break;
        case 'paused':
            pauseScreen.style.display = 'block';
            console.log('Pause screen shown'); // Debug log
            pauseTimer();
            break;
        case 'complete':
            completeScreen.style.display = 'block';
            console.log('Complete screen shown'); // Debug log
            pauseTimer();
            break;
        case 'gameover':
            gameoverScreen.style.display = 'block';
            console.log('Game over screen shown'); // Debug log
            pauseTimer();
            break;
        default:
            console.log('Unknown screen:', screen); // Debug log
    }
}



// Flip card
function flipCard(card) {
    console.log('Flipping card:', card);
    
    // Directly toggle card faces for debugging
    const cardFront = card.querySelector('.card-front');
    const cardBack = card.querySelector('.card-back');
    
    if (cardFront && cardBack) {
        if (card.classList.contains('flipped')) {
            // Show front
            cardFront.style.opacity = '1';
            cardBack.style.opacity = '0';
            card.classList.remove('flipped');
        } else {
            // Show back
            cardFront.style.opacity = '0';
            cardBack.style.opacity = '1';
            card.classList.add('flipped');
        }
    }
    
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Check for match
function checkMatch() {
    const [card1, card2] = flippedCards;
    const word1 = card1.dataset.word;
    const word2 = card2.dataset.word;
    
    if (word1 === word2) {
        // Match found
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            matchedPairs++;
            updateScore(10);
            updateProgress();
            
            // Check if level complete
            if (matchedPairs === wordCards.length / 2) {
                setTimeout(() => {
                    showScreen('complete');
                }, 1000);
            }
        }, 500);
    } else {
        // No match
        setTimeout(() => {
            card1.classList.add('wrong');
            card2.classList.add('wrong');
            
            setTimeout(() => {
                card1.classList.remove('flipped', 'wrong');
                card2.classList.remove('flipped', 'wrong');
                flippedCards = [];
                loseLife();
            }, 500);
        }, 500);
    }
}

// Update score
function updateScore(points) {
    score += points;
    scoreNumber.textContent = score;
}

// Update progress
function updateProgress() {
    const progressPercentage = (matchedPairs / (wordCards.length / 2)) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    document.querySelector('.progress-percentage').textContent = `${Math.round(progressPercentage)}%`;
}

// Lose life
function loseLife() {
    lives--;
    livesNumber.textContent = '❤️'.repeat(lives);
    
    if (lives === 0) {
        showScreen('gameover');
    }
}

// Use hint
function useHint() {
    hintsRemaining--;
    hintBtn.querySelector('.hint-count').textContent = `(${hintsRemaining})`;
    
    // Find an unmatched card
    const unmatchedCards = Array.from(wordCards).filter(card => !card.classList.contains('matched'));
    
    if (unmatchedCards.length > 0) {
        // Highlight a card
        const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
        randomCard.style.transform = 'scale(1.05)';
        randomCard.style.border = '3px solid #06d6a0';
        
        setTimeout(() => {
            randomCard.style.transform = 'scale(1)';
            randomCard.style.border = 'none';
        }, 2000);
    }
}

// Timer functions
function startTimer() {
    gameTimer = setInterval(() => {
        timeElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(gameTimer);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    // Timer display would go here
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (gameState === 'playing') {
            gameState = 'paused';
            showScreen('paused');
        } else if (gameState === 'paused') {
            gameState = 'playing';
            showScreen('playing');
        }
    } else if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'welcome') {
            startBtn.click();
        } else if (gameState === 'paused') {
            resumeBtn.click();
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Initialize DOM Elements
    welcomeScreen = document.getElementById('welcomeScreen');
    gameBoard = document.getElementById('gameBoard');
    pauseScreen = document.getElementById('pauseScreen');
    completeScreen = document.getElementById('completeScreen');
    gameoverScreen = document.getElementById('gameoverScreen');

    startBtn = document.getElementById('startBtn');
    console.log('startBtn:', startBtn); // Debug log
    
    pauseBtn = document.getElementById('pauseBtn');
    homeBtn = document.getElementById('homeBtn');
    resumeBtn = document.getElementById('resumeBtn');
    restartBtn = document.getElementById('restartBtn');
    quitBtn = document.getElementById('quitBtn');
    nextLevelBtn = document.getElementById('nextLevelBtn');
    replayBtn = document.getElementById('replayBtn');
    menuBtn = document.getElementById('menuBtn');
    tryAgainBtn = document.getElementById('tryAgainBtn');
    quitGameBtn = document.getElementById('quitGameBtn');
    hintBtn = document.getElementById('hintBtn');

    wordCards = document.querySelectorAll('.word-card');
    progressFill = document.getElementById('progressFill');
    levelNumber = document.querySelector('.level-number');
    scoreNumber = document.querySelector('.score-number');
    livesNumber = document.querySelector('.lives-number');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize game
    initGame();
    
    // Auto-start the game for testing purposes
    console.log('Auto-starting game...');
    setTimeout(() => {
        gameState = 'playing';
        showScreen('playing');
        
        // Auto-flip cards after delay to demonstrate functionality
        setTimeout(() => {
            const firstCard = wordCards[0];
            console.log('Auto-flipping first card:', firstCard);
            flipCard(firstCard);
            
            // Check if flipped class was applied
            setTimeout(() => {
                console.log('First card has flipped class:', firstCard.classList.contains('flipped'));
                console.log('First card classes:', firstCard.className);
            }, 100);
            
            // Flip second card to demonstrate no match
            setTimeout(() => {
                const secondCard = wordCards[2];
                console.log('Auto-flipping second card:', secondCard);
                flipCard(secondCard);
                
                // Check if flipped class was applied
                setTimeout(() => {
                    console.log('Second card has flipped class:', secondCard.classList.contains('flipped'));
                    console.log('Second card classes:', secondCard.className);
                }, 100);
            }, 1000);
        }, 500);
    }, 1000);
});

// Setup event listeners
function setupEventListeners() {
    console.log('setupEventListeners called, startBtn:', startBtn); // Debug log
    
    // Start game
    startBtn.addEventListener('click', () => {
        console.log('Start button clicked'); // Debug log
        gameState = 'playing';
        showScreen('playing');
    });

    // Pause game
    pauseBtn.addEventListener('click', () => {
        if (gameState === 'playing') {
            gameState = 'paused';
            showScreen('paused');
        }
    });

    // Resume game
    resumeBtn.addEventListener('click', () => {
        gameState = 'playing';
        showScreen('playing');
        startTimer();
    });

    // Restart level
    restartBtn.addEventListener('click', () => {
        initGame();
        gameState = 'playing';
        showScreen('playing');
    });

    // Quit to menu
    quitBtn.addEventListener('click', () => {
        initGame();
        window.location.href = '../index.html';
    });

    // Next level
    nextLevelBtn.addEventListener('click', () => {
        level++;
        initGame();
        gameState = 'playing';
        showScreen('playing');
    });

    // Replay level
    replayBtn.addEventListener('click', () => {
        initGame();
        gameState = 'playing';
        showScreen('playing');
    });

    // Main menu
    menuBtn.addEventListener('click', () => {
        initGame();
        window.location.href = '../index.html';
    });

    // Try again
    tryAgainBtn.addEventListener('click', () => {
        initGame();
        gameState = 'playing';
        showScreen('playing');
    });

    // Quit game
    quitGameBtn.addEventListener('click', () => {
        initGame();
        window.location.href = '../index.html';
    });

    // Home button
    homeBtn.addEventListener('click', () => {
        initGame();
        window.location.href = '../index.html';
    });

    // Hint button
    hintBtn.addEventListener('click', () => {
        if (hintsRemaining > 0 && gameState === 'playing') {
            useHint();
        }
    });

    // Card click handler
    wordCards.forEach(card => {
        card.addEventListener('click', () => {
            if (gameState !== 'playing' || card.classList.contains('matched') || card.classList.contains('flipped') || flippedCards.length >= 2) {
                return;
            }
            
            flipCard(card);
        });
    });
}

console.log('Play page loaded');