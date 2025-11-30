import { profileRespository } from "../respositories/profileRepository.js";

export const profileService = {

    //1. Fazer busca de todos os prestadores de Serviço.
    async findAll() {
        return profileRespository.findAllProviders();
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
        return await profileRespository.updateProfile(id, dataToUpdate);
    },

}