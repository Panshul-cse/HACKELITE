document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        window.location.href = '/login.html';
        return;
    }

    setupEventListeners();
    await loadTeams();
});

// Setup event listeners
function setupEventListeners() {
    const createTeamBtn = document.getElementById('createTeamBtn');
    const teamForm = document.getElementById('teamForm');
    const closeModals = document.querySelectorAll('.close-modal');

    createTeamBtn.addEventListener('click', openTeamModal);
    teamForm.addEventListener('submit', handleTeamSubmit);

    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
}

// Load teams
async function loadTeams() {
    try {
        const teamsList = document.getElementById('teamsList');
        teamsList.innerHTML = '<p class="loading">Loading teams...</p>';

        const teams = await teamAPI.getMyTeams();

        if (teams.length === 0) {
            teamsList.innerHTML = '<p class="loading">No teams yet. <button onclick="openTeamModal()" class="btn btn-primary">Create your first team</button></p>';
            return;
        }

        displayTeams(teams);
    } catch (error) {
        console.error('Error loading teams:', error);
        document.getElementById('teamsList').innerHTML = '<p class="loading">Error loading teams. Please try again.</p>';
    }
}

// Display teams
function displayTeams(teams) {
    const teamsList = document.getElementById('teamsList');
    teamsList.innerHTML = '';

    teams.forEach(team => {
        const card = createTeamCard(team);
        teamsList.appendChild(card);
    });
}

// Create a team card
function createTeamCard(team) {
    const card = document.createElement('div');
    card.className = 'team-card';

    const memberCount = team.members ? team.members.length : 0;
    const memberAvatars = team.members
        ? team.members.slice(0, 3).map(member => {
            const initials = member.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
            return `<div class="member-avatar">${initials}</div>`;
        }).join('')
        : '';

    card.innerHTML = `
        <h3>${team.name}</h3>
        <p>${team.description || 'No description available'}</p>
        <div class="team-members">
            ${memberAvatars}
            ${memberCount > 3 ? `<div class="member-avatar">+${memberCount - 3}</div>` : ''}
        </div>
        <div class="team-info">
            <p><strong>Members:</strong> ${memberCount}</p>
            <p><strong>Role:</strong> ${team.role || 'Team Member'}</p>
        </div>
        <div class="team-actions">
            <button class="btn btn-primary" onclick="viewTeamDetails('${team._id}')">View Team</button>
            <button class="btn btn-secondary" onclick="editTeam('${team._id}')">Edit</button>
        </div>
    `;

    return card;
}

// Open team creation modal
function openTeamModal() {
    const modal = document.getElementById('teamModal');
    const form = document.getElementById('teamForm');
    const title = document.getElementById('modalTitle');

    form.reset();
    title.textContent = 'Create Team';
    modal.classList.add('show');
}

// Handle team form submission
async function handleTeamSubmit(e) {
    e.preventDefault();

    const teamName = document.getElementById('teamName').value;
    const description = document.getElementById('teamDescription').value;
    const role = document.getElementById('teamRole').value;
    const requiredSkills = document.getElementById('requiredSkills').value;
    const teamSize = document.getElementById('teamSize').value;

    try {
        const teamData = {
            name: teamName,
            description,
            role,
            requiredSkills,
            targetSize: parseInt(teamSize),
        };

        await teamAPI.createTeam(teamData);

        alert('Team created successfully!');
        document.getElementById('teamModal').classList.remove('show');
        await loadTeams();
    } catch (error) {
        alert('Error creating team: ' + error.message);
    }
}

// View team details
async function viewTeamDetails(teamId) {
    try {
        const team = await teamAPI.getTeam(teamId);
        openTeamDetailModal(team);
    } catch (error) {
        alert('Error loading team details: ' + error.message);
    }
}

// Open team detail modal
function openTeamDetailModal(team) {
    const modal = document.getElementById('teamDetailModal');
    const content = document.getElementById('teamDetailContent');

    const membersList = team.members
        ? team.members.map(member => {
            const initials = member.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
            return `
                <div class="member-item">
                    <div class="member-item-avatar">${initials}</div>
                    <div class="member-item-info">
                        <div class="member-item-name">${member.name}</div>
                        <div class="member-item-role">${member.role || 'Member'}</div>
                    </div>
                </div>
            `;
        }).join('')
        : '<p>No members yet</p>';

    content.innerHTML = `
        <h2>${team.name}</h2>
        <p>${team.description || 'No description available'}</p>
        <p><strong>Team Lead Role:</strong> ${team.role || 'Not specified'}</p>
        <p><strong>Required Skills:</strong> ${team.requiredSkills || 'Not specified'}</p>
        <p><strong>Target Size:</strong> ${team.targetSize || 'Not specified'} members</p>
        
        <div class="team-members-section">
            <h3>Team Members (${team.members ? team.members.length : 0})</h3>
            ${membersList}
        </div>

        <div class="modal-actions" style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
            <button class="btn btn-primary" onclick="editTeamFromDetail('${team._id}')">Edit Team</button>
            <button class="btn btn-secondary close-modal" onclick="document.getElementById('teamDetailModal').classList.remove('show')">Close</button>
        </div>
    `;

    modal.classList.add('show');
}

// Edit team
async function editTeam(teamId) {
    try {
        const team = await teamAPI.getTeam(teamId);
        
        const modal = document.getElementById('teamModal');
        const form = document.getElementById('teamForm');
        const title = document.getElementById('modalTitle');

        title.textContent = 'Edit Team';
        document.getElementById('teamName').value = team.name;
        document.getElementById('teamDescription').value = team.description || '';
        document.getElementById('teamRole').value = team.role || '';
        document.getElementById('requiredSkills').value = team.requiredSkills || '';
        document.getElementById('teamSize').value = team.targetSize || '';

        // Update form submission to edit instead of create
        form.dataset.teamId = teamId;

        modal.classList.add('show');
    } catch (error) {
        alert('Error loading team: ' + error.message);
    }
}

// Edit team from detail modal
function editTeamFromDetail(teamId) {
    document.getElementById('teamDetailModal').classList.remove('show');
    editTeam(teamId);
}
