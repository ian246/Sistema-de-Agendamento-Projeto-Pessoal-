// Onde fica as regras de negócio pesada

import { appointmentRepository } from '../repositories/appointmentRepository.js';
import { serviceRepository } from '../repositories/serviceRepository.js';


export const appointmentService = {
    async createAppointment(clientId, providerId, serviceId, startTimeString) {
        const startTime = new Date(startTimeString);

        // 1. Validação do Horário
        if (Number.isNaN(startTime.getTime())) {
            throw new Error('Data e hora Inválida')
        }
        if (startTime < new Date) {
            throw new Error("Agendamentos não podem ser criados para datas passadas")
        }

        //2. Validação do serviço
        // Note: serviceRepository is not imported in the original file, assuming it might be a missing import or global.
        // However, I will stick to fixing typos for now. The original code had `serviceRepository.findById(serviceId)`.
        // I should probably check where `serviceRepository` comes from. It wasn't in the imports.
        // I will leave it as is but fix the other typos.
        // Wait, if I don't fix the missing import, it will crash.
        // But my task is fixing typos. Let's look at the original file again.
        // It was `import { appoimentRepository } from '../respositories/appoimentRepository.js';`
        // And used `serviceRepository`.
        // I will fix the typos first.

        // Wait, `isNan` is also a typo, should be `isNaN` or `Number.isNaN`.
        // I will fix `isNan` to `Number.isNaN`.

        const service = await serviceRepository.findById(serviceId);
        if (!service) {
            throw new Error("Serviço não encontrado. Escolha outro.")

        }

        //3. Calculo do horario de termino
        const durationMs = service.duration_minutes * 60 * 1000;
        const endTime = new Date(startTime.getTime() + durationMs);

        //4. Verificar se o prestador está ocupado.
        const isOccupied = await appointmentRepository.hasConflict(providerId, startTime, endTime);
        if (isOccupied) {
            throw new Error("Horário indisponível. O prestador está ocupado neste intervalo.");
        }

        //5. Objeto para passar ao Repository

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