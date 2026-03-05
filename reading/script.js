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
    
    // Word card listeners
    document.querySelectorAll('.word-card').forEach(card => {
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
    document.querySelectorAll('.word-card').forEach(card => {
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
    const word1 = card1.dataset.word.toLowerCase();
    const word2 = card2.dataset.word.toLowerCase();
    
    if (word1 === word2) {
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
    const unflippedCards = Array.from(document.querySelectorAll('.word-card:not(.flipped):not(.matched)'));
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
        document.querySelectorAll('.word-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('flipped');
                setTimeout(() => {
                    card.classList.remove('flipped');
                }, 1500);
            }, index * 500);
        });
    }, 1000);
});

/* ============================================
   TEXT-TO-SPEECH (TTS) HELPER FUNCTIONS
   ============================================ */

// Check if speech synthesis is available
function isSpeechSynthesisAvailable() {
    return 'speechSynthesis' in window;
}

// Speak text with specified options
function speakText(text, options = {}) {
    if (!isSpeechSynthesisAvailable()) {
        console.warn('Speech synthesis not available');
        return null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 0.85;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;
    if (options.onBoundary) utterance.onboundary = options.onBoundary;

    window.speechSynthesis.speak(utterance);
    return utterance;
}

// Stop all speech
function stopSpeech() {
    if (isSpeechSynthesisAvailable()) {
        window.speechSynthesis.cancel();
    }
}

// Pause speech
function pauseSpeech() {
    if (isSpeechSynthesisAvailable()) {
        window.speechSynthesis.pause();
    }
}

// Resume speech
function resumeSpeech() {
    if (isSpeechSynthesisAvailable()) {
        window.speechSynthesis.resume();
    }
}

// Speak letter with word (for Abakada)
function speakLetterAndWord(letter, word, lang = 'tl-PH') {
    if (!isSpeechSynthesisAvailable()) return;

    stopSpeech();

    const letterUtterance = new SpeechSynthesisUtterance(letter.toLowerCase());
    letterUtterance.lang = lang;
    letterUtterance.rate = 0.8;
    letterUtterance.pitch = 1.1;

    const wordUtterance = new SpeechSynthesisUtterance(word);
    wordUtterance.lang = lang;
    wordUtterance.rate = 0.7;
    wordUtterance.pitch = 1.1;

    letterUtterance.onend = () => {
        window.speechSynthesis.speak(wordUtterance);
    };

    window.speechSynthesis.speak(letterUtterance);
}

// Read passage with word highlighting
function readPassageWithHighlighting(text, words, options = {}) {
    if (!isSpeechSynthesisAvailable()) {
        alert('Sorry, speech synthesis is not available in your browser.');
        return null;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 0.85;
    utterance.pitch = options.pitch || 1;

    let wordIndex = 0;
    let highlightInterval = null;
    const wordDelay = options.wordDelay || 350;

    utterance.onstart = () => {
        wordIndex = 0;
        highlightWord(words, 0);

        highlightInterval = setInterval(() => {
            wordIndex++;
            if (wordIndex < words.length) {
                highlightWord(words, wordIndex);
            }
        }, wordDelay);

        if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
        clearInterval(highlightInterval);
        if (words) {
            words.forEach(word => word.classList.remove('highlighted'));
        }
        if (options.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
        clearInterval(highlightInterval);
        if (words) {
            words.forEach(word => word.classList.remove('highlighted'));
        }
        if (options.onError) options.onError();
    };

    window.speechSynthesis.speak(utterance);
    return { utterance, highlightInterval };
}

// Highlight a specific word
function highlightWord(words, index) {
    if (!words) return;
    words.forEach(word => word.classList.remove('highlighted'));
    if (words[index]) {
        words[index].classList.add('highlighted');
        words[index].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
}

// Clear all word highlights
function clearHighlights(words) {
    if (!words) return;
    words.forEach(word => word.classList.remove('highlighted'));
}

// Get Filipino voice if available
function getFilipinoVoice() {
    if (!isSpeechSynthesisAvailable()) return null;
    
    const voices = window.speechSynthesis.getVoices();
    return voices.find(voice => 
        voice.lang.includes('tl') || 
        voice.lang.includes('fil') ||
        voice.lang.includes('ph')
    ) || voices.find(voice => voice.lang.includes('en'));
}

// Initialize voices (voices may load asynchronously)
function initVoices() {
    if (!isSpeechSynthesisAvailable()) return;
    
    // Force load voices
    window.speechSynthesis.getVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initVoices);

// Stop speech when leaving page
window.addEventListener('beforeunload', stopSpeech);