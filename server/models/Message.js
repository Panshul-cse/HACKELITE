import { supabase } from '../../lib/supabase.js';

class Message {
    constructor(data) {
        this.id = data.id;
        this.sender_id = data.sender_id;
        this.recipient_id = data.recipient_id;
        this.content = data.content;
        this.message_type = data.message_type || 'text';
        this.team_id = data.team_id;
        this.is_read = data.is_read || false;
        this.read_at = data.read_at;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Save to database
    async save() {
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                sender_id: this.sender_id,
                recipient_id: this.recipient_id,
                content: this.content,
                message_type: this.message_type,
                team_id: this.team_id,
                is_read: this.is_read,
                read_at: this.read_at
            }])
            .select()
            .single();

        if (error) throw error;
        Object.assign(this, data);
        return this;
    }

    // Find messages between users
    static async findBetweenUsers(userId1, userId2, limit = 50) {
        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:users!messages_sender_id_fkey (id, name),
                recipient:users!messages_recipient_id_fkey (id, name)
            `)
            .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data.map(msg => new Message(msg)).reverse();
    }

    // Find messages for team
    static async findByTeam(teamId, limit = 50) {
        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:users!messages_sender_id_fkey (id, name),
                team:teams!messages_team_id_fkey (id, name)
            `)
            .eq('team_id', teamId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data.map(msg => new Message(msg)).reverse();
    }

    // Mark as read
    async markAsRead() {
        const { data, error } = await supabase
            .from('messages')
            .update({
                is_read: true,
                read_at: new Date().toISOString()
            })
            .eq('id', this.id)
            .select()
            .single();

        if (error) throw error;
        Object.assign(this, data);
        return this;
    }

    // Get unread count for user
    static async getUnreadCount(userId) {
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', userId)
            .eq('is_read', false);

        if (error) throw error;
        return count;
    }
}

export default Message;
