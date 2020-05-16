const express = require('express');
const authMiddleware = require('../../app/middlewares/auth');
const router = express.Router();

const Task = require('../models/task');
const Projects = require('../models/projects');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try{
    const projects = await Projects.find().populate(['user', 'tasks']); /** REALIZA A BUSCA DOS DADOS DO USUÁRIO ASSOCIADO */
     
    return res.send({projects});

  }catch(err){
    return res.status(400).send({ error: 'Error loading projects'});
  }

  /** AGORA EM CADA REQUISIÇÃO É POSSIVEL VERIFICAR A AUTENTICIDADE DO USUÁRIO*/
})


router.get('/:projectId', async (req, res) => {
  try{
    const project = await Projects.findById(req.params.projectId).populate(['user', 'tasks']);; /** REALIZA A BUSCA DOS DADOS DO USUÁRIO ASSOCIADO */
     
    return res.send({project});

  }catch(err){

    return res.status(400).send({ error: 'Error loading projects'});

  }
})


router.post('/', async(req, res) => {

  try{
    const { title, description, tasks} = req.body;

    const project = await  Projects.create({ title, description, user: req.userId }); /** SEPARAR EM PARTES E ENVIAR O USERID COMO PARAMETRO USER DENTRO DO MODEL */

    await Promise.all(tasks.map( async task => {
      const projectTask = new Task({ ...task, project: project._id});

      await projectTask.save();

      project.tasks.push(projectTask);
    })); /** SOMENTE EXECUTARÁ O PROXIMO SAVE AO TERMINAR ESSE BLOCO DE CODIGO PROMISSE.ALL */

    await project.save();

    return res.send({ project });
  }catch(err){

    return res.status(400).send({ error: 'Error creating new project'});

  }

  // res.send({ user: req.userId });
})

/** ROUTE DE ATUALIZAÇÃO DE PROJETO */
router.put('/:projectId', async (req, res) => {
  
  try{
    const { title, description, tasks} = req.body;

    const project = await  Projects.findByIdAndUpdate(req.params.projectId, { 
      title, description}, {new: true, useFindAndModify: false}); /** SEPARAR EM PARTES E ENVIAR O USERID COMO PARAMETRO USER DENTRO DO MODEL */

    projects.tasks = [];

    await Task.remove({ project: project._id});

    await Promise.all(tasks.map( async task => {
      const projectTask = new Task({ ...task, project: project._id});

      await projectTask.save();

      project.tasks.push(projectTask);
    })); /** SOMENTE EXECUTARÁ O PROXIMO SAVE AO TERMINAR ESSE BLOCO DE CODIGO PROMISSE.ALL */

    await project.save();

    return res.send({ project });
  }catch(err){

    return res.status(400).send({ error: 'Error creating project'});

  }

})

router.delete('/:projectId', async (req, res) => {
  try{
    await Projects.findByIdAndRemove(req.params.projectId).populate('user'); /** REALIZA A BUSCA DOS DADOS DO USUÁRIO ASSOCIADO */
     
    return res.send();

  }catch(err){

    return res.status(400).send({ error: 'Error delete projects'});

  }
})



module.exports = app => app.use('/projects', router);

/** ARQUIVO DOS PROJETOS */
/** CRIAÇÃO DE MIDDLEWARE EXIGINDO O TOKEN VERIFICANDO O REQ E RES */