import express from 'express';
import { serviceController } from '../controllers/serviceController.js';
import { authenticateToken, checkIsProvider } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- ROTAS PÚBLICAS (Ou só autenticadas para clientes) ---
// Cliente clica no Roberto (ID 123) e quer ver os serviços dele:
router.get('/provider/:providerId', authenticateToken, serviceController.getServicesByProviderId);


// --- ROTAS DO PRESTADOR (Blindadas pelo Middleware) ---

// Criar novo serviço (Ex: Roberto cria "Pezinho" por R$20)
router.post('/', authenticateToken, checkIsProvider, serviceController.createService);

// Ver todos os serviços que EU criei (Para o Dashboard)
router.get('/me', authenticateToken, checkIsProvider, serviceController.getMyServices);

// Atualizar um serviço meu
router.put('/:id', authenticateToken, checkIsProvider, serviceController.updateService);

// Deletar um serviço meu
router.delete('/:id', authenticateToken, checkIsProvider, serviceController.deleteService);

export default router;
