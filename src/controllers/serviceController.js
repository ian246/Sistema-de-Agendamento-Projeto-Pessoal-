import { supabase } from '../config/supabaseClient.js';

export const serviceController = {

    // 1. CRIAR SERVIÇO (Só para Providers)
    async createService(req, res) {
        try {
            const { name, description, price, duration } = req.body;
            const provider_id = req.user.id; // <--- Pegamos do Token.

            if (!name || !price) {
                return res.status(400).json({ error: "Nome e Preço são obrigatórios." });
            }

            const { data, error } = await supabase
                .from('services')
                .insert([{
                    name,
                    description,
                    price: parseFloat(price),
                    duration: parseInt(duration || 30), // Duração padrão de 30min
                    provider_id: provider_id // Salva que esse serviço é DESTE usuário
                }])
                .select();

            if (error) throw error;

            return res.status(201).json({ message: "Serviço criado com sucesso!", service: data[0] });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar serviço." });
        }
    },

    // 2. LISTAR MEUS SERVIÇOS (Para o Painel do Barbeiro)
    async getMyServices(req, res) {
        try {
            const myId = req.user.id;

            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('provider_id', myId); // Filtra só o que é meu

            if (error) throw error;

            return res.json(data);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar serviços." });
        }
    },

    // 3. LISTAR SERVIÇOS DE UM BARBEIRO ESPECÍFICO (Para o Cliente ver no App)
    async getServicesByProviderId(req, res) {
        try {
            const { providerId } = req.params;

            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('provider_id', providerId);

            if (error) throw error;

            return res.json(data);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar serviços do barbeiro." });
        }
    },

    // 4. DELETAR SERVIÇO (Segurança extra: só deleta se for dono)
    async deleteService(req, res) {
        try {
            const { id } = req.params;
            const myId = req.user.id;

            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id)
                .eq('provider_id', myId); // Garante que ninguém delete serviço dos outros

            if (error) throw error;

            return res.json({ message: "Serviço removido." });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao deletar serviço." });
        }
    }
};