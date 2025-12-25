// Configura o Express


import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profileRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js'; // Correção do erro, adicionando 
// o caminho completo com o .js
import authRoutes from './routes/authRoutes.js';

const app = express();

//Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express.json());

// Health check routes (importante para Render e monitoramento)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Backend de Agendamento está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota de teste
app.get('/', (req, res) => {
    res.send("Api de Agendamento Rodando!")
});

//Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/auth', authRoutes);

// Middleware de erro global (deve estar DEPOIS de todas as rotas)
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Erro interno do servidor',
            status: err.status || 500,
            timestamp: new Date().toISOString()
        }
    });
});

// Rota 404 - quando nenhuma rota é encontrada
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Rota não encontrada',
            path: req.originalUrl,
            status: 404
        }
    });
});

export default app;