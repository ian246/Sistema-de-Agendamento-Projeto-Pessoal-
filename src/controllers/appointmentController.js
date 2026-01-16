// src/controllers/appointmentController.js
import { appointmentService } from '../services/appointmentService.js';

export const appointmentController = {
    async create(req, res) {
        try {
            const { client_id, provider_id, service_id, start_time, cut_description, reference_image_url } = req.body;

            const appointment = await appointmentService.createAppointment(
                client_id,
                provider_id,
                service_id,
                start_time,
                cut_description,
                reference_image_url
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
    },

    // GET /api/appointments/provider/me - Lista agendamentos do provider logado
    async getProviderAppointments(req, res) {
        try {
            const providerId = req.user.id;

            const appointments = await appointmentService.listProviderAppointments(providerId);
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // GET /api/appointments/provider/:providerId/date/:date - Horários ocupados para booking
    async getAppointmentsByProviderAndDate(req, res) {
        try {
            const { providerId, date } = req.params;

            console.log(`[DEBUG] Buscando agendamentos - Provider: ${providerId}, Date: ${date}`);

            // Valida formato da data (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD' });
            }

            const appointments = await appointmentService.getAppointmentsByProviderAndDate(providerId, date);

            console.log(`[DEBUG] Agendamentos encontrados: ${appointments.length}`);
            console.log('[DEBUG] Dados:', JSON.stringify(appointments, null, 2));

            return res.status(200).json(appointments);
        } catch (error) {
            console.error('[DEBUG] Erro:', error.message);
            return res.status(500).json({ error: error.message });
        }
    },
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const userId = req.user.id;

            const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status, userId);

            return res.status(200).json(updatedAppointment);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
};