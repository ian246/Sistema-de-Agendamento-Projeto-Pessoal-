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

    // Busca agendamentos de um provider em uma data específica (para verificar horários ocupados)
    async findByProviderIdAndDate(providerId, date) {
        // Cria range do dia: 00:00:00 até 23:59:59
        const startOfDay = `${date}T00:00:00.000Z`;
        const endOfDay = `${date}T23:59:59.999Z`;

        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id,
                start_time,
                end_time,
                status,
                service:services (
                    id,
                    title,
                    duration_minutes
                )
            `)
            .eq('provider_id', providerId)
            .gte('start_time', startOfDay)
            .lte('start_time', endOfDay)
            .neq('status', 'cancelled')
            .order('start_time', { ascending: true });

        if (error) throw error;
        return data;
    },
    async updateStatus(id, status) {
        const { data, error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            // Supabase returns a specific error code for no rows found, usually 'PGRST116'
            // checking if data is null or error is enough context
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    }
};