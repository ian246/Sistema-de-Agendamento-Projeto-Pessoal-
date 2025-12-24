// Responsabilidade: Ele só sabe falar com o Supabase.
// Ele não valida se o preço está certo ou errado(isso ocorre no controller),
// ele apenas salva ou busca.

import { supabase } from '../config/supabaseClient.js'

export const serviceRepository = {

    //1. Buscar todos os Serviços que a Barbearia presta. findAll     
    async findAll() {
        const { data, error } = await supabase
            .from('services')
            .select('*'); // Pega ID, Título, Preço...
        if (error) throw new Error(error.message);
        return data;
    },

    //2. Criação de um novo Serviço. create
    async create(serviceData) {
        const { data, error } = await supabase
            .from('services') // Tabela que eu quero inserir
            .insert([serviceData])
            .select(); // Selecionar o registro criado
        // .single(); // Retorna apenas um registro == > No caso o que foi criado

        // Validação simples para assincronismo        
        if (error) {
            throw new Error(error.message)
        } return data[0];
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', id);
        // .single();

        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }
}