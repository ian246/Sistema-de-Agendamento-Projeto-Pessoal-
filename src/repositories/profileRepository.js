import { supabase } from '../config/supabaseClient.js';

export const profileRepository = {

    // Metodos que precisaremos criar
    // Buscar todos os Perfil que a Barbearia presta. findAll
    // Buscar um Perfil pelo ID. findById
    // Atualizar um Perfil pelo ID. updateProfile

    async findById(id) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*') // GET
            .eq('id', id);
        // .single();
        if (error) {
            throw new Error(error.message);
        }
        return data[0];

    },
    async findAllProviders() {

        const { data, error } = await supabase
            .from('profiles')
            .select('*') // GET
            .eq('role', 'provider')
            .order('full_name', { ascending: true });
        if (error) {
            throw new Error(error.message)
        }
        return data;
    },
    async updateProfile(id, updateData) {

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData) // PUT
            .eq('id', id)
            .select();
        // .single();
        if (error) {
            throw new Error(error.message);
        } return data[0];
    },


}