import { supabase } from '../config/supabaseClient.js';

export const authController = {
    // --- LOGIN ---
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validação básica
            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            // Chama o Supabase para autenticar
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            // NOVO: Buscar o profile para pegar o role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('full_name, role')
                .eq('id', data.user.id)
                .single();

            // Sucesso! Retorna o token e os dados do usuário COM O ROLE
            return res.status(200).json({
                message: 'Login realizado com sucesso',
                token: data.session.access_token,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: profile?.full_name || data.user.user_metadata?.name,
                    role: profile?.role || 'client' // Default para client se não achar
                }
            });

        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    },

    // --- CADASTRO (REGISTER) ---
    async register(req, res) {
        try {
            // Agora esperamos receber nome, telefone e se é barbeiro ou cliente
            const { email, password, name, phone, role } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
            }

            // 1. Cria login no Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) return res.status(400).json({ error: authError.message });

            if (authData.user) {
                // 2. CORREÇÃO AQUI: Usamos UPSERT para vencer o Trigger
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authData.user.id,        // O ID obrigatoriamente igual ao Auth
                        email: email,
                        full_name: name,
                        phone: phone ? String(phone) : null, // Converte número para texto para não dar erro
                        role: role || 'client',
                        avatar_url: null,
                        updated_at: new Date()       // Marca a hora da atualização
                    });

                if (profileError) {
                    console.error("Erro perfil:", profileError);
                    return res.status(400).json({ error: "Erro ao criar perfil detalhado: " + profileError.message });
                }

                return res.status(201).json({
                    message: 'Usuário cadastrado com sucesso!',
                    user: {
                        id: authData.user.id,
                        email,
                        name,
                        role: role || 'client'
                    }
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno' });
        }
    }
};