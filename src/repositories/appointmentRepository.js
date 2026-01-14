// Onde acessamos o banco de dados
import { supabase } from '../config/supabaseClient.js'


export const appointmentRepository = {

    async create(appointmentData) {
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData])
            .select('*'); // Remove .single() to avoid error

        if (error) {
            throw new Error(error.message)
        }
        // Return the first element since insert with array returns an array
        return data[0];
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
    },

    async findByClientId(clientId) {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        provider:profiles!appointments_provider_id_fkey (full_name),
        service:services (title)
      `)
            .eq('client_id', clientId)
            .order('start_time', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Busca agendamentos do provider com dados do cliente e serviço
    async findByProviderId(providerId) {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                client:profiles!appointments_client_id_fkey (
                    id,
                    full_name,
                    phone
                ),
                service:services (
                    id,
                    title,
                    price,
                    duration_minutes
                )
            `)
            .eq('provider_id', providerId)
            .order('start_time', { ascending: false });

        if (error) throw error;
        return data;
    },
};