// Arquivo que inicia o servidor


import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Local: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`⏰ Started at: ${new Date().toLocaleString('pt-BR')}`);
    console.log('='.repeat(50));
}).on('error', (err) => {
    console.error('❌ Erro ao iniciar servidor:', err.message);
    process.exit(1);
});