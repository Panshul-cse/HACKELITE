import { supabase } from '../../lib/supabase.js';

const connectDB = async () => {
    try {
        // Test connection by checking if we can access the database
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            throw error;
        }
        console.log('Supabase connected successfully');
        return supabase;
    } catch (error) {
        console.error('Supabase connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;
