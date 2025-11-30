import { profileService } from '../services/profileService.js';

export const profileController = {

    async updateProfile(req, res) {
        try {
            const { id } = req.params;
            const { phone, fullname } = req.body;
            const updateProfile = await profileService.updateProfile(id, phone, fullname)
            return res.status(200).json(updateProfile)

        } catch (error) {
            return res.status(500).json({ error: error.message })
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