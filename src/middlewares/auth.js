const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
/** VERIFICAÇÃO DE LOGIN DENTRO DO SISTEMA */
/** IMPORTADO NO PROJECTS CONTROLLER */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader)
    return res.status(401).send({ error: 'No token provided'});
    const parts = authHeader.split(' ');

    /** VERIFICAÇÃO DO FORMATO TOKEN */
    if(!parts.length === 2)
      return res.status(401).send({ error: 'Token error'});

    const [ scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme))
      return  res.status(401).send({ error: 'Token malformatted'});


    jwt.verify(token, authConfig.secret, (err, decoded) =>{
      if(err) return res.status(401).send({ error: 'Token invalid'});

      req.userId = decoded.id;

      return next();
    })


    
    // ex formatted token: Bearer vhvhvh24234fhvhsh2134h23h42v34h23v4234234234

}