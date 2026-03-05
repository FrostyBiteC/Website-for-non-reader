/**
 * Visual Encyclopedia - Knowing Module Script
 * Features: TTS (Text-to-Speech), Sub-category Filtering, Lazy Loading
 */

// ============================================
// TEXT-TO-SPEECH (TTS) FUNCTIONALITY
// ============================================

class TTSManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.isSpeaking = false;
        this.voices = [];
        this.preferredVoice = null;
        
        this.init();
    }
    
    init() {
        // Load voices when available
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
        
        // Try loading voices immediately as well
        this.loadVoices();
        
        // Add click listeners to all TTS buttons
        document.addEventListener('click', (e) => {
            const ttsButton = e.target.closest('.tts-button');
            if (ttsButton) {
                e.preventDefault();
                e.stopPropagation();
                this.speak(ttsButton);
            }
        });
    }
    
    loadVoices() {
        this.voices = this.synth.getVoices();
        
        // Try to find a good English voice
        this.preferredVoice = this.voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.includes('Google')
        ) || this.voices.find(voice => 
            voice.lang.startsWith('en')
        ) || this.voices[0];
    }
    
    speak(button) {
        const text = button.dataset.text;
        if (!text) return;
        
        // If already speaking this text, stop it
        if (this.isSpeaking && this.currentText === text) {
            this.stop();
            this.removeSpeakingState(button);
            return;
        }
        
        // Stop any current speech
        this.stop();
        this.removeAllSpeakingStates();
        
        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.preferredVoice;
        utterance.rate = 0.9; // Slightly slower for children
        utterance.pitch = 1.1; // Slightly higher pitch
        utterance.volume = 1;
        
        utterance.onstart = () => {
            this.isSpeaking = true;
            this.currentText = text;
            this.addSpeakingState(button);
        };
        
        utterance.onend = () => {
            this.isSpeaking = false;
            this.currentText = null;
            this.removeSpeakingState(button);
        };
        
        utterance.onerror = (e) => {
            console.error('TTS Error:', e);
            this.isSpeaking = false;
            this.removeSpeakingState(button);
        };
        
        this.currentUtterance = utterance;
        this.synth.speak(utterance);
    }
    
    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.isSpeaking = false;
        this.currentText = null;
    }
    
    addSpeakingState(button) {
        button.classList.add('speaking');
        button.querySelector('.tts-icon').textContent = '⏹️';
    }
    
    removeSpeakingState(button) {
        button.classList.remove('speaking');
        button.querySelector('.tts-icon').textContent = '🔊';
    }
    
    removeAllSpeakingStates() {
        document.querySelectorAll('.tts-button.speaking').forEach(btn => {
            this.removeSpeakingState(btn);
        });
    }
}

// ============================================
// SUB-CATEGORY FILTERING
// ============================================

class CategoryFilter {
    constructor() {
        this.tabs = document.querySelectorAll('.subcategory-tab');
        this.items = document.querySelectorAll('.gallery-item');
        
        this.init();
    }
    
    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterItems(filter);
                this.updateActiveTab(e.target);
            });
        });
    }
    
    filterItems(category) {
        this.items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.classList.remove('hidden');
                // Small delay for animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }
    
    updateActiveTab(activeTab) {
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }
}

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.imageObserver = null;
        
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            this.images.forEach(img => this.imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            this.images.forEach(img => this.loadImage(img));
        }
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

class KeyboardNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            // ESC key stops TTS
            if (e.key === 'Escape') {
                if (window.ttsManager) {
                    window.ttsManager.stop();
                    window.ttsManager.removeAllSpeakingStates();
                }
            }
            
            // Arrow keys for tab navigation
            const tabs = document.querySelectorAll('.subcategory-tab');
            if (tabs.length && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                const activeTab = document.querySelector('.subcategory-tab.active');
                if (activeTab) {
                    const currentIndex = Array.from(tabs).indexOf(activeTab);
                    let newIndex;
                    
                    if (e.key === 'ArrowLeft') {
                        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                    } else {
                        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                    }
                    
                    tabs[newIndex].click();
                    tabs[newIndex].focus();
                }
            }
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize TTS Manager
    window.ttsManager = new TTSManager();
    
    // Initialize Category Filter (only on category pages)
    if (document.querySelector('.subcategory-tab')) {
        new CategoryFilter();
    }
    
    // Initialize Lazy Loader
    new LazyLoader();
    
    // Initialize Smooth Scroll
    new SmoothScroll();
    
    // Initialize Keyboard Navigation
    new KeyboardNavigation();
    
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
    
    console.log('🎓 Visual Encyclopedia loaded successfully!');
});

// ============================================
// SERVICE WORKER REGISTRATION (Optional PWA support)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is available
        // navigator.serviceWorker.register('/knowing/sw.js')
        //     .then(registration => {
        //         console.log('SW registered:', registration);
        //     })
        //     .catch(error => {
        //         console.log('SW registration failed:', error);
        //     });
    });
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c📚 Visual Encyclopedia', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cLearn, Explore, Discover!', 'font-size: 14px; color: #764ba2;');
