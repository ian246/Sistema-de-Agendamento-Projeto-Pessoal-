// Onde fica as rotas do Front-end e a URLs

import express from 'express';
// imports do controllers ⬇️⬇️⬇️
// ...
// ...
// ...

const router = express.Router();

router.get('/', (req, res) => { res.send("Rota de Agendamento Funcionando!") });

export default router;