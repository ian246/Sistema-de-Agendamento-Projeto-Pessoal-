import { createClient } from '@supabase/supabase-js';
import { supabase } from '../config/supabaseClient.js';

export const serviceController = {

    // 1. CRIAR SERVIÇO (Só para Providers)
    async createService(req, res) {
        try {
            // CORREÇÃO: O banco usa 'title', não 'name'
            const { title, name, description, price, duration } = req.body;
            const provider_id = req.user.id; // <--- Pegamos do Token.

            // Aceita tanto 'title' quanto 'name' do frontend (compatibilidade)
            const serviceTitle = title || name;

            if (!serviceTitle || !price) {
                return res.status(400).json({ error: "Nome/Título e Preço são obrigatórios." });
            }

            // CRIA UM CLIENTE SUPABASE COM O TOKEN DO USUÁRIO
            // Isso garante que o Supabase saiba QUEM está fazendo o insert e respeite o RLS.
            const supabaseUrl = process.env.SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_KEY;

            // Pega o token do header (ex: "Bearer eyJ...")
            const authHeader = req.headers.authorization;

            const supabaseClient = createClient(supabaseUrl, supabaseKey, {
                global: {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            });

            const { data, error } = await supabaseClient
                .from('services')
                .insert([{
                    title: serviceTitle, // CORRIGIDO: Usa 'title' que é o nome real da coluna
                    description,
                    price: parseFloat(price),
                    duration_minutes: parseInt(duration || 30), // Duração padrão de 30min
                    provider_id: provider_id // Salva que esse serviço é DESTE usuário
                }])
                .select();

            if (error) throw error;

            return res.status(201).json({ message: "Serviço criado com sucesso!", service: data[0] });

        } catch (error) {
            console.error("Erro no createService:", error);
            console.log("req.user content:", req.user);
            return res.status(500).json({
                error: "Erro ao criar serviço.",
                details: error.message || error,
                user_id_attempt: req.user?.id
            });
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