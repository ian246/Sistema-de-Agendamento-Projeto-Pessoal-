// Aqui eu farei toda a parte de controle http com o meu banco de dados, retornos JSON.
// retorno dos Status Code (200, 201, 400, 404, 500) etc.
// Extrair os dados JSON


import { serviceService } from '../services/serviceService.js';

export const serviceController = {
    // GET / api / service

    // Validações HTTP e retorno JSON para o     
    async listServices(req, res) {
        try {
            const services = await serviceService.getAllServices();
            return res.status(200).json(services);
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },


    // Validações HTTP e retorno JSON para o Create
    async create(req, res) {
        try {
            // 1. Extrair dados do body
            const { title, description, price, duration } = req.body;
            const createdService = serviceService.createService(title, description, price, duration);
            return res.status(201).json(createdService);
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}