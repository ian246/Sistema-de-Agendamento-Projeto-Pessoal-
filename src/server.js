// Arquivo que inicia o servidor
// Arquivo que coloca tudo para rodar.

import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Aqui ele começa a escutar a porta 3000
app.listen(PORT, () => { console.log(`🚀 Server is running on port ${PORT}`); });