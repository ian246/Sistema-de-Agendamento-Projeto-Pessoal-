// Onde fica as regras de negócio pesada

import { appointmentRepository } from '../repositories/appointmentRepository.js';
import { serviceRepository } from '../repositories/serviceRepository.js';


export const appointmentService = {
    async createAppointment(clientId, providerId, serviceId, startTimeString) {
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
            start_time: startTime.toISOString(), // Salva no padrão ISO
            end_time: endTime.toISOString(), // Salva no padrão ISO
            price: service.price,
            status: 'confirmed'
        };

        return appointmentRepository.create(appointmentData);

    }

}