const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');
const { route } = require('./userRouter');
const router = express.Router();

// GET /tasks?completed=true --> filtering
// GET /tasks?limit=10&skip=0  --> Pagination
// GET /tasks?sortBy=createdAt:desc -->Sorting
router.get('/tasks', auth, async (req, res)=>{
    const match = {};
    const sort = {};
    try {
        if(req.query.completed){
            match.completed = req.query.completed === 'true';
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
        }

        await req.user.populate({ //populate permite obtener un subdocumento de la relacion establecida entre user-tasks. Si uso corchetes me permite agregarle opciones a los documentos obtenidos
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), //cuantos resultados devolver
                skip: parseInt(req.query.skip), //cuantos resultados saltarse de los disponibles (paginacion);
                sort
            }
        });
        res.status(200).send(req.user.tasks);
    }
    catch(e){
        res.status(500).send(e)
    }
});

router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id;

    try {
        const task = await Task.findOne({_id, user: req.user._id});
        if(!task){
           return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
});

router.patch('/tasks/:id', auth, async(req, res)=>{
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const validEdits = ['description']
    const isValid = updates.every((update)=> validEdits.includes(update));

    if(!isValid){
        return res.status(400).send({error: 'Cant edit these values'});
    }

    try{
        const task = await Task.findOne({_id, user: req.user._id});
        console.log(task);
        if(!task){
            return res.status(404).send({error: 'The task was not found'});
        }
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
    }catch(e){
        res.status(500).send(e);
    }


});

router.post('/tasks', auth, async (req, res)=>{
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body, //esta notacion permite copiar todo el contenido de req.body dentro del objeto task
        user: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete("/tasks/:id", auth, async (req, res)=>{
    const _id = req.params.id;
    //console.log(_id)
    try {
        const task = await Task.findOneAndDelete({_id, user: req.user._id});
        if(!task){
           return res.status(404).send('Task not found');
        }
        res.status(200).send(task);
    }catch(e){
        res.status(500).send(e);
    }
});


module.exports = router;