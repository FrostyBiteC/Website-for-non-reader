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
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    let isValid = true;
    
    // Validate Full Name
    if (fullName.length < 2) {
        showError('fullName', 'Please enter your full name');
        isValid = false;
    } else {
        removeError('fullName');
    }
    
    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        removeError('email');
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
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        removeError('email');
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
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Redirect to main page after delay
        setTimeout(() => {
            window.location.href = '../main.html';
        }, 1500);
    }, 1500);
}

// Submit Login Form
function submitLoginForm() {
    const button = loginForm.querySelector('.btn-primary');
    const originalText = button.textContent;
    
    button.textContent = 'Logging In...';
    button.classList.add('loading');
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to main page after delay
        setTimeout(() => {
            window.location.href = '../main.html';
        }, 1500);
    }, 1500);
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