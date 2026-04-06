import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
        { expiresIn: '30d' }
    );
};

// Register/Signup
export const signup = async (req, res) => {
    try {
        const { name, email, password, skills } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            skills: skills ? skills.split(',').map(s => s.trim()) : [],
        });

        await user.save();

        // Generate token
        const token = generateToken(user.id);

        return res.status(201).json({
            message: 'User created successfully',
            token,
            userId: user._id,
            user: user.toJSON(),
        });
    } catch (error) {
        return res.status(500).json({ message: 'Signup error', error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user.id);

        return res.status(200).json({
            message: 'Login successful',
            token,
            userId: user._id,
            user: user.toJSON(),
        });
    } catch (error) {
        return res.status(500).json({ message: 'Login error', error: error.message });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Logout (client-side only, but we can add token blacklist later)
export const logout = (req, res) => {
    return res.status(200).json({ message: 'Logged out successfully' });
};
