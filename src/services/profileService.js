import { profileRepository } from "../repositories/profileRepository.js";

export const profileService = {

    //1. Fazer busca de todos os prestadores de Serviço.
    async findAll() {
        return profileRepository.findAllProviders();
    },

    // Busca um perfil pelo ID
    async findById(id) {
        return profileRepository.findById(id);
    },

    async updateProfile(id, phone, fullname) {

        if (!id) { // Primary Key
            throw new Error("Precisa-se do id para que seja possivel atualizar o Provider.")
        }

        if (!phone && !fullname) {
            throw new Error("Precisa-se de pelo menos um campo (telefone ou nome) para atualizar.")
        }

        const dataToUpdate = {};
        if (fullname) dataToUpdate.full_name = fullname;
        if (phone) dataToUpdate.phone = phone;

        // 3. Chama o repositório
        return await profileRepository.updateProfile(id, dataToUpdate);
    },

    // Atualiza o perfil do usuário logado (aceita campos de salão)
    async updateMyProfile(userId, profileData) {
        if (!userId) {
            throw new Error("ID do usuário é obrigatório.");
        }

        const { full_name, phone, salon_name, address, salon_image_url } = profileData;

        // Verificar se pelo menos um campo foi fornecido
        if (!full_name && !phone && !salon_name && !address && !salon_image_url) {
            throw new Error("Precisa-se de pelo menos um campo para atualizar.");
        }

        const dataToUpdate = {};
        if (full_name !== undefined) dataToUpdate.full_name = full_name;
        if (phone !== undefined) dataToUpdate.phone = phone;
        if (salon_name !== undefined) dataToUpdate.salon_name = salon_name;
        if (address !== undefined) dataToUpdate.address = address;
        if (salon_image_url !== undefined) dataToUpdate.salon_image_url = salon_image_url;

        return await profileRepository.updateProfile(userId, dataToUpdate);
    },

}