// Check if user is already logged in and redirect to dashboard
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;

    // If logged in and on login/signup, redirect to dashboard
    if (token && (currentPage.includes('login') || currentPage.includes('signup'))) {
        window.location.href = '/dashboard.html';
    }

    // If not logged in and on protected pages, redirect to login
    if (!token && (currentPage.includes('dashboard') || currentPage.includes('match') || currentPage.includes('team'))) {
        window.location.href = '/login.html';
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Setup event listeners based on current page
    const currentPage = window.location.pathname;

    if (currentPage.includes('login')) {
        setupLoginPage();
    } else if (currentPage.includes('signup')) {
        setupSignupPage();
    }

    // Setup logout button on protected pages
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Setup login page
function setupLoginPage() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
}

// Setup signup page
function setupSignupPage() {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', handleSignup);
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');

    try {
        // Clear previous messages
        errorMsg.classList.remove('show');
        successMsg.classList.remove('show');

        const response = await authAPI.login(email, password);
        
        // Store token and user ID
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.userId);

        // Show success message
        successMsg.textContent = 'Login successful! Redirecting...';
        successMsg.classList.add('show');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
    } catch (error) {
        errorMsg.textContent = error.message || 'Login failed. Please try again.';
        errorMsg.classList.add('show');
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const skills = document.getElementById('skills').value;
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');

    try {
        // Clear previous messages
        errorMsg.classList.remove('show');
        successMsg.classList.remove('show');

        // Validate passwords match
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const response = await authAPI.signup(name, email, password, skills);

        // Store token and user ID
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.userId);

        // Show success message
        successMsg.textContent = 'Account created successfully! Redirecting...';
        successMsg.classList.add('show');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
    } catch (error) {
        errorMsg.textContent = error.message || 'Signup failed. Please try again.';
        errorMsg.classList.add('show');
    }
}

// Handle logout
function handleLogout() {
    authAPI.logout();
    window.location.href = '/';
}

// Get current user info
async function getCurrentUserInfo() {
    try {
        const user = await authAPI.getCurrentUser();
        return user;
    } catch (error) {
        console.error('Failed to get user info:', error);
        return null;
    }
}
