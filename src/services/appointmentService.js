

import { appointmentRepository } from '../repositories/appointmentRepository.js';
import { serviceRepository } from '../repositories/serviceRepository.js';


export const appointmentService = {
    async createAppointment(clientId, providerId, serviceId, startTimeString, cutDescription = null, referenceImageUrl = null) {
        const startTime = new Date(startTimeString);

        if (Number.isNaN(startTime.getTime())) {
            throw new Error('Data e hora Inválida')
        }
        if (startTime < new Date) {
            throw new Error("Agendamentos não podem ser criados para datas passadas")
        }


        const service = await serviceRepository.findById(serviceId);
        if (!service) {
            throw new Error("Serviço não encontrado. Escolha outro.")

        }

        const durationMs = service.duration_minutes * 60 * 1000;
        const endTime = new Date(startTime.getTime() + durationMs);

        const isOccupied = await appointmentRepository.hasConflict(providerId, startTime, endTime);
        if (isOccupied) {
            throw new Error("Horário indisponível. O prestador está ocupado neste intervalo.");
        }


        const appointmentData = {
            client_id: clientId,
            provider_id: providerId,
            service_id: serviceId,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            price: service.price,
            status: 'pending',
            cut_description: cutDescription,
            reference_image_url: referenceImageUrl
        };

        return appointmentRepository.create(appointmentData);

    },

    async listMyAppointments(clientId) {
        return appointmentRepository.findByClientId(clientId);
    },

    // Lista agendamentos do provider
    async listProviderAppointments(providerId) {
        return appointmentRepository.findByProviderId(providerId);
    },

    // Busca agendamentos de um provider em uma data específica (para booking)
    async getAppointmentsByProviderAndDate(providerId, date) {
        return appointmentRepository.findByProviderIdAndDate(providerId, date);
    },

    async updateAppointmentStatus(appointmentId, status, userId, cancellationReason = null) {
        // 1. Validar status
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error('Status inválido. Use: ' + validStatuses.join(', '));
        }

        // 2. Buscar agendamento
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Agendamento não encontrado');
        }

        // 3. Verificar permissão
        const isProvider = appointment.provider_id === userId;
        const isClient = appointment.client_id === userId;

        if (!isProvider && !isClient) {
            throw new Error('Você não tem permissão para alterar este agendamento');
        }

        // Se for o cliente, só pode cancelar
        if (isClient && status !== 'cancelled') {
            throw new Error('Clientes só podem cancelar agendamentos');
        }

        // 4. Se for aceitar/recusar, verificar se transição faz sentido
        if (appointment.status === 'cancelled') {
            throw new Error('Não é possível alterar um agendamento cancelado');
        }

        // Se estiver cancelando, o motivo é útil.
        return appointmentRepository.updateStatus(appointmentId, status, cancellationReason);
    }
}