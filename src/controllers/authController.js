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

            // Sucesso! Retorna o token e os dados do usuário
            return res.status(200).json({
                message: 'Login realizado com sucesso',
                token: data.session.access_token,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.name // Pega o nome se tiver salvo
                }
            });

        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    },

    // --- CADASTRO (REGISTER) ---
    // Útil se você quiser criar usuários pelo Postman/App
    async register(req, res) {
        try {
            const { email, password, name } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha obrigatórios' });
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name: name || '' } // Salva o nome nos metadados do usuário
                }
            });

            if (error) throw error;

            return res.status(201).json({
                message: 'Usuário criado com sucesso!',
                user: data.user
            });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
};