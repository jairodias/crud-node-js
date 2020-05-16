const express = require('express');
const authMiddleware = require('../../app/middlewares/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  /** AGORA EM CADA REQUISIÇÃO É POSSIVEL VERIFICAR A AUTENTICIDADE DO USUÁRIO*/
  res.send({ ok: true, user: req.userId});
})



module.exports = app => app.use('/projects', router);

/** ARQUIVO DOS PROJETOS */
/** CRIAÇÃO DE MIDDLEWARE EXIGINDO O TOKEN VERIFICANDO O REQ E RES */