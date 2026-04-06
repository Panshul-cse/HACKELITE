import { supabase } from '../../lib/supabase.js';
import bcryptjs from 'bcryptjs';

class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.skills = data.skills || [];
        this.bio = data.bio || '';
        this.role = data.role || 'Developer';
        this.location = data.location || '';
        this.experience = data.experience || 'intermediate';
        this.profile_views = data.profile_views || 0;
        this.is_active = data.is_active !== undefined ? data.is_active : true;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Hash password before saving
    async hashPassword() {
        if (this.password) {
            const salt = await bcryptjs.genSalt(10);
            this.password = await bcryptjs.hash(this.password, salt);
        }
    }

    // Compare password
    async comparePassword(passwordToCompare) {
        return bcryptjs.compare(passwordToCompare, this.password);
    }

    // Save to database
    async save() {
        await this.hashPassword();
        const { data, error } = await supabase
            .from('users')
            .insert([{
                name: this.name,
                email: this.email,
                password: this.password,
                skills: this.skills,
                bio: this.bio,
                role: this.role,
                location: this.location,
                experience: this.experience,
                profile_views: this.profile_views,
                is_active: this.is_active
            }])
            .select()
            .single();

        if (error) throw error;
        Object.assign(this, data);
        return this;
    }

    // Find by ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return new User(data);
    }

    // Find by email
    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) return null;
        return new User(data);
    }

    // Find all users
    static async find() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('is_active', true);

        if (error) throw error;
        return data.map(user => new User(user));
    }

    // Update user
    async update(updates) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', this.id)
            .select()
            .single();

        if (error) throw error;
        Object.assign(this, data);
        return this;
    }

    // Delete user
    async delete() {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', this.id);

        if (error) throw error;
        return true;
    }

    // Get connections
    async getConnections() {
        const { data, error } = await supabase
            .from('user_connections')
            .select(`
                connected_user_id,
                users!user_connections_connected_user_id_fkey (
                    id, name, email, skills, bio, role, location, experience
                )
            `)
            .eq('user_id', this.id);

        if (error) throw error;
        return data.map(conn => conn.users);
    }

    // Add connection
    async addConnection(targetUserId) {
        const { error } = await supabase
            .from('user_connections')
            .insert([{
                user_id: this.id,
                connected_user_id: targetUserId
            }]);

        if (error) throw error;
        return true;
    }

    // Remove connection
    async removeConnection(targetUserId) {
        const { error } = await supabase
            .from('user_connections')
            .delete()
            .eq('user_id', this.id)
            .eq('connected_user_id', targetUserId);

        if (error) throw error;
        return true;
    }

    // Get teams
    async getTeams() {
        const { data, error } = await supabase
            .from('team_members')
            .select(`
                teams (
                    id, name, description, role, required_skills, target_size, status, created_at
                )
            `)
            .eq('user_id', this.id);

        if (error) throw error;
        return data.map(item => item.teams);
    }

    // Convert to JSON (exclude password)
    toJSON() {
        const user = { ...this };
        delete user.password;
        return user;
    }
}

export default User;
