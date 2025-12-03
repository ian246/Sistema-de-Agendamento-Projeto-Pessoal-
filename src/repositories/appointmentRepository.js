// Onde acessamos o banco de dados
import { supabase } from '../config/supabaseClient.js'


export const appointmentRepository = {

    async create(appointmentData) {
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData])
            .select('*')
            .single();
        if (error) {
            throw new Error(error.message)
        }
        return data;
    },

    async hasConflict(providerId, startTime, endTime) {
        const { data, error } = await supabase
            .from('appointments')
            .select('id') // Só precisamos saber se existe (o ID)
            .eq('provider_id', providerId)
            .lt('start_time', endTime.toISOString())
            .gt('end_time', startTime.toISOString())
            .neq('status', 'cancelled');
        if (error) throw error;
        return data.length > 0;
    }
};
