document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        window.location.href = '/login.html';
        return;
    }

    try {
        // Load user profile
        const user = await userAPI.getProfile(userId);
        updateUserProfile(user);
        
        // Load dashboard stats
        await loadDashboardStats(userId);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.querySelector('.dashboard-content').innerHTML = '<p>Error loading dashboard. Please try again.</p>';
    }
});

// Update user profile in sidebar
function updateUserProfile(user) {
    if (user.name) {
        const firstName = user.name.split(' ')[0];
        document.getElementById('firstName').textContent = firstName;
        document.getElementById('userName').textContent = user.name;
    }
    if (user.email) {
        document.getElementById('userEmail').textContent = user.email;
    }
    if (user.name) {
        const initials = user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
        document.getElementById('profileAvatar').textContent = initials;
    }
}

// Load dashboard statistics
async function loadDashboardStats(userId) {
    try {
        // Fetch match requests
        const requests = await matchAPI.getMatchRequests();
        document.getElementById('matchRequests').textContent = requests.count || 0;

        // Fetch teams
        const teams = await teamAPI.getMyTeams();
        document.getElementById('teamsCount').textContent = teams.length || 0;

        // Set placeholder stats
        document.getElementById('profileViews').textContent = Math.floor(Math.random() * 100);
        document.getElementById('connectionsCount').textContent = teams.reduce((acc, team) => {
            return acc + (team.members ? team.members.length : 0);
        }, 0);

        // Load recent activity
        loadRecentActivity(requests, teams);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load recent activity
function loadRecentActivity(requests, teams) {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';

    let activities = [];

    // Add match requests to activity
    if (requests && Array.isArray(requests.data)) {
        requests.data.forEach(req => {
            activities.push({
                type: 'match-request',
                message: `New match request from ${req.fromUser?.name || 'Unknown User'}`,
                timestamp: new Date(req.createdAt),
                icon: '👤'
            });
        });
    }

    // Add team updates to activity
    if (teams && Array.isArray(teams)) {
        teams.forEach(team => {
            activities.push({
                type: 'team',
                message: `You are part of team "${team.name}"`,
                timestamp: new Date(team.createdAt),
                icon: '👥'
            });
        });
    }

    // Sort by date (newest first)
    activities.sort((a, b) => b.timestamp - a.timestamp);

    if (activities.length === 0) {
        activityList.innerHTML = '<p>No recent activity. <a href="/match.html">Start finding developers</a>!</p>';
        return;
    }

    // Display activities
    activities.slice(0, 5).forEach(activity => {
        const activityEl = document.createElement('div');
        activityEl.className = 'activity-item';
        activityEl.innerHTML = `
            <span class="activity-icon">${activity.icon}</span>
            <div class="activity-content">
                <p>${activity.message}</p>
                <small>${formatDate(activity.timestamp)}</small>
            </div>
        `;
        activityList.appendChild(activityEl);
    });
}

// Format date for display
function formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}
