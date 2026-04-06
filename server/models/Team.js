import { supabase } from '../../lib/supabase.js';

class Team {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description || '';
        this.role = data.role;
        this.required_skills = data.required_skills || [];
        this.target_size = data.target_size || 5;
        this.created_by = data.created_by;
        this.status = data.status || 'active';
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Save to database
    async save() {
        const { data, error } = await supabase
            .from('teams')
            .insert([{
                name: this.name,
                description: this.description,
                role: this.role,
                required_skills: this.required_skills,
                target_size: this.target_size,
                created_by: this.created_by,
                status: this.status
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
            .from('teams')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return new Team(data);
    }

    // Find teams by user
    static async findByUser(userId) {
        const { data, error } = await supabase
            .from('team_members')
            .select(`
                teams (
                    *
                )
            `)
            .eq('user_id', userId);

        if (error) throw error;
        return data.map(item => new Team(item.teams));
    }

    // Find all teams
    static async find() {
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .eq('status', 'active');

        if (error) throw error;
        return data.map(team => new Team(team));
    }

    // Update team
    async update(updates) {
        const { data, error } = await supabase
            .from('teams')
            .update(updates)
            .eq('id', this.id)
            .select()
            .single();

        if (error) throw error;
        Object.assign(this, data);
        return this;
    }

    // Delete team
    async delete() {
        const { error } = await supabase
            .from('teams')
            .delete()
            .eq('id', this.id);

        if (error) throw error;
        return true;
    }

    // Get team members
    async getMembers() {
        const { data, error } = await supabase
            .from('team_members')
            .select(`
                users (
                    id, name, email, skills, bio, role, location, experience
                )
            `)
            .eq('team_id', this.id);

        if (error) throw error;
        return data.map(item => item.users);
    }

    // Add member
    async addMember(userId) {
        const { error } = await supabase
            .from('team_members')
            .insert([{
                team_id: this.id,
                user_id: userId
            }]);

        if (error) throw error;
        return true;
    }

    // Remove member
    async removeMember(userId) {
        const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('team_id', this.id)
            .eq('user_id', userId);

        if (error) throw error;
        return true;
    }

    // Send invitation
    async sendInvitation(userId) {
        const { error } = await supabase
            .from('team_invitations')
            .insert([{
                team_id: this.id,
                user_id: userId,
                status: 'pending'
            }]);

        if (error) throw error;
        return true;
    }

    // Get invitations
    async getInvitations() {
        const { data, error } = await supabase
            .from('team_invitations')
            .select(`
                *,
                users (
                    id, name, email
                )
            `)
            .eq('team_id', this.id);

        if (error) throw error;
        return data;
    }
}

export default Team;
