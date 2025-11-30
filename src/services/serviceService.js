// Aqui será feita as regas para que eu possa chamar o meu repository e realizar as funções
// findAll e create, teremos validações simples para que o usuario não crie
// algo que o banco não está preparado para receber.

import { serviceRepository } from '../respositories/serviceRepository.js';

export const serviceService = {
    //1. Não precisa de velidação, pois aqui eu apenas estou buscando os dados.
    async getAllServices() {
        // 2. Chamar o repository para fazer a comunicação direta com o banco
        return await serviceRepository.findAll()
    },


    // 2. Criação de um novo serviço, aqui necessariamente eu preciso validar
    async createService(title, description, price, duration) {

        // 1- Validações simples 
        if (!title) {
            throw new Error("Precisa ter um titulo para o seu serviço");
        }

        if (!description) {
            throw new Error("Precisa ter uma descrição para o seu serviço");
        }

        if (!price && price < 0)
            throw new Error('Precisa ter um preço e que seja maior que 0.')

        if (!duration && duration < 0)
            throw new Error('Precisa ter uma duração e que seja maior que 0.')

        // 2- Criar um modelo que seja aceitavel no parametro do create do repository
        const newService = {
            title,
            description,
            price,
            duration_minutes: duration,
            active: true
        }

        // 3- Chamar o repository para fazer a comunicação direta com o banco
        return await serviceRepository.create(newService)
    }

}