import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient.js';

// Middleware que valida se o Token é válido
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

    try {
        // 1. Validar Assinatura do Token (Requer JWT_SECRET no .env)
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Buscar o Role CORRETO na tabela profiles (O token do Supabase traz role='authenticated')
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', verified.sub || verified.id)
            .single();

        if (error || !profile) {
            // MELHORIA: Se não achar no banco, bloqueia o acesso.
            // Motivo: Se o usuário foi deletado ou banido, o token antigo não deve funcionar.
            console.warn("Perfil não encontrado ou erro no banco.");
            return res.status(403).json({ error: 'Perfil de usuário inválido ou não encontrado.' });
        }

        // Se achou, mistura tudo
        req.user = { ...verified, ...profile };
        next();

    } catch (err) {
        console.error("Erro Auth Middleware:", err.message);
        res.status(403).json({ error: 'Token inválido ou expirado' });
    }
};

// NOVO: Middleware que barra quem não é Barbeiro/Provider
export const checkIsProvider = (req, res, next) => {
    // Verifica se o role dentro do token é 'provider' ou 'barber'
    if (req.user.role !== 'provider' && req.user.role !== 'barber') {
        return res.status(403).json({
            error: 'Acesso restrito. Apenas prestadores de serviço podem realizar essa ação.'
        });
    }
    next();
};
