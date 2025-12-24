// Conexão unica com o banco
// Este arquivo cria uma instância única do Supabase para o projeto todo usar.
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// GARANTA QUE O NOME AQUI É IGUAL AO DO .ENV
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false, // Boa prática para backend
        autoRefreshToken: false,
    }
});
