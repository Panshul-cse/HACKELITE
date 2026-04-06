let currentMatches = [];
let currentMatchIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        window.location.href = '/login.html';
        return;
    }

    setupEventListeners();
    await loadMatches();
});

// Setup event listeners
function setupEventListeners() {
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    const closeModal = document.querySelectorAll('.close-modal');
    const sendRequestBtn = document.getElementById('sendRequestBtn');
    const skipBtn = document.getElementById('skipBtn');

    applyBtn.addEventListener('click', applyFilters);
    resetBtn.addEventListener('click', resetFilters);
    
    closeModal.forEach(btn => {
        btn.addEventListener('click', closeMatchModal);
    });

    sendRequestBtn.addEventListener('click', sendMatchRequest);
    skipBtn.addEventListener('click', skipMatch);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('matchModal');
        if (e.target === modal) {
            closeMatchModal();
        }
    });
}

// Load matches
async function loadMatches(filters = {}) {
    try {
        const matchesList = document.getElementById('matchesList');
        matchesList.innerHTML = '<p class="loading">Loading developers...</p>';

        const response = await matchAPI.getMatches(filters);
        currentMatches = response.data || [];

        const resultsCount = document.getElementById('resultsCount');
        resultsCount.textContent = `${currentMatches.length} developer${currentMatches.length !== 1 ? 's' : ''} found`;

        if (currentMatches.length === 0) {
            matchesList.innerHTML = '<p class="loading">No developers found. Try adjusting your filters.</p>';
            return;
        }

        displayMatches(currentMatches);
    } catch (error) {
        console.error('Error loading matches:', error);
        document.getElementById('matchesList').innerHTML = '<p class="loading">Error loading matches. Please try again.</p>';
    }
}

// Display matches as cards
function displayMatches(matches) {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';

    matches.forEach(match => {
        const card = createMatchCard(match);
        matchesList.appendChild(card);
    });
}

// Create a match card
function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    const initials = match.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    const skillsHtml = match.skills
        .split(',')
        .slice(0, 3)
        .map(skill => `<span class="skill-tag">${skill.trim()}</span>`)
        .join('');

    card.innerHTML = `
        <div class="match-card-header">
            <div class="match-avatar">${initials}</div>
            <h3>${match.name}</h3>
            <p class="match-role">${match.role || 'Developer'}</p>
        </div>
        <div class="match-card-body">
            <p>${match.bio || 'No bio available'}</p>
            <div class="match-skills">
                ${skillsHtml}
            </div>
            ${match.location ? `<p><strong>Location:</strong> ${match.location}</p>` : ''}
        </div>
        <div class="match-card-actions">
            <button class="btn btn-secondary view-btn" onclick="viewMatchDetails('${match._id}')">View Profile</button>
            <button class="btn btn-primary connect-btn" onclick="openMatchModal('${match._id}')">Connect</button>
        </div>
    `;

    return card;
}

// View match details
function viewMatchDetails(userId) {
    console.log('View details for:', userId);
    // Can be implemented to show more detailed profile
}

// Open match modal
function openMatchModal(userId) {
    const match = currentMatches.find(m => m._id === userId);
    if (!match) return;

    const modal = document.getElementById('matchModal');
    const modalBody = document.getElementById('modalBody');

    const skillsHtml = match.skills
        .split(',')
        .map(skill => `<span class="skill-tag">${skill.trim()}</span>`)
        .join('');

    const initials = match.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    modalBody.innerHTML = `
        <div class="match-modal-header">
            <div class="match-avatar" style="width: 100px; height: 100px; font-size: 2.5rem;">${initials}</div>
            <h2>${match.name}</h2>
            <p class="match-role">${match.role || 'Developer'}</p>
        </div>
        <div class="match-modal-body">
            <p><strong>Bio:</strong> ${match.bio || 'No bio available'}</p>
            ${match.location ? `<p><strong>Location:</strong> ${match.location}</p>` : ''}
            <p><strong>Skills:</strong></p>
            <div class="match-skills">
                ${skillsHtml}
            </div>
            ${match.experience ? `<p><strong>Experience:</strong> ${match.experience}</p>` : ''}
        </div>
    `;

    // Store current match ID for sending request
    modal.dataset.currentUserId = userId;

    modal.classList.add('show');
}

// Close match modal
function closeMatchModal() {
    const modal = document.getElementById('matchModal');
    modal.classList.remove('show');
}

// Send match request
async function sendMatchRequest() {
    const modal = document.getElementById('matchModal');
    const targetUserId = modal.dataset.currentUserId;

    if (!targetUserId) return;

    try {
        await matchAPI.sendMatchRequest(targetUserId);
        
        alert('Match request sent successfully!');
        closeMatchModal();

        // Remove this match from the list
        currentMatches = currentMatches.filter(m => m._id !== targetUserId);
        displayMatches(currentMatches);
    } catch (error) {
        alert('Error sending match request: ' + error.message);
    }
}

// Skip current match
function skipMatch() {
    const modal = document.getElementById('matchModal');
    const targetUserId = modal.dataset.currentUserId;

    if (!targetUserId) return;

    closeMatchModal();

    // Remove this match from the list
    currentMatches = currentMatches.filter(m => m._id !== targetUserId);
    displayMatches(currentMatches);

    if (currentMatches.length === 0) {
        document.getElementById('matchesList').innerHTML = '<p class="loading">No more developers to view. Try adjusting your filters.</p>';
    }
}

// Apply filters
async function applyFilters() {
    const skills = document.getElementById('skillFilter').value;
    const experience = document.getElementById('experienceFilter').value;
    const location = document.getElementById('locationFilter').value;

    const filters = {};
    if (skills) filters.skills = skills;
    if (experience) filters.experience = experience;
    if (location) filters.location = location;

    await loadMatches(filters);
}

// Reset filters
async function resetFilters() {
    document.getElementById('skillFilter').value = '';
    document.getElementById('experienceFilter').value = '';
    document.getElementById('locationFilter').value = '';

    await loadMatches();
}
