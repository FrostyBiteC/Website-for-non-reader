// DOM Elements
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// Sign Up Form Validation & Submission
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateSignupForm()) {
            submitSignupForm();
        }
    });
}

// Login Form Validation & Submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateLoginForm()) {
            submitLoginForm();
        }
    });
}

// Sign Up Form Validation
function validateSignupForm() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    let isValid = true;
    
    // Validate Username
    if (username.length < 3 || username.length > 20) {
        showError('username', 'Username must be between 3 and 20 characters');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showError('username', 'Username can only contain letters, numbers, and underscores');
        isValid = false;
    } else {
        removeError('username');
    }
    
    // Validate Password
    if (password.length < 8) {
        showError('password', 'Password must be at least 8 characters');
        isValid = false;
    } else {
        removeError('password');
    }
    
    // Validate Confirm Password
    if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    } else {
        removeError('confirmPassword');
    }
    
    // Validate Terms
    if (!terms) {
        showError('terms', 'Please agree to the Terms of Service');
        isValid = false;
    } else {
        removeError('terms');
    }
    
    return isValid;
}

// Login Form Validation
function validateLoginForm() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    // Validate Username
    if (username.length < 3 || username.length > 20) {
        showError('username', 'Username must be between 3 and 20 characters');
        isValid = false;
    } else {
        removeError('username');
    }
    
    // Validate Password
    if (password.length < 8) {
        showError('password', 'Password must be at least 8 characters');
        isValid = false;
    } else {
        removeError('password');
    }
    
    return isValid;
}

// Show Error Message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.parentNode.querySelector('.error-message');
    
    if (!errorDiv) {
        const newErrorDiv = document.createElement('div');
        newErrorDiv.className = 'error-message';
        newErrorDiv.textContent = message;
        field.parentNode.appendChild(newErrorDiv);
    } else {
        errorDiv.textContent = message;
    }
    
    errorDiv.classList.add('show');
    field.classList.add('error');
    field.classList.remove('success');
}

// Remove Error Message
function removeError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.parentNode.querySelector('.error-message');
    
    if (errorDiv) {
        errorDiv.classList.remove('show');
    }
    
    field.classList.remove('error');
    field.classList.add('success');
}

 // Submit Sign Up Form
function submitSignupForm() {
    const button = signupForm.querySelector('.btn-primary');
    const originalText = button.textContent;
    
    button.textContent = 'Creating Account...';
    button.classList.add('loading');
    button.disabled = true;
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Create a dummy email from username for Firebase Auth
    const email = `${username}@edulift.com`;
    
    // Firebase Sign Up
    window.firebase.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up successfully
            const user = userCredential.user;
            
            // Store user data in Realtime Database
            window.firebase.set(window.firebase.ref(window.firebase.db, 'users/' + user.uid), {
                username: username,
                email: email,
                createdAt: new Date().toISOString()
            })
            .then(() => {
                showNotification('Account created successfully! Redirecting...', 'success');
                
                // Store user info in localStorage
                localStorage.setItem('user', JSON.stringify({
                    email: user.email,
                    uid: user.uid,
                    username: username
                }));
                
                // Redirect to main page after delay
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            })
            .catch((error) => {
                showNotification(`Error saving user data: ${error.message}`, 'error');
                button.textContent = originalText;
                button.classList.remove('loading');
                button.disabled = false;
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            showNotification(`Error: ${errorMessage}`, 'error');
            button.textContent = originalText;
            button.classList.remove('loading');
            button.disabled = false;
        });
}

 // Submit Login Form
function submitLoginForm() {
    const button = loginForm.querySelector('.btn-primary');
    const originalText = button.textContent;
    
    button.textContent = 'Logging In...';
    button.classList.add('loading');
    button.disabled = true;
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Create a dummy email from username for Firebase Auth
    const email = `${username}@edulift.com`;
    
    // Firebase Login
    window.firebase.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            
            // Fetch user data from Realtime Database
            window.firebase.get(window.firebase.child(window.firebase.ref(window.firebase.db), 'users/' + user.uid))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        showNotification('Login successful! Redirecting...', 'success');
                        
                        // Store user info in localStorage
                        localStorage.setItem('user', JSON.stringify({
                            email: user.email,
                            uid: user.uid,
                            username: userData.username
                        }));
                        
                        // Redirect to main page after delay
                        setTimeout(() => {
                            window.location.href = '../index.html';
                        }, 1500);
                    } else {
                        // If no user data found, store basic info
                        localStorage.setItem('user', JSON.stringify({
                            email: user.email,
                            uid: user.uid,
                            username: username
                        }));
                        setTimeout(() => {
                            window.location.href = '../index.html';
                        }, 1500);
                    }
                })
                .catch((error) => {
                    showNotification(`Error fetching user data: ${error.message}`, 'error');
                    button.textContent = originalText;
                    button.classList.remove('loading');
                    button.disabled = false;
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            showNotification(`Error: ${errorMessage}`, 'error');
            button.textContent = originalText;
            button.classList.remove('loading');
            button.disabled = false;
        });
}

// Notification Function
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#06d6a0' : '#ff6b6b'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Append notification
    document.body.appendChild(notification);
}

// Real-time validation for passwords
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

if (passwordInput) {
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length > 0) {
            if (passwordInput.value.length < 8) {
                showError('password', 'Password must be at least 8 characters');
            } else {
                removeError('password');
            }
        }
    });
}

if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', () => {
        const password = document.getElementById('password').value;
        if (confirmPasswordInput.value !== password && confirmPasswordInput.value.length > 0) {
            showError('confirmPassword', 'Passwords do not match');
        } else if (confirmPasswordInput.value === password && confirmPasswordInput.value.length > 0) {
            removeError('confirmPassword');
        }
    });
}

// Terms checkbox validation
const termsCheckbox = document.getElementById('terms');
if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
        if (termsCheckbox.checked) {
            removeError('terms');
        }
    });
}

// Input focus effects
const inputs = document.querySelectorAll('.auth-form input:not([type="checkbox"])');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.style.borderColor = '#ff6b6b';
        input.style.background = 'white';
    });
    
    input.addEventListener('blur', () => {
        if (!input.classList.contains('error') && !input.classList.contains('success')) {
            input.style.borderColor = '#e9ecef';
            input.style.background = '#f8f9fa';
        }
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeNotification = document.querySelector('.notification');
        if (activeNotification) {
            activeNotification.remove();
        }
    }
});

console.log('Authentication page loaded');