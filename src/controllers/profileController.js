import { profileService } from '../services/profileService.js';

export const profileController = {

    async updateProfile(req, res) {
        try {
            const { id } = req.params;
            const { phone, full_name } = req.body;
            const updateProfile = await profileService.updateProfile(id, phone, full_name)
            return res.status(200).json(updateProfile)

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    // PUT /api/profiles/me - Atualiza o perfil do usuário logado
    async updateMyProfile(req, res) {
        try {
            const userId = req.user.id;
            const { full_name, phone, salon_name, address, salon_image_url } = req.body;

            const updatedProfile = await profileService.updateMyProfile(userId, {
                full_name,
                phone,
                salon_name,
                address,
                salon_image_url
            });

            return res.status(200).json(updatedProfile);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    // GET /api/profiles/me - Retorna o perfil do usuário logado
    async getMyProfile(req, res) {
        try {
            const userId = req.user.id;
            const profile = await profileService.findById(userId);

            if (!profile) {
                return res.status(404).json({ error: 'Perfil não encontrado.' });
            }

            return res.status(200).json(profile);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async findAllProviders(req, res) {
        try {
            const findAllProviders = await profileService.findAll();
            return res.status(200).json(findAllProviders)

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

}