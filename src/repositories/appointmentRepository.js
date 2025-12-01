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


    // A QUERY MAIS IMPORTANTE: Verifica se o PRESTADOR está ocupado
    async hasConflict(providerId, startTime, endTime) {
        // Regra de Conflito: O novo horário (startTime/endTime) conflita se:
        // (Start existente < Novo Fim) AND (End existente > Novo Inicio)
        const { data, error } = await supabase
            .from('appointments')
            .select('id') // Só precisamos saber se existe (o ID)
            .eq('provider_id', providerId)
            // Checa se o horário de início de agendamentos existentes é ANTES do nosso novo fim
            .lt('start_time', endTime.toISOString())
            // Checa se o horário de fim de agendamentos existentes é DEPOIS do nosso novo início
            .gt('end_time', startTime.toISOString())
            // Ignora agendamentos cancelados, se houver uma coluna status
            .neq('status', 'cancelled');

        if (error) throw error;

        // Se a lista de dados for maior que 0, significa que há um agendamento conflitante.
        return data.length > 0;
    }
};
