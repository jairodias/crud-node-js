const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

const User = require('../../app/models/users.js');

const router = express.Router();

function generateToken(params = {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post('/register', async(req, res) => {
  const { email } = req.body;
  try{
    if(await User.findOne({ email }))
      return res.status(400).send({ error: 'User already exists'});

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({id: user.id })
    });

  } catch(err){
    console.log(err);
    return res.status(400).send({ error: 'Registration failed'});
  }
})

router.post('/authenticate', async (req, res) => {
  const { email, password} = req.body;

  const user = await User.findOne({email}).select('+password'); /** tras a senha na requisição */

  if(!user)
  return res.status(400).send({ error: 'User not found'});
  
  if(!await bcrypt.compare(password, user.password)){ /** COMPRA A SENHA HASH COM A DIGITADA */
    return res.status(400).send({ error: "Invalid password"});
  }
  user.password = undefined;

  return res.status(200).send({ 
    user,
    token: generateToken({ id: user.id}) 
  });

});

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try{
    const user = await User.findOne({email}); /** busca de usuário */
    
    if(!user)
      return res.status(400).send({ error: 'User not found'});
    
    const token = crypto.randomBytes(20).toString('hex'); /** gera um token de 20 caracters*/

    const now = new Date();
    now.setHours(now.getHours() + 1); /** definido uma hora para expiração do token a partir do momento em que enviado */

    /** class do proprio node (ENCONTRA E ALTERA) */
    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
      }
    }, {new: true, useFindAndModify: false}); /** A função esta deprecated, logo implementendi o parametro false e usei a antiga */

    mailer.sendMail({
        to: email,
        from: 'jairopereira_dias@hotmail.com',
        template: 'auth/forgot_password',
        context: { token } /** PASSANDO A VARIAVEL PARA O TEMPLATE */
    }, (err) => {
      if(err)
        return res.status(400).send({ error: 'Cannot send forgot password email'});

        return res.send();
    })
  }catch (err){
    console.log("teste: " + err);
    res.status(400).send({ error: 'Error on forgot password, try again'});
  }
});

router.post('/reset_password', async (req, res) => {
  const { email, token, password } = req.body;

  try{
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');

    if(!user)
      res.status(400).send({ error: 'User not found'});

    if(token !== user.passwordResetToken)
      return res.status(400).send({ error: 'Token invalid'});

    const now = new Date();

    if(now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Token expired, generate a new one'});

    user.password = password;

    await user.save();

    res.send({ user });

  }catch(err){
    console.log("teste: " + err);
    res.status(400).send({ error: 'Cannot reset password, try again'});
  }
});
// GROUP
module.exports = app => app.use('/auth', router);


// PARA CRIAR A JWT => YARN ADD JSONWEBTOKEN

/** 
    CRIADO PARA GERAR UM TOKEN DE AUTH DE CADA REQUISIÇÃO DENTRO DO SISTEMA
    COM PRAZO LIMITE DE DE 1 DIA DENTRO DA APLICAÇÃO E IMPORTADO DENTRO DA FUNÇÃO
    JWT NA AUTHCONTROLLER
*/ 
