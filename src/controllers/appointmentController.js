// src/controllers/appointmentController.js
import { appointmentService } from '../services/appointmentService.js';

export const appointmentController = {
    async create(req, res) {
        try {
            // 1. Extrai dados do body da requisição
            const { client_id, provider_id, service_id, start_time } = req.body;

            // 2. Chama o Service para executar a lógica
            const appointment = await appointmentService.createAppointment(
                client_id,
                provider_id,
                service_id,
                start_time
            );

            // 3. Sucesso! Agendamento criado.
            return res.status(201).json(appointment);
        } catch (error) {
            // Se a mensagem for sobre conflito, usamos um código HTTP específico: 409 Conflict.
            if (error.message.includes("indisponível")) {
                return res.status(409).json({ error: error.message });
            }
            // Outros erros (validação, not found) retornam 400 Bad Request.
            return res.status(400).json({ error: error.message });
        }
    }
};