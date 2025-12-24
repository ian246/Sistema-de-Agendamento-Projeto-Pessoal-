// src/controllers/appointmentController.js
import { appointmentService } from '../services/appointmentService.js';

export const appointmentController = {
    async create(req, res) {
        try {
            const { client_id, provider_id, service_id, start_time } = req.body;

            const appointment = await appointmentService.createAppointment(
                client_id,
                provider_id,
                service_id,
                start_time
            );

            return res.status(201).json(appointment);
        } catch (error) {
            if (error.message.includes("indisponível")) {
                return res.status(409).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }
    },

    async listMyAppointments(req, res) {
        try {
            const { client_id } = req.params;

            const appointments = await appointmentService.listMyAppointments(client_id);
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};