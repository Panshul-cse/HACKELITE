// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add request body if data provided
    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API calls
const authAPI = {
    login: (email, password) => 
        makeRequest('/auth/login', 'POST', { email, password }),
    
    signup: (name, email, password, skills) => 
        makeRequest('/auth/signup', 'POST', { name, email, password, skills }),
    
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
    },

    getCurrentUser: () => 
        makeRequest('/auth/me', 'GET'),
};

// User API calls
const userAPI = {
    getProfile: (userId) => 
        makeRequest(`/users/${userId}`, 'GET'),
    
    updateProfile: (userId, data) => 
        makeRequest(`/users/${userId}`, 'PUT', data),
    
    getAllUsers: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return makeRequest(`/users?${params.toString()}`, 'GET');
    },
};

// Match API calls
const matchAPI = {
    getMatches: (filters = {}) => 
        makeRequest(`/matches?${new URLSearchParams(filters).toString()}`, 'GET'),
    
    sendMatchRequest: (targetUserId) => 
        makeRequest('/matches/send', 'POST', { targetUserId }),
    
    getMatchRequests: () => 
        makeRequest('/matches/requests', 'GET'),
    
    respondToRequest: (requestId, status) => 
        makeRequest(`/matches/${requestId}/respond`, 'POST', { status }),
};

// Team API calls
const teamAPI = {
    getMyTeams: () => 
        makeRequest('/teams', 'GET'),
    
    getTeam: (teamId) => 
        makeRequest(`/teams/${teamId}`, 'GET'),
    
    createTeam: (teamData) => 
        makeRequest('/teams', 'POST', teamData),
    
    updateTeam: (teamId, teamData) => 
        makeRequest(`/teams/${teamId}`, 'PUT', teamData),
    
    deleteTeam: (teamId) => 
        makeRequest(`/teams/${teamId}`, 'DELETE'),
    
    addTeamMember: (teamId, userId) => 
        makeRequest(`/teams/${teamId}/members`, 'POST', { userId }),
    
    removeTeamMember: (teamId, userId) => 
        makeRequest(`/teams/${teamId}/members/${userId}`, 'DELETE'),
    
    getTeamMembers: (teamId) => 
        makeRequest(`/teams/${teamId}/members`, 'GET'),
};
