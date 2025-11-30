// Configura o Express
//Aqui configuramos os middlewares (plugins) do servidor.

import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profileRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js'; // Correção do erro, adicionando 
// o caminho completo com o .js

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes)
app.use('/api/profiles', profileRoutes)

// Rota de teste
app.get('/', (req, res) => { res.send("Api de Agendamento Rodando!") });

export default app;