// ========================================
// COUNTING MODULE - SHARED JAVASCRIPT
// ========================================

// ========================================
// TTS (Text-to-Speech) Functions
// ========================================

/**
 * Check if speech synthesis is available in the browser
 * @returns {boolean}
 */
function isSpeechSynthesisAvailable() {
    return 'speechSynthesis' in window;
}

/**
 * Speak text with specified options
 * @param {string} text - The text to speak
 * @param {Object} options - Options for speech synthesis
 * @param {string} options.lang - Language code (default: 'en-US')
 * @param {number} options.rate - Speech rate (default: 0.9)
 * @param {number} options.pitch - Speech pitch (default: 1.1)
 * @param {number} options.volume - Speech volume (default: 1)
 * @returns {SpeechSynthesisUtterance|null}
 */
function speakText(text, options = {}) {
    if (!isSpeechSynthesisAvailable()) {
        console.warn('Speech synthesis not available');
        return null;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.1;
    utterance.volume = options.volume || 1;

    window.speechSynthesis.speak(utterance);
    return utterance;
}

/**
 * Stop any ongoing speech
 */
function stopSpeaking() {
    if (isSpeechSynthesisAvailable()) {
        window.speechSynthesis.cancel();
    }
}

/**
 * Pause speech
 */
function pauseSpeaking() {
    if (isSpeechSynthesisAvailable()) {
        window.speechSynthesis.pause();
    }
}

/**
 * Resume speech
 */
function resumeSpeaking() {
    if (isSpeechSynthesisAvailable()) {
        window.speechSynthesis.resume();
    }
}

// ========================================
// Number to Words Conversion
// ========================================

/**
 * Convert a number to its word representation
 * @param {number} num - The number to convert
 * @returns {string} - The word representation
 */
function numberToWords(num) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if (num === 0) return 'zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
        return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
    }
    if (num < 1000) {
        return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
    }
    return num.toString();
}

/**
 * Convert a number to words for arithmetic equations
 * @param {number} num - The number to convert
 * @returns {string} - The word representation
 */
function numberToWordsForArithmetic(num) {
    const words = numberToWords(num);
    // Replace hyphens with spaces for better TTS
    return words.replace(/-/g, ' ');
}

// ========================================
// Speak Arithmetic Equations
// ========================================

/**
 * Speak an addition equation
 * @param {number} a - First number
 * @param {number} b - Second number
 */
function speakAddition(a, b) {
    const sum = a + b;
    const equation = `${numberToWordsForArithmetic(a)} plus ${numberToWordsForArithmetic(b)} equals ${numberToWordsForArithmetic(sum)}`;
    speakText(equation, { rate: 0.85 });
}

/**
 * Speak a subtraction equation
 * @param {number} a - First number (minuend)
 * @param {number} b - Second number (subtrahend)
 */
function speakSubtraction(a, b) {
    const difference = a - b;
    const equation = `${numberToWordsForArithmetic(a)} minus ${numberToWordsForArithmetic(b)} equals ${numberToWordsForArithmetic(difference)}`;
    speakText(equation, { rate: 0.85 });
}

/**
 * Speak a multiplication equation
 * @param {number} a - First number
 * @param {number} b - Second number
 */
function speakMultiplication(a, b) {
    const product = a * b;
    const equation = `${numberToWordsForArithmetic(a)} times ${numberToWordsForArithmetic(b)} equals ${numberToWordsForArithmetic(product)}`;
    speakText(equation, { rate: 0.85 });
}

/**
 * Speak a division equation
 * @param {number} dividend - The number being divided
 * @param {number} divisor - The number dividing by
 */
function speakDivision(dividend, divisor) {
    const quotient = dividend / divisor;
    const equation = `${numberToWordsForArithmetic(dividend)} divided by ${numberToWordsForArithmetic(divisor)} equals ${numberToWordsForArithmetic(quotient)}`;
    speakText(equation, { rate: 0.85 });
}

/**
 * Speak a number
 * @param {number} num - The number to speak
 */
function speakNumber(num) {
    speakText(numberToWords(num), { rate: 0.9, pitch: 1.1 });
}

// ========================================
// Original Game Code (Number Cards Game)
// ========================================

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
    // Only initialize game elements if they exist (for the game page)
    if (startBtn) {
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
    }
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
        
        // Speak the matched number
        speakNumber(num1);
        
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
    // Only run for game page
    if (document.querySelector('.number-card')) {
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
    }
});

// ========================================
// Utility Functions
// ========================================

/**
 * Add click-to-speak functionality to elements
 * @param {string} selector - CSS selector for elements
 * @param {Function} speakFunction - Function to call when element is clicked
 */
function addSpeakOnClick(selector, speakFunction) {
    document.querySelectorAll(selector).forEach(element => {
        element.addEventListener('click', speakFunction);
    });
}

/**
 * Create visual feedback on element
 * @param {HTMLElement} element - The element to animate
 */
function visualFeedback(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}

// ========================================
// Voice Loading (for Chrome)
// ========================================

// Force load voices when available
if (isSpeechSynthesisAvailable()) {
    window.speechSynthesis.getVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}
